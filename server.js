const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const mongoose = require("mongoose");
require("dotenv").config();
const uri = process.env.uri;
const userSchema = require("./models/user");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
mongoose.connect(
  uri,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) throw err;
    console.log("connected successfully");
  }
);


//get all users
app.get("/users/getAll", async (req, res) => {
  try {
    await userSchema.find({}).then((data) => {
      res.send(data);
    });
  } catch (err) {
    console.log(err);
  }
});
//ADD A NEW USER TO THE DATABASE
app.post("/users/add_user", async (req, res) => {
    try{
const user = new userSchema({
    firstName:req.body.firstName,
    lastName:req.body.lastName,
    phone:req.body.phone,
    email:req.body.email
    
});
const newUser = await user.save();

//SEND FINAL RESPONSE
res.status(200).json({
    status: true,
    message: "User created successfully",
    data: newUser,
});
} 
catch (error) {
if (error) throw error;
res.send(400).json({ status: false, error });
}
});

// UPDATE A USER BY ID 
app.put("/users/update_user/:id",async(req,res)=>{
try{
await userSchema.findOneAndUpdate({_id:req.params.id},{ ...req.body },{ new: true })
  
   res.send("user updated successfully")
}
catch(err){
    console.log(err)
}
})
//REMOVE A USER BY ID 
app.delete('/users/delete_user/:id',async(req,res)=>{
    try{
       await userSchema.findByIdAndDelete(req.params.id)
       res.send("user successfully deleted")
    }
    catch(err){
        console.log(err)
    }
})



app.listen(port, (err) => {
  if (err) throw err;
  console.log(`app is running on the port ${port}`);
});
