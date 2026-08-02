import { NextResponse, NextRequest } from "next/server";
import Stripe from "stripe";

const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

export async function POST(request: NextRequest) {
  try {
    if (!stripe) {
      return NextResponse.json(
        { error: "Stripe secret key missing from environment variables." }, 
        { status: 500 }
      );
    }

    const body = await request.json();
    const cartItems = body.cartItems || body.items;

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: "Basket is empty" }, { status: 400 });
    }

    // Determine if the cart contains hampers or is heavy
    const totalWeightUnits = cartItems.reduce((acc: number, item: any) => {
      const isHamper = item.name.toLowerCase().includes("hamper");
      return acc + (isHamper ? 3 : 1) * item.quantity;
    }, 0);

    const isHeavyOrder = totalWeightUnits >= 3;

    const lineItems = cartItems.map((item: any) => ({
      price_data: {
        currency: "gbp",
        product_data: {
          name: item.scent ? `${item.name} (${item.scent})` : item.name,
          images: item.img ? [request.nextUrl.origin + item.img] : [],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      shipping_address_collection: {
        allowed_countries: ["GB"], 
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 299, // £2.99 Local Hand Delivery
              currency: "gbp",
            },
            display_name: "Local Birmingham Hand Delivery (B Postcodes)",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 1 },
              maximum: { unit: "business_day", value: 2 },
            },
          },
        },
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: isHeavyOrder ? 599 : 399, // £3.99 standard, £5.99 for hampers
              currency: "gbp",
            },
            display_name: isHeavyOrder 
              ? "UK Courier Shipping (Hampers & Multi-item Bundles)" 
              : "Standard UK Tracked Shipping (Royal Mail / Evri)",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 2 },
              maximum: { unit: "business_day", value: 4 },
            },
          },
        },
      ],
      success_url: `${request.nextUrl.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/cart`,
    });

    return NextResponse.json({ id: session.id, url: session.url });
  } catch (err: any) {
    console.error("Stripe Session Creation Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}