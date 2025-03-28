import { NextResponse } from "next/server";
import { headers } from "next/headers";

import type Stripe from "stripe";
import { stripe } from "@/services/stripe";
import { getUserByCustomerId } from "@/prisma/db/users";
import { upsertSubscription } from "@/prisma/db/subscriptions";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        if (session.mode === "subscription") {
          // Handle subscription payment logic here..
        } else if (session.mode === "payment") {
          // Handle one-off payment logic here...
        }

        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        // Get the user from the databaes
        const user = await getUserByCustomerId(subscription.customer as string);

        if (!user) {
          throw new Error("Could not find any users with this customer ID");
        }

        // Get the status
        const status =
          subscription.status === "active"
            ? subscription.cancel_at_period_end
              ? "canceled"
              : "active"
            : "inactive";

        await upsertSubscription(subscription.id, user.id, status, {
          priceId: subscription.items.data[0].price.id,
          expiredAt: new Date(subscription.current_period_end * 1000),
        });

        break;
      }
    }
  } catch (error) {
    return new Response(
      "Webhook handler failed. View you Nextjs function logs",
      { status: 400 }
    );
  }

  return new NextResponse(null, { status: 200 });
}
