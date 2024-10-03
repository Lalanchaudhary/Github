const express=require("express");
const userRouter=express.Router();
const userControler=require("../controller/userController");

userRouter.get("/getProfile/:id",userControler.getUserProfile);
userRouter.post("/signup",userControler.signup);
userRouter.post("/login",userControler.login);
userRouter.put("UpdateProfile/:id",userControler.UpdateUserProfile);
userRouter.get("/getAlluser",userControler.getAllUser);
userRouter.delete("/deleteUser/:id",userControler.DeleteUser)

module.exports=userRouter;