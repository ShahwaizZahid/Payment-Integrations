"use client";

import { useState } from "react";

interface PortalButtonProps {
    customerId: string;
}

export default function PortalButton({ customerId }: PortalButtonProps) {
    const [loading, setLoading] = useState(false);

    const handlePortalSession = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/create-portal-session", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ customerId }),
            });

            const data = await response.json();

            if (data.url) {
                window.location.href = data.url;
            } else {
                console.error("Portal session error:", data.error);
                alert("Failed to create portal session. Please try again.");
            }
        } catch (error) {
            console.error("Portal session fetch error:", error);
            alert("An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handlePortalSession}
            disabled={loading}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition disabled:opacity-50"
        >
            {loading ? "Redirecting..." : "Manage Billing"}
        </button>
    );
}
