const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const userschema = new mongoose.Schema({
 name : {
  type:String,
  required : true
 },
 email : {
  type : String,
  required: true
 },
 password : {
  type : String,
  required: true
 },
 college : {
  type : String,
  required: true
 },
 collegeid : {
  type : String,
  required: true
 },
 isteacher:{
  type : Boolean,
 },
 dob : {
  type : Date,
  required: true
 },
 gender : {
  type : String,
  required: true
 },
 notification:[{
   type:ObjectId,
   ref:"Notification"
 }]
})

mongoose.model("User", userschema);
