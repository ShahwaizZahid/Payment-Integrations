import Image from "next/image";
import Link from "next/link";
import PortalButton from "@/components/PortalButton";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
      <div className="flex space-x-4">
        <Link
          href="/one-time-payment"
          className="bg-amber-300 px-6 py-3 rounded-xl font-medium"
        >
          One time payment
        </Link>
        <Link
          href="/success"
          className="bg-neutral-200 px-6 py-3 rounded-xl font-medium"
        >
          Success
        </Link>
        <Link
          href="/cancel"
          className="bg-neutral-200 px-6 py-3 rounded-xl font-medium"
        >
          Cancel
        </Link>
      </div>

      <div className="pt-8 border-t border-neutral-200 w-full max-w-md flex flex-col items-center ">
        <p className="text-sm text-neutral-500 mb-4">
          Manage your subscription (requires valid Customer ID)
        </p>
        {/* In a real app, you would pass the current user's Stripe Customer ID */}
        <PortalButton customerId="cus_U1H41CISMV0FJM" />
      </div>
    </div>
  );
}
