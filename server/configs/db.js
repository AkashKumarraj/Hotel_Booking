import mongoose from "mongoose";

let isConnected = false; // Track connection status

const connectDB = async () => {
    mongoose.set('strictQuery', true);

    if (isConnected) {
        console.log('MongoDB is already connected');
        return;
    }

    try {
        const db = await mongoose.connect(`${process.env.MONGODB_URI}/hotel-booking`, {
            dbName: "hotel-booking",
        })

        isConnected = true;

        console.log("MongoDB Connected");
    } catch (error) {
        console.log(error);
    }
}

export default connectDB;