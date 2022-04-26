const express = require('express');
const { veryfiedToken, verifyTokenAdmin, verifyToekenAuthorization } = require('./verifyToken');
const router = express.Router();
const order = require('../models/oder');
const oder = require('../models/oder');

// CREATE ORDER

router.post('/',veryfiedToken,async(req,res)=>{
    const newOrder = new oder(req.body);
    try{
        const savedOrder=await newOrder.save();
        res.status(200).json(savedOrder)
    }catch(err){
        res.status(500).json(err)
    }
});

// update Order

router.put('/:id',verifyTokenAdmin,async(req,res)=>{
    try{
        const updatedOrder = await oder.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true});
        res.status(200).json(updatedOrder);
    }catch(err){
        res.status(500).json(err)
    }
});

//Delete Order

router.delete('/:id',verifyTokenAdmin,async(req,res)=>{
    try{
        await oder.findByIdAndDelete(req.params.id);
        res.status(200).json("Order has been Deleted!")
    }catch(err){
        res.status(500).json(err)
    }
});

// Get User Order
router.get('/find/:userId',verifyToekenAuthorization,async(req,res)=>{
    try{
        const orders =await oder.findOne({userId:req.params.userId});
        res.status(200).json(orders)
    }catch(err){
        res.status(500).json(err)
    }
});

// Get All User Order

router.get('/',verifyTokenAdmin,async(req,res)=>{
    try{
        const orders = await oder.find();
        res.status(200).json(orders)
    }catch(err){
        res.status(500).json(err)
    }
});

// Get Monthly Income

router.get('/income',async(req,res)=>{
    const date =new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth()-1));
    const previousMonth = new Date(date.setMonth(lastMonth.getMonth()-1));

    try{
        const income = await oder.aggregate([
            {$match:{createdAt:{$gte:previousMonth}}},
            {
                $project:{$month:'$createdAt'},
                sales:"$amount"
            },
            {
                $group:{
                    _id:"$month",
                    total:{$sum:"$sales"},
                },
            }           
                
        ]);
        res.status(200).json(income);
    }catch(err){
        res.status(500).json(err)
    }
});

module.exports =router;