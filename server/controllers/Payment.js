const {instance} = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const { default: mongoose } = require("mongoose");
const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentEmail");

exports.capturePayment =  async(req, res) =>{
    const {courses} = req.body;
    const userId = req.user.id;

    if(courses.length===0){
        return res.json({
            success:false,
            message:"Please provide course id"
        });
    }

    let totalAmount = 0;
    for(const course_id of courses){
        let course;
        try{
            course = await Course.findById(course_id);
            if(!course){
                return res.status(200).json({
                    success:false,
                    message:"Coukd not find the course"
                });
            }

            const uid = new mongoose.Types.ObjectId(userId);
            if(course.studentsEnrolled.includes(uid)){
                return res.status(200).json({
                    success:false,
                    message:"Student is already enrolled"
                })
            }
            totalAmount += course.price
        } catch(error){
            console.log(error)
            return res.status(500).json({
                success:false,
                message:error.message
            })
        }
    }

    const options = {
        amount: totalAmount*100,
        currency:"INR",
        receipt: Math.random(Date.now().toString())
    }

    try{
        const paymentResponse = instance.orders.create(options)
        res.json({
            success:true,
            message:paymentResponse,
        })
    } catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Could not initiate order"
        })
    }
}

exports.verifyPayment = async(req, res) =>{
    const razorpay_order_id = req.body?.razorpay_order_id
    const razorpay_payment_id = req.body?.razorpay_payment_id
    const razorpay_signature = req.body?.razorpay_signature
    const courses = req.body?.courses
    const userId= req.user.id;
 
    if(!razorpay_order_id || !!razorpay_payment_id || !razorpay_signature|| !courses || !userId ){
        return res.status(200).json({
            success:false,
            message:"Payment Failed"
        })
    }

    let body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
                            .createHmac("sha256", process.env.RAZORPAY_SECRET)
                            .update(body.toString())
                            .digest("hex")
    if(expectedSignature === razorpay_signature){
        await enrollStudents({courses,userId,res})
        return res.status(200).json({
            success:true,
            message:"Payment verified"
        }) 
    }
    return res.status(200).json({
        success:false,
        message:"Payment failed"
    })
} 

const enrollStudents = async(courses, userId, res) =>{
    if(!courses || !userId){
        return res.status(400).json({
            success:false,
            message:"Please Provide data for courses or userId"
        })
    }
    for(const courseId of courses){
        try{
            const enrolledCourse = await  Course.findByIdAndUpdate({_id:courseId},{$push:{studentsEnrolled:userId}},{new:true});
            if(!enrolledCourse){
                return res.status(500).json({
                    success:false,
                    message:"Course not found"
                })
            }
            const enrolledStudent = await User.findByIdAndUpdate({_id:userId},{$push:{courses:courseId}},{new:true});
            const emailResponse = await mailSender(
                enrollStudents.email,
                `Successfully enrolled into ${enrolledCourse.courseName}`,
                courseEnrollmentEmail(enrolledCourse.courseName, `${enrollStudents.firstName}`)
            )
            console.log("Email sent Successfully",emailResponse.response)
        
        } catch(err){
            console.log(err);
            return res.status(500).json({
                success:false,
                message:err.message
            })
        }
    }
    
}

exports.sendPaymentSuccessEmail = async(req,res) =>{
    const {orderId, paymentId, amount} = req.body;

    const userId = req.user.id;

    if(!orderId || !paymentId || !amount || !userId){
        return res.status(400).json({
            success:false,
            message :"Please provide all the fields"
        })
    }

    try{
        const enrolledStudent = await User.findById(userId); 
        await mailSender(
            enrolledStudent.email,
            `Payment Received`,
            paymentSucessEmail(`${enrolledStudent.firstName}`,amount/100,orderId,paymentId)

        )
    } catch(err){
        console.log("error in sending mail",err);
        return res.status(500).json({
            success:false,
            message:"Could not send email"
        })
    }
}





// exports.capturePayment = async (req,res) => {
//     const {course_id} = req.body;
//     const userId = req.user.id;

//     if(!course_id){
//         return res.json({
//             success:false,
//             message:"Please provide valid course Id"
//         });
//     };

//     let course;
//     try{
//         course = await Course.findById(course_id);
//         if(!course){
//             return res.status(400).json({
//                 sucess:false,
//                 message:"Course not found",
//             })
//         }

//         const uid = new mongoose.Types.ObjectId(userId);
//         if(course.studentsEnrolled.includes(uid)){
//             return res.status(400).json({
//                 success:false,
//                 message:"Student is already enrolled",
//             })
//         }


//     } catch(err){
//         console.error(err);
//         return res.status(500).json({
//             success:false,
//             message:err.message
//         })
//     }

//     const amount = course.price;
//     const currency = "INR";

//     const options = {
//         amount:amount*100,
//         currency,
//         receipt:Math.random(Date.now().toString()),
//         notes:{
//             courseId : course_id,
//             userId,
//         }
//     };

//     try{

//         const paymentResponse = instance.orders.create(options);
//         console.log(paymentResponse);

//         return res.status(200).json({
//             success:true,
//             courseName:course.courseName,
//             courseDescription:course.courseDescription,
//             thumbnail:course.thumbnail,
//             orderId:paymentResponse.id,
//             currency:paymentResponse.currency,
//             amount:paymentResponse.amount,
//         })

//     } catch(err){
//         console.log(err);
//         res.json({
//             success:false,
//             message:"Could not initiate order",
//         })
//     }
// };  

// exports.verifySignature = async (req,res) =>{
//     const webHookSecret = "12345678";
//     const signature = req.headers["x-razorpay-signature"];

//     const shasum = crypto.createHmac("sha256",webHookSecret);
//     shasum.update(JSON.stringify(req.body));
//     const digest = shasum.digest("hex");

//     if(signature === digest){
//         console.log("payment is authorized"); 

//         const {userId, courseId} = req.body.payload.payment.entity.notes;

//         try{
//             const enrolledCourse = await Course.findOneAndUpdate(
//                                                 {_id:courseId},
//                                                 {$push:
//                                                     {
//                                                         studentsEnrolled:userId,
//                                                     }
//                                                 },
//                                                 {new:true});
//             if(!enrolledCourse){
//                 return res.status(500).json({
//                     success:false,
//                     message:"Course not found",
//                 }); 
//             }
//             console.log(enrolledCourse);

//             const enrolledStudent = await User.findOneAndUpdate(
//                                             {_id:userId},
//                                             {$push:{courses:courseId}},
//                                             {new:true},
//             );
//             console.log(enrolledStudent);

//             const emailResponse = await mailSender(
//                             enrolledStudent.email,
//                             "Congratulation , you successfully enrolled in the course",
//                             "Congratulation , you successfully enrolled in the course",

//             )
//             console.log(emailResponse);
//             return res.status(200).json({
//                 success:true,
//                 message:"Signature verified and course added",
//             });
//         } catch(err){
//             console.log(err);
//             return res.status(500).json({
//                 success:false,
//                 message:err.message,
//             })
//         }
//     }

//     else{
//         return res.status(400).json({
//             success:false,
//             message:"invalid request",
//         })
//     }

// }