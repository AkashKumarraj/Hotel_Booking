import express from "express"
import "dotenv/config";  // using this we can use env variables in our project 
import cors from "cors";
import connectDB from "./configs/db.js"; 
import {clerkMiddleware} from '@clerk/express'
import clerkWebhooks from "./controllers/clerkWebhooks.js";

connectDB();
const app= express()
app.use(cors()) //  enable Cross-Origin Resource Sharing(with this able to connect front end with backend )

//Middleware
app.use(express.json())  //all the request passed with json method
app.use(clerkMiddleware())

//Api to Listen to clerk webhooks
app.use("/api/clerk", clerkWebhooks)

app.get('/', (req, res)=> res.send("API is working"))

const PORT=process.env.PORT ||3000;



app.listen(PORT, ()=> console.log(`Server running port ${PORT}`));