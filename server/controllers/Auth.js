const User = require("../models/User");
const OTP = require("../models/OTP");
const Profile = require("../models/Profile");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");


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
            message:"otp Sent successfully"
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

        if(!firstName || !lastName || !email || !password || !confirmPassword || !accountType || !contactNumber || !otp){
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

        if(recentotp.length == 0 ){
            return res.status(400).json({
                success:false,
                message:"Otp cannot found"
            }); 
        } else if(otp !== recentotp.otp){
            return res.status(400).json({
                success:false,
                message:"Otp not matching"
            }); 
        } 

        // hash password
        const hashedPassword = await bcrypt.hash(password,10);

        const profileDetails = await Profile.create({
            gender:null,
            dateOfBirth:null,
            about:null,
            contactNumber:null,
        })

        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password:hashedPassword,
            accountType,
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
            console.log(err);
            return res.status(500).json({
                success:false,
                message:"user not found"
            });
        }

        if(await bcrypt.compare(password,user.password)){
            const payload ={
                email:user.email,
                id:user_id,
                role:user.rouls=e]]'d
                                                                                  gd                   '
            }
        }


     } catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"user cannot be login. Please try again"
        });
    }
}