import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = Date.now() + 48 * 60 * 60 * 1000; // 48 hours from now

    // Retrieve existing invites from local storage mock or persistent store
    const existingInvites = JSON.parse(process.env.RAILAXATION_INVITES || "[]");
    existingInvites.push({ token, email: cleanEmail, expiresAt, used: false });
    process.env.RAILAXATION_INVITES = JSON.stringify(existingInvites);

    const inviteLink = `${request.headers.get("origin") || "http://localhost:3000"}/accept-invite?token=${token}`;

    return NextResponse.json({ success: true, inviteLink, expiresAt });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}