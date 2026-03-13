import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = await createAdminClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.CheckoutSession;
      const { productId, buyerId, sellerId, quantity, commission } = session.metadata!;

      // Find the order
      const { data: order } = await supabase
        .from("orders")
        .select("id")
        .eq("stripe_payment_intent_id", session.id)
        .single();

      if (!order) break;

      // Deliver keys atomically
      const { data: deliveredKeys, error: deliveryError } = await supabase.rpc(
        "deliver_keys",
        { p_order_id: order.id, p_quantity: parseInt(quantity) }
      );

      if (deliveryError) {
        console.error("Key delivery failed:", deliveryError);
        // Update order as paid but flag delivery issue
        await supabase
          .from("orders")
          .update({ status: "paid" })
          .eq("id", order.id);
        break;
      }

      // Credit seller balance (minus commission)
      const sellerAmount = session.amount_total! - parseInt(commission);
      await supabase.rpc("increment_balance", {
        p_user_id: sellerId,
        p_amount: sellerAmount / 100,
      });

      console.log(`Order ${order.id} fulfilled: ${deliveredKeys?.length} keys delivered`);
      break;
    }

    case "checkout.session.expired": {
      const session = event.data.object as Stripe.CheckoutSession;
      await supabase
        .from("orders")
        .update({ status: "refunded" })
        .eq("stripe_payment_intent_id", session.id);
      break;
    }

    case "charge.dispute.created": {
      const dispute = event.data.object as Stripe.Dispute;
      // Flag the order as disputed for admin review
      await supabase
        .from("orders")
        .update({ status: "disputed" })
        .eq("stripe_payment_intent_id", dispute.payment_intent as string);
      break;
    }
  }

  return NextResponse.json({ received: true });
}
