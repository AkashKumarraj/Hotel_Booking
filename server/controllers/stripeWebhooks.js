import stripe from "stripe";
import Booking from "../models/Booking.js";

// API to handle Stripe Webhooks

export const stripeWebhooks = async (request, response) => {
    //Stripe Gateway Initialize
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
    const sig = request.headers['stripe-signature'];
    let event;

    try {
        event = stripeInstance.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
    } catch (err) {
        console.log('Webhook signature verification failed:', err.message);
        return response.status(400).send(`Webhook Error: ${err.message}`)
    }

    console.log('Webhook event received:', event.type);

    //Handle the event
    if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        const { bookingId } = session.metadata;

        console.log('Processing payment for bookingId:', bookingId);

        //Mark Payment as Paid
        await Booking.findByIdAndUpdate(bookingId, { isPaid: true, paymentMethod: "Stripe" })

        console.log('Payment status updated successfully for booking:', bookingId);

    } else {
        console.log("Unhandled event type:", event.type)
    }
    response.json({ received: true });
}