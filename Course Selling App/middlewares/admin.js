const jwt=require("jsonwebtoken")
const jwt_admin_secret="abhinav1234"

function adminMiddleware(req,res,next){

    const token=req.headers.token

    const decoded=jwt.verify(token,jwt_admin_secret)

    if(decoded){
        req.adminId=decoded.id
        next()

    }else{
        res.status(403).json("Somthing is wrong")
    }
}

module.exports={
    adminMiddleware
}