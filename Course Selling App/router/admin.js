const {Router}=require('express')
const jwt=require('jsonwebtoken')
// const jwt_admin_secret="abhinav1234"
const {jwt_admin_secret} =require('../config')
const {adminMiddleware}=require("../middlewares/admin")
console.log(jwt_admin_secret)
const adminRouter=Router()
const {z}=require("zod")
const bcrypt=require('bcrypt')
const {AdminModel} =require('../db')
const {CourseModel} =require('../db')


adminRouter.post("/signup",async function(req,res){
    

    const adminSchema=z.object({
        email:z.string().min(3).max(100),
        password:z.string().min(3).max(100),
        firstName:z.string().min(3).max(100),
        lastName:z.string().min(3).max(100),

    })


    const validation=adminSchema.safeParse(req.body)

    if(!validation.success){
        res.json("invalid data types")
    }



    const email=req.body.email
    const password=req.body.password
    const firstName=req.body.firstName
    const lastName=req.body.lastName


    try{
        const hashedPassword=await bcrypt.hash(password,5)
       await AdminModel.create({
            email:email,
            password:hashedPassword,
            firstName:firstName,
            lastName:lastName
        })
    }
    catch(e){
        res.status(403).json({
            message:"something is fishy happening..."
        })
    }

    
    res.json({
        message:"you are sign in"
    })    
})


adminRouter.post("/signin",async function(req,res){
    
    
    const email=req.body.email
    const password=req.body.password
    const admin=await AdminModel.findOne({
        email:email
    })
    const hashedPassword=await bcrypt.compare(password,admin.password)
    if(admin && hashedPassword){
        
        const token=jwt.sign({
                        id:admin._id.toString()
                    },jwt_admin_secret)
        res.json({
            message:"you are signed up",
            token
        })
    }
    else{
        res.json({
            email,
            password,
            message:"Invalid email or password",
        })
    }
  
})




adminRouter.post("/course",adminMiddleware,async function(req,res){
   const adminId=req.adminId
   
   const {title,description,price,imageUrl}=req.body

   const course=await CourseModel.create({
    title:title,
    description:description,
    price:price,
    imageUrl:imageUrl,
    creatorId:adminId
   })
   res.json({
    message:"you created course",
    courseId:course._id
   })

})

adminRouter.put("/course",adminMiddleware,async function(req,res){
   const adminId=req.adminId
   const {title,description,price,imageUrl,courseId}=req.body

   const course=await CourseModel.updateOne({
    _id:courseId,
    creatorId:adminId
   },{
    title:title,
    description:description,
    price:price,
    imageUrl:imageUrl
   })

   res.json({
    message:"you updated courses",
    course
   })
})

adminRouter.get("/course/bulk",adminMiddleware,async function(req,res){
    const adminId=req.adminId
    
    const courses=await CourseModel.find({
        creatorId:adminId
    })

    res.json({
        courses
    })

})

// adminRouter.delete("/course",function(req,res){
//     res.json({
//         message:"you are sign in"
//     })
// })




module.exports={
    adminRouter:adminRouter
}