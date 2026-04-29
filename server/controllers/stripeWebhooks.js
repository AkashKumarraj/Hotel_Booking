import Stripe from "stripe";
import Booking from "../models/Booking.js";

// API to handle Stripe Webhooks

export const stripeWebhooks = async (request, response) => {
    //Stripe Gateway Initialize
    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
    const sig = request.headers['stripe-signature'];
    let event;

    try {
        event = stripeInstance.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
    } catch (err) {

        return response.status(400).send(`Webhook Error: ${err.message}`)
    }

    //Handle the event
    if (event.type === "payment_intent.succeeded") {
        const paymentIntent = event.data.object;
        const paymentIntentId = paymentIntent.id;

        console.log("Payment succeeded:", paymentIntentId);

        //getting session metadata
        const session = await stripeInstance.checkout.sessions.list({
            payment_intent: paymentIntentId,
        })

        console.log("Session data:", session.data);

        if (session.data && session.data.length > 0) {
            const { bookingId } = session.data[0].metadata;
            console.log("Updating booking:", bookingId);

            //Mark Payment as Paid
            await Booking.findByIdAndUpdate(bookingId, { isPaid: true, paymentMethod: "Stripe" })
            console.log("Booking updated successfully");
        } else {
            console.log("No session found for payment intent:", paymentIntentId);
        }

    } else {
        console.log("Unhandled event type:", event.type)
    }
    response.json({ received: true });
}