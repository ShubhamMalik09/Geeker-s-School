import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import OTPInput from 'react-otp-input';
import { Link, useNavigate} from 'react-router-dom';
import { sendOtp } from '../services/operations/authAPI';

const VerifyEmail = () => {
    const [otp, setOtp] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {signUpData,loading} = useSelector((state) => state.auth);

    useEffect(()=>{
        if(signUpData){
            navigate("/signup");
        }
    })
    const handleOnSubmit = (e) =>{
        e.preventDefault();
        const {
            accountType,
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
        } = signUpData;
        dispatch(signUp(accountType,
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            otp,
            navigate));
    }
  return (
    <div className='text-white'>
        {
        loading ? (
            <div>
                Loading...
            </div>) : (
            <div>
                <h1>Verify Email</h1>
                <p>A verification code have been sent to you. Enter the code below</p>
                <form onSubmit={handleOnSubmit}>
                    <OTPInput
                        value={otp}
                        onchange={setOtp}
                        numInputs={6}
                        renderSeparator= {<span>-</span>}
                        renderInput={(props) => <input {...props} placeholder='-' />}
                        />
                    
                    <button type='submit'>
                        Verify Email
                    </button>

                </form>

                <div>
                    <div>
                        <Link to="/login">
                            <p>Back to login</p> 
                        </Link>
                    </div>

                    <button onClick={()=> dispatch(sendOtp(signUpData.email,navigate))}>
                        Resend it
                    </button>
                </div>
            </div>
            )
    }
    </div>
  )
}

export default VerifyEmail
