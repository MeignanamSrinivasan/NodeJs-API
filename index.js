const express = require('express')

const app = express();
const userRoute = require('./routes/user');
const authRoute = require('./routes/auth');
const productRoute =require('./routes/product');
const cartRoute = require('./routes/cart');
const orderRoute = require('./routes/order');

const mongoose = require('mongoose');
require('dotenv').config();

app.use(express.json());
app.use("/api/user",userRoute);
app.use("/api/auth",authRoute);
app.use('/api/product',productRoute);
app.use('/api/cart',cartRoute);
app.use('/api/order',orderRoute);

mongoose.connect(process.env.MONGo_URI)
.then(()=>console.log("Mongo DB connected"))
.catch((err)=>console.log(err))

app.listen(process.env.PORT ||3000,()=>{
    console.log('Server is Running');
});