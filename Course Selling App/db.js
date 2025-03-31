const mongoose=require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;






const UserSchema=new Schema({
    email:{type:String , unique:true},
    password:String,
    firstName:String,
    lastName:String
})

const CourseSchema=new Schema({
  title:String,
  description:String,
  price:Number,
  imageUrl:String,
  creatorId:ObjectId
})

const AdminSchema=new Schema({
    email:{type :String , unique:true},
    password:String,
    firstName:String,
    lastName:String
})

const PurchaseSchema=new Schema({
  userId:ObjectId,
  courseId:ObjectId  
})


const UserModel=mongoose.model("user",UserSchema)
const CourseModel=mongoose.model("course",CourseSchema)
const AdminModel=mongoose.model("admin",AdminSchema)
const PurchaseModel=mongoose.model("purchase",PurchaseSchema)

module.exports={
   UserModel,CourseModel,AdminModel,PurchaseModel
}