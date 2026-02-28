"use client";

export type ProductType = {
  id: string;
  productId: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  priceId: string; // Stripe price ID later
  features: string[];
};

export const products: ProductType[] = [
  {
    id: "price_1T3Drp10ogoRi0PltLeBi6H0",
    productId: "prod_U1GO3oOHsoKwVN",
    name: "Pro Plan",
    description: "Access premium features with one-time payment.",
    price: 5,
    currency: "USD",
    priceId: "price_pro_001",
    features: ["Unlimited access", "Priority support", "Advanced analytics"],
  },
  {
    id: "price_1T3DsS10ogoRi0PluoNCdEXE",
    productId: "prod_U1GPN25PBXvYgc",
    name: "Developer Pack",
    description: "Templates and starter resources.",
    price: 10,
    currency: "USD",
    priceId: "price_dev_002",
    features: ["UI components", "Code templates", "Lifetime updates"],
  },
  {
    id: "price_1T3Dt510ogoRi0PldP1gRM5b",
    productId: "prod_U1GP8CcKk80BWe",
    name: "Ultimate Bundle",
    description: "Everything included for professionals.",
    price: 30,
    currency: "USD",
    priceId: "price_ultimate_003",
    features: ["All features unlocked", "Premium assets", "VIP support"],
  },
];

export default function PricingPage() {
  const handlePay = async (productId: string) => {
    console.log(process.env.NEXT_PUBLIC_API_URL);
    console.log("Selected product:", productId);

    try {
      const res = await fetch("/api/check-out-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId: productId, userId: "123456790" }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Server responded ${res.status}: ${text}`);
      }

      const data = await res.json();

      console.log(data);
      // Expect server to return { url: "https://checkout.stripe.com/..." }
      if (data?.url) {
        window.location.href = data.url;
      } else {
        console.error("No checkout URL returned:", data);
        alert("Unable to start checkout. See console for details.");
      }
    } catch (e) {
      console.log("Payment Error ", e);
      alert("Payment failed. See console for details.");
    } finally {
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white px-6 py-14">
      {/* Header */}
      <div className="max-w-5xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-semibold">One-Time Purchase</h1>
        <p className="text-neutral-400 mt-3">
          Choose a product and unlock premium access instantly.
        </p>
      </div>

      {/* Products */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex flex-col justify-between hover:border-neutral-600 transition"
          >
            <div>
              <h2 className="text-xl font-semibold">{product.name}</h2>

              <p className="text-neutral-400 mt-3 text-sm">
                {product.description}
              </p>

              {/* Price */}
              <div className="mt-6 text-3xl font-bold">${product.price}</div>

              {/* Features */}
              <ul className="mt-6 space-y-2">
                {product.features.map((feature, index) => (
                  <li
                    key={index}
                    className="text-sm text-neutral-300 flex items-center gap-2"
                  >
                    ✅ {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Pay Button */}
            <button
              onClick={() => handlePay(product.id)}
              className="mt-8 w-full bg-white text-black font-medium py-3 rounded-xl hover:bg-neutral-200 transition"
            >
              Pay Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
