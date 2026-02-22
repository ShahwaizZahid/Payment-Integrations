"use client";

import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center px-6">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-10 max-w-md w-full text-center">
        {/* Icon */}
        <div className="text-5xl mb-4">✅</div>

        <h1 className="text-3xl font-semibold">Payment Successful</h1>

        <p className="text-neutral-400 mt-3">
          Thank you! Your purchase has been completed successfully.
        </p>

        <div className="mt-8 space-y-3">
          <Link
            href="/"
            className="block w-full bg-white text-black py-3 rounded-xl font-medium hover:bg-neutral-200 transition"
          >
            Go to Dashboard
          </Link>

          <Link
            href="/pricing"
            className="block text-neutral-400 hover:text-white transition"
          >
            Back to Pricing
          </Link>
        </div>
      </div>
    </div>
  );
}
