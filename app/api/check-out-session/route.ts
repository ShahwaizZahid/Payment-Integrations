// ...existing code...
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log(body, "body");
    const priceId = body?.priceId;
    const userId = body?.userId;
    if (!priceId || typeof priceId !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid priceId in request body." },
        { status: 400 },
      );
    }

    const origin = new URL(request.url).origin;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],

      metadata: {
        userId: userId,
      },
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel`,
    });

    return NextResponse.json({
      url: session.url,
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Webhook verification failed";

    console.error("Checkout session error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
