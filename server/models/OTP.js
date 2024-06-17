const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const emailTemplate = require("../mail/templates/emailVerificationTemplate");

const OTPSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    otp:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires: 5*60
    },
});

async function sendVerificationEmail(email,otp){
    try{
        const mailResponse = await mailSender(email,"Verification Email form Geeker's School",emailTemplate(otp));
        console.log("Email sent successfully",mailResponse.response);

    } catch(err){
        console.log("error occur while sendng mail",err);
        throw err;
    }
}

OTPSchema.pre("save",async function(next){
    console.log("New document saved to database");

    if(this.isNew){
        await sendVerificationEmail(this.email,this.otp);
    }
    next();
})

module.exports = mongoose.model("OTP",OTPSchema); 