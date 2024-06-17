const User = require("../models/User");
const OTP = require("../models/OTP");
const Profile = require("../models/Profile");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailSender = require("../utils/mailSender");
const {passwordUpdated} = require("../mail/templates/passwordUpdate");
require("dotenv").config();


// send OTP
exports.sendOTP = async (req,res) =>{
    try{
        const {email} = req.body;

        const checkUserPresent = await User.findOne({email});

        if(checkUserPresent){
            return res.status(401).json({
                success:false,
                message:"User already registered",
            })
        }

        //generate otp
        var otp = otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false
        });

        // check unique otp
        const result = await OTP.findOne({otp:otp});
        while(result){
            otp = otpGenerator.generate(6,{
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false
            });
            result = await OTP.findOne({otp:otp});
        }

        console.log("otp generated: ",otp); 

        const otpPayload = {email,otp};

        // create entry for OTP
        const otpBody = await OTP.create(otpPayload);
        console.log(otpBody);

        res.status(200).json({
            success:true,
            message:"otp Sent successfully",
            otp,
        })

    } catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:err.message
        })
    }
};


exports.signUp = async (req,res) =>{
    try{
        const {firstName, lastName, email,password,confirmPassword,accountType,contactNumber,otp} = req.body;

        if(!firstName || !lastName || !email || !password || !confirmPassword || !accountType || !otp){
            return res.status(403).json({
                success:false,
                message:"All field are required"
            });
        };

        if(password !== confirmPassword){
            return res.status(400).json({
                success:false,
                message:"Password does not match with confirm password"
            });
        };

        
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"UserName already registered"
            });
        }

        // find most recent otp stored for the user 
        const recentotp = await OTP.find({email}).sort({createdAt:-1}).limit(1);
        console.log(recentotp);
        if(recentotp.length === 0 ){
            return res.status(400).json({
                success:false,
                message:"Otp is not valid"
            }); 
        } else if(otp !== recentotp[0].otp){
            return res.status(400).json({
                success:false,
                message:"Otp not matching"
            }); 
        } 

        // hash password
        const hashedPassword = await bcrypt.hash(password,10);

        let approved="";
        approved === "Instructor" ? (approved=false) : (approved=true);

        const profileDetails = await Profile.create({
            gender: null,
			dateOfBirth: null,
			about: null,
			contactNumber: null,
        })

        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password:hashedPassword,
            accountType: accountType,
			approved: approved,
            additionalDetails:profileDetails._id,
            image:`http://api.dicebear.com/5.x/bottts/svg?seed=${firstName}`,
        })

        return res.status(200).json({
            success:true,
            message:"user registered successfully",
            user,
        });

    } catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"user cannot be registerd. Please try again"
        });
    }
};


exports.login = async (req,res) =>{
     try{
        const {email,password} = req.body;
        
        if(!email || !password){
            return res.status(500).json({
                success:false,
                message:"All fields are required. Please try again"
            });
        }

        const user= await User.findOne({email}).populate("additionalDetails");
        if(!user){
            return res.status(401).json({
                success:false,
                message:"user not found"
            });
        }

        if(await bcrypt.compare(password,user.password)){
            const payload ={
                email:user.email,
                id:user._id,
                accountType:user.accountType,
            }

            const token = jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn:"2h"
            });
            user.token = token;
            user.password = undefined;

            const options ={
                expires : new Date(Date.now() + 3*24*60*60*1000),
                httpOnly:true,
            }
            res.cookie("token",token,options).status(200).json({
                success:true,
                token,
                user,
                message:"logged in successfully"
            });

        }
        else{
            return res.status(401).json({
                success:false,
                message:"Password is incorrect"
            });
        }


     } catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Login Failure, Please try again"
        });
    }
}



exports.changePassword = async (req,res) =>{
    try{
        const userDetails = await User.findById(req.user.id);

        const {oldPassword, newPassword, confirmNewPassword} = req.body;

        const isPasswordMatch = await bcrypt.compare(oldPassword,userDetails.password);
        if(!isPasswordMatch){
            return res.status(400).json({
                success:false,
                message:"password is incorrect",
            });
        }

        if (newPassword !== confirmNewPassword) {
			// If new password and confirm new password do not match, return a 400 (Bad Request) error
			return res.status(400).json({
				success: false,
				message: "The password and confirm password does not match",
			});
		}
        const encryptedPassword = await bcrypt.hash(newPassword,10);
        const updateUserDetails = await User.findByIdAndUpdate(req.user.id,
                                            {password:encryptedPassword},
                                            {new:true}
        );

        try{
            const emailResponse = await mailSender(
                updatedUserDetails.email,
                passwordUpdated(
                    updateUserDetails.email,
                    `Password updated successfully for ${updateUserDetails.fistName} ${updateUserDetails.lastName}`
                )
            );
            console.log("email sent successfully:",emailResponse.response);
        } catch(err){
            console.error("error occured while sending email: ",error);
            return res.status(500).json({
                success:false,
                message:"Error occured while sending email",
                error:err.message,
            })
        }

        return res
			.status(200)
			.json({ success: true, message: "Password updated successfully" });

    } catch(err){
        console.error("Error occurred while updating password:",error);
        return res.status(500).json({
            success:false,
            message:"Error occurred while updating password",
            error:err.message,
        });
    }
}