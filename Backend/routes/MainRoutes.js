const express=require("express");
const MainRouter=express.Router();
const userRouter=require("./userRoutes")
MainRouter.use(userRouter);
MainRouter.get("/",(req,res)=>{
    res.send("Welcome")
})



module.exports=MainRouter