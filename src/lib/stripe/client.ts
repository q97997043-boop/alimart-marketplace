import { loadStripe, type Stripe } from "@stripe/stripe-js";

let stripePromise: Promise<Stripe | null>;

export function getStripe(): Promise<Stripe | null> {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return stripePromise;
}

// Helper to create a Stripe checkout session and redirect
export async function redirectToCheckout(productId: string, quantity: number, locale: string) {
  const res = await fetch("/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId, quantity, locale }),
  });

  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error || "Failed to create checkout session");
  }

  const { url } = await res.json();
  if (url) window.location.href = url;
}
