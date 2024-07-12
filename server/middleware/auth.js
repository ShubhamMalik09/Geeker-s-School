const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = async (req,res,next) =>{
    try{
        console.log(req.cookies);
        const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ","");
        if(!token){
            return res.status(401).json({
                success:false,
                message:"token is missing",
            })
        }

        // verify the token
        try{
            const decode = jwt.verify(token,process.env.JWT_SECRET)
            req.user = decode;
        } catch(error){
            return res.status(401).json({
                success:false,
                message:"token is invalid"
            })
        }
        next();
    } catch(err){
        return res.status(500).json({
            success:false,
            message:"Something went wrong while validating the token",
            error:err.message
        })
    }
}

exports.isStudent = async (req,res,next) =>{
    try{
        // extract token 

        if(req.user.role !='Student'){
            return res.status(401).json({
                success:false,
                message:"this is protected route for students only"
            });
        };
        next();

    } catch(err){
        return res.status(401).json({
            success:false,
            message:"User role cannot be verfied"
        });

    };
}

exports.isInstructor= async (req,res,next) =>{
    try{
        // extract token
        console.log(req.user);
        if(req.user.role !== "Instructor"){
            return res.status(401).json({
                success:false,
                message:"this is protected route for instructor only"
            });
        };
        next();

    } catch(err){
        return res.status(401).json({
            success:false,
            message:"User role cannot be verfied"
        });

    };
}

exports.isAdmin= async (req,res,next) =>{
    try{
        // extract token 
        console.log(req.user)
        if(req.user.accountType !=="Admin"){
            return res.status(401).json({
                success:false,
                message:"this is protected route for admin only"
            });
        };
        next();

    } catch(err){
        return res.status(401).json({
            success:false,
            message:"User role cannot be verfied"
        });

    };
}
