
const express=require('express')
const jwt=require("jsonwebtoken")
// const jwt_user_secret="abhinav12"
const {jwt_user_secret} =require('../config')
const {userMiddleware}=require("../middlewares/user")

const {z}=require("zod")
const bcrypt=require('bcrypt')

const userRouter=express.Router()


const {UserModel, PurchaseModel, CourseModel} =require("../db")

    userRouter.post("/signup",async function(req,res){
        console.log("you are in signup")
        const userSchema=z.object({
                email:z.string().min(3).max(100),
                password:z.string().min(3).max(100),
                firstName:z.string().min(3).max(100),
                lastName:z.string().min(3).max(100),
        
            })
        
        const validation=userSchema.safeParse(req.body)

        if(!validation.success){
            res.json("invalid data types")
        }

        const {email,password,firstName,lastName}=req.body
      
        const hashedPassword=await bcrypt.hash(password,5)

        await UserModel.create({
                email:email,
                password:hashedPassword,
                firstName:firstName,
                lastName:lastName
        })
        
        
        res.json({
            message:"you are sign in"
        })    
    })

    userRouter.post("/signin",async function(req,res){
        
        const {email,password}=req.body

        const user=await UserModel.findOne({
            email:email
        })
        console.log(user.password)
        const hashedPassword=await bcrypt.compare(password,user.password)

        if(user && hashedPassword){
            const token=jwt.sign({
                id:user._id.toString()
            },jwt_user_secret)
            res.json({
                token
            })
        }else{
            res.json("Invalid credential")
        }
        
        
        
        
        
        
       
    })
    
    
    userRouter.get("/purchases",userMiddleware,async function(req,res){
       const userId=req.userId

        const purchases=await PurchaseModel.find({
            userId
        })

    // to get course data
        const courseData=await CourseModel.find({
            _id: {$in :purchases.map(x=>x.courseId)}
        })


        
        res.json({
            purchases,
            courseData
        })
    })


module.exports={
    userRouter:userRouter
}
