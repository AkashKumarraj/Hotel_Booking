import mongoose from "mongoose";

const bookingScheme=new mongoose.Schema({
    usr: {type:String, ref:"User", required:true},
    Room: {type:String, ref:"Room", required:true},
    Hotel: {type:String, ref:"Hotel", required:true},
    checkInDate: {type:Date, required:true},
    checkOutDate: {type:Date, required:true},
    totalPrice:{type:Number, required:true},
    guests:{type:Number, required:true},
    status:{
        type:String,
        enum:["pending", "confirmed", "cancelled"],
        default:"pending",
    },
    paymentMethod:{
        type:String,
        required:true,
        default:"Pay At Hotel",
    },
    isPaid:{ type: Boolean, default:false}
    
}, {timestamps: true});



const Booking=mongoose.model("Booking", bookingScheme);

export default Booking;