const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

exports.resetPasswordToken = async (req,res) =>{
    try{
        const {email} = req.body;

        const user = await User.findOne({email});
    
        if(!user){
            return res.json({
                success:false,
                message:"your email is not registered with ys"
            })
        }
    
        const token = crypto.randomUUID();
        console.log(token)
    
        const updatedDetails = await User.findByIdAndUpdate({_id:user._id},{
            token:token,
            resetPasswordExpires:Date.now() + 5*60*1000.
        },{new:true});
    
        const url = `http://localhost:3000/update-password/${token}`;
    
        await mailSender(email,"password reset link",`password reset link : ${url}`);

        return res.json({
            success:true,
            message:"email sent successfully"
        })
    } catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Something went wrong while reseting passsword"
        })
    }
}

exports.resetPassword= async (req,res) =>{
    try{
        const {password, confirmPassword, token} =req.body;
        if(password !== confirmPassword){
            return res.json({
                success:false,
                message:"Password not match"
            });
        };

        const userDetails = await User.findOne({ token:token });
        if(!userDetails){
            return res.json({
                success:false,
                message:"token invalid"
            });
        }

        if(userDetails.resetPasswordExpires > Date.now()){
            return res.json({
                success:false,
                message:"token is expired, please regenerate your token",
            })
        }

        const hashedPassword = await bcrypt.hash(password,10);

        await User.findOneAndUpdate(
            {token:token},
            {password:hashedPassword},
            {new:true}
        )
 
        return res.json({
            success:true,
            message:"password reset successfully"
        })
    } catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Something went wrong while reseting passsword"
        })
    }
}
    