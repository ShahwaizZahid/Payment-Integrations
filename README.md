# Stripe Payment Integration

This is a Next.js project integrating Stripe for payments. It includes a frontend for displaying pricing plans and handling checkout redirects, and a backend for creating Stripe sessions and handling webhooks.

## 🏗️ Project Structure

### 🖥️ Frontend (App Router)

The frontend provides the user interface for selecting products and handling post-payment states.

#### `/one-time-payment` & `/payment`
Displays a pricing page with different products (e.g., Pro Plan, Developer Pack, Ultimate Bundle). Users select a product and click "Pay Now" to be redirected to Stripe Checkout.

**Example Code Snippet (Frontend Fetch):**
```tsx
const handlePay = async (productId: string) => {
  try {
    const res = await fetch("/api/check-out-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId: productId, userId: "123456790" }), // Pass your Price ID and any metadata
    });

    const data = await res.json();
    if (data?.url) {
      window.location.href = data.url; // Redirect to Stripe Checkout
    }
  } catch (e) {
    console.error("Payment Error", e);
  }
};
```

#### `/success` & `/cancel`
Displays the post-payment success or failure messages.

### ⚙️ Backend (API Routes)

The backend interacts securely with the Stripe API to create sessions and handle events.

#### `/api/check-out-session`
Exposes a `POST` endpoint that accepts a `priceId` (and optionally a `userId`). It creates a Stripe Checkout Session for subscription/payment and returns the session URL.

**Example Code Snippet (Backend Checkout Session):**
```ts
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(request: Request) {
  const { priceId, userId } = await request.json();
  const origin = new URL(request.url).origin;

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    metadata: { userId }, // Custom data stored with session
    success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/cancel`,
  });

  return Response.json({ url: session.url });
}
```

#### `/api/create-portal-session`
Allows users to manage their billing, update payment methods, or cancel subscriptions.

#### `/api/webhook`
Exposes a `POST` endpoint that securely listens to events from Stripe. It verifies the event signature using the `STRIPE_WEBHOOK_SECRET`.

**Example Code Snippet (Webhook Verification):**
```ts
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  let event: Stripe.Event;
  try {
    // Verify the webhook is from Stripe
    event = stripe.webhooks.constructEvent(body, signature!, webhookSecret);
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 400 });
  }

  // Handle specific events
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log("Subscription started for userId:", session.metadata?.userId);
    // TODO: Update your database here
  }

  return Response.json({ received: true });
}
```

---

## 🛠️ Stripe Dashboard Setup Guide

To get this project working, you must configure your Stripe account and obtain the necessary API keys.

### 1️⃣ How to find your API Keys
1. Go to the [Stripe Dashboard](https://dashboard.stripe.com/) and log in.
2. Ensure you are in **Test Mode** (toggle switch is usually in they top right corner).
3. In the left sidebar or top search bar, navigate to **Developers > API keys**.
4. You will see two keys:
   - **Publishable key** (`pk_test_...`) - used on the frontend if needed.
   - **Secret key** (`sk_test_...`) - This is your `STRIPE_SECRET_KEY`. Keep this secure!
5. Copy the Secret key and paste it into your `.env` file.

### 2️⃣ How to get your Webhook Secret for Local Development
To test webhooks locally, you need the Stripe CLI.

1. Install the [Stripe CLI](https://stripe.com/docs/stripe-cli).
2. Login to your Stripe account via CLI:
   ```bash
   stripe login
   ```
3. Start listening to local webhooks and forward them to your API route:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhook
   ```
4. Once the command runs, the terminal will output a **webhook signing secret** that looks like this:
   ```text
   > Ready! Your webhook signing secret is whsec_...
   ```
5. Copy that value (`whsec_...`) and paste it as `STRIPE_WEBHOOK_SECRET` in your `.env` file. Keep this terminal window open while you test payments!

### 3️⃣ Creating Products and Prices
Since the project references specific price IDs (e.g., `price_1T3Drp10ogoRi0PltLeBi6H0`), you will either need to use those exactly or create new products if starting fresh:
1. Go to **Product Catalog** > **Products** in the Stripe Dashboard.
2. Click **Add product**.
3. Enter the product details (Name: "Pro Plan", Price: $5).
4. Save the product, and copy the **API ID** for the pricing (starts with `price_...`).
5. Update the `priceId` fields in your frontend code (`app/(pages)/payment/page.tsx` & `app/(pages)/one-time-payment/page.tsx`) to reflect your new price IDs.

---

## 🔐 Environment Variables (.env)

Your project requires an `.env` file at the root. Here is how to configure it based on the steps above:

```env
# The base URL of your application (used for API calls)
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Your Stripe Secret Key (found in Developers -> API keys)
STRIPE_SECRET_KEY=sk_test_...

# The webhook signing secret generated from `stripe listen`
STRIPE_WEBHOOK_SECRET=whsec_...
```

Make sure not to commit your `.env` file to version control (ensure it is in `.gitignore`).

## 🚀 Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. In a separate terminal, start the Stripe CLI listener:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhook
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.
