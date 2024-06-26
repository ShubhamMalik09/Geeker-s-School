import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { getPasswordResetToken } from '../services/operations/authAPI';

const ForgotPassword = () => {

    const [emailSent,setEmailSent] = useState(false);
    const [email,setEmail] = useState("");
    const {loading} = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const handleOnSubmit = (e) =>{
        e.preventDefault();
        dispatch(getPasswordResetToken(email, setEmailSent));
    }
  return (
    <div>
        <div className='text-white justify-center items-center'>
            {
                loading ?(
                    <div>Loading...</div>
                ):(
                    <div>
                        <h1>
                            {
                                !emailSent ? "Reset your Password" : "Check Your Email"
                            }
                        </h1>

                        <p>
                            {
                                !emailSent ? "Have no fear, we'll email you instructions to reset your password. If you dont have access to your email we can try account recovery" 
                                : `We have sent the reset email to ${email}`
                            }
                        </p>

                        <form onSubmit={handleOnSubmit}>
                            {
                                !emailSent && (
                                    <label>
                                        <p>Email Address</p>
                                        <input required type='email' name='email' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Enter your email address'/>
                                    </label>
                                )
                            }


                            <button type='submit'>
                                {
                                    !emailSent ? "Resent Password" : "Resend Email"
                                }
                            </button>
                        </form>


                        <div>
                            <Link to='/login'>
                                <p>Back to login</p>
                            </Link>
                        </div>
                    </div>
                )
            }
        </div>
      
    </div>
  )
}

export default ForgotPassword
