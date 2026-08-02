import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const { orderId, email, localOrders } = await req.json();

    if (!orderId || !email) {
      return NextResponse.json(
        { error: "Please enter both Order Reference ID and Email." },
        { status: 400 }
      );
    }

    const cleanInput = orderId.trim();
    const cleanEmail = email.trim().toLowerCase();

    // 1. Check if the order exists in the client-provided local orders history payload
    if (localOrders && Array.isArray(localOrders)) {
      const matchedLocalOrder = localOrders.find((o: any) => {
        const matchesId = 
          o.trackingNumber?.toLowerCase() === cleanInput.toLowerCase() || 
          o.orderId?.toLowerCase() === cleanInput.toLowerCase() ||
          o.id?.toString().toLowerCase() === cleanInput.toLowerCase();

        const matchesEmail = o.email?.toLowerCase().trim() === cleanEmail;
        return matchesId && matchesEmail;
      });

      if (matchedLocalOrder) {
        // Safely map actual items and quantities from the local order record
        const itemsList = Array.isArray(matchedLocalOrder.items)
          ? matchedLocalOrder.items.map((item: any) => {
              const qty = item.quantity || 1;
              const freeNote = item.isFreeItem ? " (🎁 BOGO Free Item)" : "";
              const scentNote = item.scent ? ` - Scent: ${item.scent}` : "";
              return `${item.name}${scentNote}${freeNote} - Qty: ${qty}`;
            })
          : ["Railaxation Handcrafted Item"];

        return NextResponse.json({
          success: true,
          order: {
            id: matchedLocalOrder.orderId || matchedLocalOrder.trackingNumber || cleanInput,
            customerName: matchedLocalOrder.name || matchedLocalOrder.customerName || "Valued Customer",
            amount: Number(matchedLocalOrder.total || matchedLocalOrder.amount || 0).toFixed(2),
            status: matchedLocalOrder.status || "Paid & Processing",
            courier: "Railaxation Delivery",
            trackingNumber: matchedLocalOrder.trackingNumber || matchedLocalOrder.orderId || cleanInput,
            address: matchedLocalOrder.address || "Address on file",
            items: itemsList,
          },
        });
      }
    }

    // 2. If it's a Stripe Checkout Session or test session code (cs_test_...)
    if (cleanInput.startsWith("cs_")) {
      try {
        const session = await stripe.checkout.sessions.retrieve(cleanInput, {
          expand: ["line_items", "line_items.data.price.product"],
        });

        if (session && session.customer_details) {
          if (session.customer_details.email?.toLowerCase().trim() !== cleanEmail) {
            return NextResponse.json(
              { error: "Order reference and email address do not match." },
              { status: 403 }
            );
          }

          const shipping = session.customer_details.address;
          const addressString = shipping
            ? `${shipping.line1 || ""}, ${shipping.city || ""}, ${shipping.postal_code || ""}`
            : "Address on file";

          const itemsList = session.line_items?.data && Array.isArray(session.line_items.data)
            ? session.line_items.data.map((item: any) => {
              const prodName = item.description || item.price?.product?.name || "Railaxation Item";
              const qty = item.quantity || 1;
              return `${prodName} (Qty: ${qty})`;
            })
            : ["Railaxation Handcrafted Item"];

          return NextResponse.json({
            success: true,
            order: {
              id: session.id,
              customerName: session.customer_details?.name || "Valued Customer",
              amount: ((session.amount_total || 0) / 100).toFixed(2),
              status: "Paid & Processing",
              courier: "Railaxation Delivery",
              trackingNumber: session.id,
              address: addressString,
              items: itemsList,
            },
          });
        }
      } catch (stripeErr) {
        // Fall through if remote Stripe session lookup fails
      }
    }

    // 3. Return an error response if neither Stripe nor local history matched the order + email combination
    return NextResponse.json(
      { error: "No matching order found for this Order Reference and Email combination." },
      { status: 404 }
    );

  } catch (error: any) {
    return NextResponse.json(
      { error: "Invalid Order Reference Code or Email combination." },
      { status: 400 }
    );
  }
}