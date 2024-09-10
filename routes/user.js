const express=require("express");
const router=express.Router();
const {getAllUsers,signup,login,upDateuser,deleteuser}= require('../controller/users');
const auth = require('./../middlewares/auth.js');
const restrictTo = require("../middlewares/authorization.js");


router.get("/",auth,restrictTo("admin"),getAllUsers);
router.post("/signup",signup);
router.post("/login",login);
router.delete("/:email",deleteuser);

module.exports=router;