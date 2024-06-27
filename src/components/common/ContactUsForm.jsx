import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useForm } from 'react-hook-form';
import { apiConnector } from '../../services/apiconnector';
import { contactusEndpoint } from '../../services/api';
import CountryCode from "../../data/countrycode.json"

const ContactUsForm = () => {
    const [loading,setLoading] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        formstate : {errors, isSubmitSuccessfull}
    } = useForm();

    const submitContactForm = async (data) =>{
        try{
            setLoading(true);
            const response = await apiConnector("POST", contactusEndpoint.CONTACT_US_API,data);
            console.log(response);
            setLoading(false);
        } catch(err){
            console.log("Error:", err.message);
            setLoading(false);
        }
    }

    useEffect(()=>{
        if(isSubmitSuccessfull){
            reset({
                email:"",
                firstName:"",
                lastName:"",
                message:"",
                phoneNo : "",
            }, [reset,isSubmitSuccessfull])
        }
    })
  return (
    <form onSubmit={handleSubmit(submitContactForm)}>
        <div>
            <div>
                <label htmlFor='firstname'>First Name</label>
                <input 
                    type="text"
                    name="firstname"
                    id='firstname'
                    placeholder='Enter first Name'

                    {...register("firstname",{required:true})}
                />
                {
                    errors.firstName && (
                        <span>
                            Please enter your name
                        </span>
                    )
                }
            </div>

            <div>
                <label htmlFor='lastname'>Last Name</label>
                <input 
                    type="text"
                    name="lastname"
                    id='lastname'
                    placeholder='Enter last Name'

                    {...register("lastname")}
                />
            </div>


            <div>
                <label htmlFor='email'>email</label>
                <input 
                    type="email"
                    name="email"
                    id='email'
                    placeholder='Enter Email'

                    {...register("email", {required:true})}
                />
                {
                    errors.email && (
                        <span>
                            Please enter your email address
                        </span>
                    )
                }
            </div>

            <div className='flex flex-col gap-2'>

                <label htmlFor="phonenumber">Phone Number</label>
                <div className='flex flex-row gap-5'>
                    <div>
                        <select name="dropdown" id="dropdown" {...register("countrycode", {required:true})}>
                            {
                                CountryCode.map((element,index) =>(
                                    <option key={index} value={element.code}>
                                        {element.code} - {element.country}
                                    </option>
                                ))
                            }
                        </select>
                    </div>

                    <div>
                        <input 
                            type="number"
                            name='phonenumber' 
                            id='phonenumber'
                            placeholder='12345 67890'
                            className='text-black'
                            {...register("phoneNo",
                                {
                                    required:{value:true, message:"Please enter Phone Number"},
                                    maxLength :{value:10, message:"Invalid PhoneNo."},
                                    minLength: {value:8, message:"Invalid PhoneNo."},
                                })}
                        />
                    </div>
                </div>
                {
                    errors.phoneNo && (
                        <span>
                            {errors.phoneNo.message}
                        </span>
                    )
                }
            </div>

            <div>
                <label htmlFor="message">Message</label>
                <textarea name="message" id="message" cols="30" rows="7" placeholder='Enter your message' {...register("message",{required:true})}/>
                {
                    errors.message && (
                        <span>
                            Please Enter your message
                        </span>
                    )
                }
            </div>

            <button type='submit'>
                Send Message 
            </button>
        </div>
    </form>
  )
}

export default ContactUsForm
