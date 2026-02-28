import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature || !webhookSecret) {
    return NextResponse.json(
      { error: "Missing webhook signature or secret" },
      { status: 400 },
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  try {
    switch (event.type) {
      /**
       * ✅ User successfully subscribed
       */
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        const userId = session.metadata?.userId;
        const subscriptionId = session.subscription as string;
        const customerId = session.customer as string;

        console.log("✅ Subscription started:", {
          userId,
          subscriptionId,
          customerId,
        });

        /**
         * 👉 UPDATE DATABASE HERE
         *
         * Example:
         * await db.user.update({
         *   where: { id: userId },
         *   data: {
         *     stripeCustomerId: customerId,
         *     subscriptionId,
         *     subscriptionStatus: "active",
         *     plan: "PRO",
         *   },
         * });
         */

        break;
      }

      /**
       * ✅ Monthly renewal successful
       */
      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;

        const subscriptionId =
          invoice.parent?.subscription_details?.subscription;

        console.log("Subscription renewed:", subscriptionId);

        break;
      }

      /**
       * ❌ Renewal payment failed
       */
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;

        const subscriptionId =
          invoice.parent?.subscription_details?.subscription;

        console.log("Payment failed:", subscriptionId);

        break;
      }

      /**
       * ❌ Subscription cancelled
       */
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        console.log("🚫 Subscription cancelled:", subscription.id);

        // remove premium access
        // await db.user.update({
        //   subscriptionStatus: "canceled",
        //   plan: "FREE",
        // });

        break;
      }

      default:
        console.log("Unhandled event:", event.type);
    }
  } catch (err) {
    console.error("Webhook handler error:", err);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 },
    );
  }

  return NextResponse.json({ received: true });
}

export const dynamic = "force-dynamic";
