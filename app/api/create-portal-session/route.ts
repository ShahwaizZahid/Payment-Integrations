import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerId } = body;

    if (!customerId || typeof customerId !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid customerId in request body." },
        { status: 400 },
      );
    }

    const origin = new URL(request.url).origin;

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${origin}`,
    });

    return NextResponse.json({
      url: session.url,
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Webhook verification failed";

    console.error("❌", message);
    console.error("Portal session error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
