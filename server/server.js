import express from "express"
import "dotenv/config";  // using this we can use env variables in our project 
import cors from "cors";
import connectDB from "./configs/db.js";
import { clerkMiddleware } from '@clerk/express'
import clerkWebhooks from "./controllers/clerkWebhooks.js";
import userRouter from "./routes/userRoutes.js";
import hotelRouter from "./routes/hotelRoutes.js";
import connectCloudinary from "./configs/cloudinary.js";
import roomRouter from "./routes/roomRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";

connectDB();
connectCloudinary();


const app = express()

//Middleware
app.use(express.json())  //all the request passed with json method
app.use(clerkMiddleware())

app.use(
    cors({
        origin: "http://localhost:5173"
    })
);


//Api to Listen to clerk webhooks
app.use("/api/clerk", clerkWebhooks);

app.get('/', (req, res) => res.send("API is working"))
app.use('/api/user', userRouter)
app.use('/api/hotels', hotelRouter)
app.use('/api/rooms', roomRouter)
app.use('/api/bookings', bookingRouter)

app.use((err, req, res, next) => {
    console.error(err.stack);

    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});

const PORT = process.env.PORT || 3000;


app.listen(PORT, () => console.log(`Server running port ${PORT}`));