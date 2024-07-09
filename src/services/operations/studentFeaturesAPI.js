import { toast } from "react-hot-toast"

import rzpLogo from "../../assets/Logo/rzp_logo.png"
import { resetCart } from "../../slices/cartSlice"
import { setPaymentLoading } from "../../slices/courseSlice"
import { apiConnector } from "../apiconnector"
import { studentEndpoints } from "../api"

const {COURSE_PAYMENT_API, COURSE_VERIFY_API, SEND_PAYMENTS_SUCCESS_EMAIL_API} = studentEndpoints;

function loadscript(src){
    return new Promise((resolve) =>{
        const script = document.createElement("script");
        script.src= src;

        script.onload = () =>{
            resolve(true);
        }
        script.onerror = () =>{
            resolve(false);
        }

        document.body.appendChild(script);
    })
}

export async function buyCourse(token, courses, userDetails,navigate,dispatch){
    const toastId = toast.loading("Loading....")
    try{
        const res= await loadscript('https://checkout.razorpay.com/v1/checkout.js')
        if(!res){
            toast.error("RazorPay SDK failed to load");
            return;
        }

        const orderResponse = await apiConnector("POST", COURSE_PAYMENT_API,
                                    {courses},
                                    {
                                        Authorization:`Bearer ${token}`,
                                    }
        )

        if(!orderResponse.data.success){
            throw new Error(orderResponse.data.message);
        }

        const options = {
            key:process.env.RAZORPAY_KEY,
            currency: orderResponse.data.message.curreny,
            amount:`${orderResponse.data.message.amount}`,
            order_id: orderResponse.data.message.id,
            name:"Geeker's School",
            description: 'Thank You for Purchasing the COurse',
            image:rzpLogo,
            prefill: {
                name: `${userDetails.firstName}`,
                email: `${userDetails.email}`
            },
            handler: function(response){
                sendPaymentSuccessEmail(response, orderResponse.data.message.amount, token);
                verifyPayment({...response,courses}, token, navigate, dispatch);
            }
        }

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
        paymentObject.on("payment.failed",function(response){
            toast.error("oops, payment failed");
            console.log(response.error);
        })
    } catch(err){
        console.log("payment API error ",err);
        toast.error("Could not make payment");
    }
    toast.dismiss(toastId); 
}


async function sendPaymentSuccessEmail(response ,amount, token){
    try{
        await apiConnector("POST", SEND_PAYMENTS_SUCCESS_EMAIL_API,{
            orderId:response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            amount
        },{
            Authorization : `Bearer ${token}`
        })
    } catch(err){ 
        console.log("Payment success email error", err)
    }
}

async function verifyPayment(bodyData, token, navigate, dispatch){
    const toastId = toast.loading ("Verifying Payment....");
    dispatch(setPaymentLoading(true));
    try{
        const response = await apiConnector("POST",COURSE_VERIFY_API,bodyData,{
            Authorization :`Bearer ${token}`
        })
        if(!response.data.success){
            throw new Error(response.data.message);
        }
        toast.success("Payment successfull, you are added to the course")
        navigate("/dashboard/enrolled-courses");
        dispatch(resetCart());
    } catch(err){
        console.log("Payment verify error", err);
        toast.error("Could not verify Payment")
    }
    toast.dismiss(toastId);
    dispatch(setPaymentLoading(false));
}