import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

export async function POST(request: NextRequest) {
  try {
    const { productId, quantity = 1, locale = "en" } = await request.json();

    const supabase = await createClient();

    // Verify user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch product
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("*, seller_profiles(*)")
      .eq("id", productId)
      .eq("status", "active")
      .single();

    if (productError || !product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (product.stock_count < quantity) {
      return NextResponse.json({ error: "Insufficient stock" }, { status: 400 });
    }

    const totalAmount = Math.round(product.price * quantity * 100); // cents
    const commissionRate = product.seller_profiles?.commission_rate ?? 0.1;
    const commission = Math.round(totalAmount * commissionRate);

    // Create Stripe session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: product.currency.toLowerCase(),
            product_data: {
              name: product.title,
              description: `Delivered instantly · ${product.type}`,
            },
            unit_amount: Math.round(product.price * 100),
          },
          quantity,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/${locale}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/${locale}/product/${productId}`,
      metadata: {
        productId,
        buyerId: user.id,
        sellerId: product.seller_id,
        quantity: String(quantity),
        commission: String(commission),
      },
    });

    // Create pending order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        buyer_id: user.id,
        seller_id: product.seller_id,
        product_id: productId,
        quantity,
        unit_price: product.price,
        total_price: product.price * quantity,
        commission: (product.price * quantity) * commissionRate,
        seller_payout: (product.price * quantity) * (1 - commissionRate),
        status: "pending",
        stripe_payment_intent_id: session.id,
      })
      .select()
      .single();

    if (orderError) {
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }

    return NextResponse.json({ url: session.url, sessionId: session.id, orderId: order.id });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
