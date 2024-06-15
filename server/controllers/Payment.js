const {instance} = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const mongoose = require("mongoose");
const crypto = require("crypto");

exports.capturePayment = async (req,res) => {
    const {course_id} = req.body;
    const userId = req.user.id;

    if(!course_id){
        return res.json({
            success:false,
            message:"Please provide valid course Id"
        });
    };

    let course;
    try{
        course = await Course.findById(course_id);
        if(!course){
            return res.status(400).json({
                sucess:false,
                message:"Course not found",
            })
        }

        const uid = new mongoose.Types.ObjectId(userId);
        if(course.studentsEnrolled.includes(uid)){
            return res.status(400).json({
                success:false,
                message:"Student is already enrolled",
            })
        }


    } catch(err){
        console.error(err);
        return res.status(500).json({
            success:false,
            message:err.message
        })
    }

    const amount = course.price;
    const currency = "INR";

    const options = {
        amount:amount*100,
        currency,
        receipt:Math.random(Date.now().toString()),
        notes:{
            courseId : course_id,
            userId,
        }
    };

    try{

        const paymentResponse = instance.orders.create(options);
        console.log(paymentResponse);

        return res.status(200).json({
            success:true,
            courseName:course.courseName,
            courseDescription:course.courseDescription,
            thumbnail:course.thumbnail,
            orderId:paymentResponse.id,
            currency:paymentResponse.currency,
            amount:paymentResponse.amount,
        })

    } catch(err){
        console.log(err);
        res.json({
            success:false,
            message:"Could not initiate order",
        })
    }
};  

exports.verifySignature = async (req,res) =>{
    const webHookSecret = "12345678";
    const signature = req.headers["x-razorpay-signature"];

    const shasum = crypto.createHmac("sha256",webHookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    if(signature === digest){
        console.log("payment is authorized"); 

        const {userId, courseId} = req.body.payload.payment.entity.notes;

        try{
            const enrolledCourse = await Course.findOneAndUpdate(
                                                {_id:courseId},
                                                {$push:
                                                    {
                                                        studentsEnrolled:userId,
                                                    }
                                                },
                                                {new:true});
            if(!enrolledCourse){
                return res.status(500).json({
                    success:false,
                    message:"Course not found",
                }); 
            }
            console.log(enrolledCourse);

            const enrolledStudent = await User.findOneAndUpdate(
                                            {_id:userId},
                                            {$push:{courses:courseId}},
                                            {}
            );
            console.log(enrolledStudent);

            const emailResponse = await mailSender(
                            enrolledStudent.email,
                            "Congratulation , you successfully enrolled in the course",
                            "Congratulation , you successfully enrolled in the course",

            )
            console.log(emailResponse);
            return res.status(200).json({
                success:true,
                message:"Signature verified and course added",
            });
        } catch(err){
            console.log(err);
            return res.status(500).json({
                success:false,
                message:err.message,
            })
        }
    }

    else{
        return res.status(400).json({
            success:false,
            message:"invalid request",
        })
    }

}