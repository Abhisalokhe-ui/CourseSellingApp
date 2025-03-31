require('dotenv').config();
const express=require('express')
// const {UserModel,CourseModel,AdminModel,PurchaseModel} =require('./db')
const app=express()
const mongoose=require('mongoose')
const conn=process.env.connectionUrl
console.log(conn)

const {userRouter} =require('./router/userRouter')
const {courseRouter} =require('./router/courseRouter')
const { adminRouter } = require('./router/admin')

app.use(express.json())
app.use("/api/v1/user",userRouter)
app.use("/api/v1/admin",adminRouter)
app.use("/api/v1/course",courseRouter)


async function main(){
    console.log("inside main")
    await mongoose.connect(conn)
    app.listen(3000)
    console.log("listeneing on port 3000")
    console.log("You can now use endpoints")
}

main()

