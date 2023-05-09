const mongoose =require("mongoose");
var mongoURL='mongodb+srv://haritha:haritha23@cluster0.qcpuoag.mongodb.net/mern-pizza'
mongoose.connect(mongoURL,{useUnifiedTopology:true, useNewUrlParser:true})
var db=mongoose.connection
db.on('connected',()=>{
    console.log('MONGO DB connection successfull');
})
db.on('error',()=>{
    console.log('MONGO DB connection failed');
})
module.exports=mongoose
