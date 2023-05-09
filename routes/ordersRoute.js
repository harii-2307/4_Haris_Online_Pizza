const express =require("express");
const router=express.Router();
const { v4: uuidv4 } = require('uuid');
const stripe=require("stripe")("sk_test_51N5mnBSAd2cJp58wt36YdZlkQM0sMTZFdQtHGEQJzBJ8H4ZsJG9wwMvjQLLELnpWqyL9MTvCSh8c9veSVauXB96500reMl8gmK")
const order=require('../models/orderModel')
router.post("/placeorder", async (req,res)=>{

    const {token,subtotal,currentUser,cartItems}=req.body
try{
 const customer=await stripe.customers.create({
     email:token.email,
     source:token.id
 })
 const payment =await stripe.chargs.create({
     amount:subtotal*100,
     currency:'INR',
     customer:customer.id,
     receipt_email:token.receit_email
 } ,{
     idempotencyKey:uuidv4()

 })
 if(payment){
        
    const neworder=new order({
        name:currentUser.name,
        email:currentUser.email,
        userid:currentUser._id,
        orderItems:cartItems,
        orderAmount:subtotal,
        shippingAddress:{
            street:token.card.address_line1,
            city:token.card.address_city,
            country:token.card.address_country,
            pincode:token.card.address_zip
        },
        transactionId:payment.source.id
    })
    
    neworder.save()
    res.send('order placed successfully')
 } else{
     res.send('payment failed')
 }

} catch(error) {
    return res.status(400).json({message:'something went wrong',error});

}


});

router.post("/getuserorders",async (req,res)=>{
    const {userid}=req.body
try{

    const orders=await order.find({userid:userid})
    res.send(orders)

}catch(error){
    return res.status(400).json({message:'something went wrong'});

}

});
module.exports=router