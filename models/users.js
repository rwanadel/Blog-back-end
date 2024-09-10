const {model, Schema} =require("mongoose");
const userSchema=new Schema({
name:String,
email:String,
password:String,
role:{
    type:String,
    enum:["admin","user"]
}
},{
    timestamps:true
});

const User=model("User",userSchema);

module.exports=User;