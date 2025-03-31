const jwt=require("jsonwebtoken")
const jwt_user_secret="abhinav12"

function userMiddleware(req,res,next){

    const token=req.headers.token

    const decoded=jwt.verify(token,jwt_user_secret)

    if(decoded){
        req.userId=decoded.id
        next()

    }else{
        res.status(403).json("Somthing is wrong")
    }
}

module.exports={
    userMiddleware
}