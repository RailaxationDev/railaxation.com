import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email, name, address, orderId, trackingNumber, total, items, appliedCode } = await req.json();

    if (!email || !orderId) {
      return NextResponse.json({ success: false, error: "Missing required order fields" }, { status: 400 });
    }

    const ownerEmail = "railaxation@gmail.com";

    // Build the dynamic items table from the actual cart items passed from checkout
    const siteOrigin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const itemsListHtml = (items || [])
      .map((item: any) => {
        const isFree = item.isFreeItem;
        const lineTotal = isFree ? 0 : item.price * (item.quantity || 1);
        const imgUrl = item.img ? new URL(item.img, siteOrigin).toString() : "";
        return `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">
            ${imgUrl ? `<img src="${imgUrl}" alt="${item.name}" style="width: 56px; height: 56px; object-fit: cover; border-radius: 8px; margin-right: 10px; vertical-align: middle;" />` : ""}
            <div style="display: inline-block; vertical-align: middle;">
              <strong>${item.name}</strong>
              ${item.scent ? `<br/><span style="color: #D4AF37; font-size: 12px;">Scent: ${item.scent}</span>` : ""}
              ${isFree ? '<br/><span style="color: #047857; font-size: 11px; font-weight: bold;">(🎁 BOGO Free Item)</span>' : ''}
            </div>
          </td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center; font-size: 12px;">
            ${isFree ? "1 free item" : `x${item.quantity || 1}`}
          </td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">
            ${isFree ? '<span style="color: #047857;">FREE (£0.00)</span>' : `£${lineTotal.toFixed(2)}`}
          </td>
        </tr>
      `;
      })
      .join("");

    // 1. Customer Receipt Email HTML
    const customerEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; color: #0B2B1B; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
        <h2 style="border-bottom: 2px solid #D4AF37; padding-bottom: 10px;">Railaxation Order Receipt</h2>
        <p>Thank you for your purchase, <strong>${name || "Valued Customer"}</strong>!</p>
        <p>We are handcrafting your items right here in Birmingham.</p>
        
        <div style="background: #eef2f0; padding: 12px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; font-size: 13px; color: #555;"><strong>Order ID:</strong> <span style="color: #0B2B1B; font-weight: bold;">${orderId}</span></p>
          <p style="margin: 6px 0 0 0; font-size: 13px; color: #555;"><strong>Tracking Reference:</strong> <span style="color: #047857; font-weight: bold;">${trackingNumber}</span></p>
          ${appliedCode ? `<p style="margin: 6px 0 0 0; font-size: 13px; color: #047857;"><strong>Promo Applied:</strong> ${appliedCode}</p>` : ""}
        </div>

        <h3 style="color: #D4AF37; margin-top: 20px;">Shipping Details:</h3>
        <p style="background: #f9f9f9; padding: 10px; border-radius: 6px; font-size: 13px; margin: 0 0 20px 0;">
          <strong>Name:</strong> ${name || "N/A"}<br/>
          <strong>Email:</strong> ${email}<br/>
          <strong>Delivery Address:</strong> ${address || "Address on file"}
        </p>

        <h3 style="color: #D4AF37; margin-top: 20px;">Items Purchased:</h3>
        <table style="width: 100%; border-collapse: collapse; text-align: left;">
          <thead>
            <tr style="background-color: #0B2B1B; color: #fff; font-size: 12px;">
              <th style="padding: 10px;">Item</th>
              <th style="padding: 10px; text-align: center;">Qty</th>
              <th style="padding: 10px; text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsListHtml}
          </tbody>
        </table>

        <div style="margin-top: 20px; text-align: right; font-size: 16px; font-weight: bold;">
          Total Paid: £${Number(total || 0).toFixed(2)}
        </div>
      </div>
    `;

    // 2. Business Notification Email HTML
    const ownerEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; color: #0B2B1B; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
        <h2 style="border-bottom: 2px solid #D4AF37; padding-bottom: 10px;">New Order Paid & Completed!</h2>
        
        <div style="background: #eef2f0; padding: 12px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; font-size: 13px; color: #555;"><strong>Order Reference / Tracking ID:</strong> <span style="color: #0B2B1B; font-weight: bold;">${trackingNumber}</span></p>
          <p style="margin: 6px 0 0 0; font-size: 13px; color: #555;"><strong>Order ID:</strong> ${orderId}</p>
          ${appliedCode ? `<p style="margin: 6px 0 0 0; font-size: 13px; color: #047857;"><strong>Active Promo:</strong> ${appliedCode}</p>` : ""}
        </div>

        <h3 style="color: #D4AF37;">Customer Details:</h3>
        <p style="font-size: 13px; color: #333; margin: 0 0 20px 0;">
          <strong>Name:</strong> ${name}<br/>
          <strong>Email:</strong> ${email}<br/>
          <strong>Shipping Address:</strong> ${address}
        </p>

        <h3 style="color: #D4AF37;">Items Purchased:</h3>
        <table style="width: 100%; border-collapse: collapse; text-align: left;">
          <thead>
            <tr style="background-color: #0B2B1B; color: #fff; font-size: 12px;">
              <th style="padding: 10px;">Item</th>
              <th style="padding: 10px; text-align: center;">Qty</th>
              <th style="padding: 10px; text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsListHtml}
          </tbody>
        </table>

        <div style="margin-top: 20px; text-align: right; font-size: 16px; font-weight: bold;">
          Total Paid: £${Number(total || 0).toFixed(2)}
        </div>
      </div>
    `;

    // Send both emails simultaneously
    const customerEmailPromise = resend.emails.send({
      from: "Railaxation Orders <onboarding@resend.dev>",
      to: email,
      subject: `Your Railaxation Order Receipt - ${orderId}`,
      html: customerEmailHtml,
    });

    const ownerEmailPromise = resend.emails.send({
      from: "Railaxation Orders <onboarding@resend.dev>",
      to: ownerEmail,
      subject: `New Order Paid & Completed - ${orderId}`,
      html: ownerEmailHtml,
    });

    await Promise.all([customerEmailPromise, ownerEmailPromise]);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Email API Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}