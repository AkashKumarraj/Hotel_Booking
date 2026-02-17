import User from "../models/userModel.js";
import { Webhook } from "svix";

const clerkWebhooks = async (req, res) => {
    try {

        //create the svix instance with clerk webhooks secret
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)

        //getting headers
        const headers = {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"],
        };

        //verifying Headers
        await whook.verify(req.body.toString('utf8'), headers)

        //geting Data from request body
        const { data, type } = JSON.parse(req.body.toString('utf8'))

        //switch cases for different Events
        switch (type) {
            case "user.created": {
                const userData = {
                    _id: data.id,
                    email: data.email_addresses[0].email_address,
                    username: data.first_name + " " + data.last_name,
                    image: data.image_url,
                }
                console.log("Creating user:", userData);
                await User.create(userData);
                break;
            }
            case "user.updated": {
                const userData = {
                    email: data.email_addresses[0].email_address,
                    username: data.first_name + " " + data.last_name,
                    image: data.image_url,
                }
                console.log("Updating user:", userData);
                await User.findByIdAndUpdate(data.id, userData);
                break;
            }
            case "user.deleted": {
                console.log("Deleting user:", data.id);
                await User.findByIdAndDelete(data.id);
                break;
            }
            default:
                console.log("Unhandled event type:", type);
                break;
        }
        res.json({ success: true, message: "Webhook Received" })

    } catch (error) {
        console.error("Webhook Error:", error.message);
        res.status(500).json({ success: false, message: error.message })
    }
}
export default clerkWebhooks