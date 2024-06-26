import React, { useState } from 'react'
import { useSelector } from 'react-redux'

const UpdatePassword = () => {
    const [formData, setFormData] = useState({
        password:"",
        confirmPassword:"",
    })
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const {loading} = useSelector((state) => state.auth);
  return (
    <div>
      {
        loading ?(
            <div>Loading</div>
        ):(
            <div>
                <h1>Choose new Password</h1>
                <p>Almost done. Enter your new password and youre all set </p>

                <form action="">
                    <label>
                        <p>New Password</p>
                        <input required type={showPassword ? "text" : "password"} name="password" value={password} onChange={handleOnChange} />
                    </label>
                </form>
            </div>

        )
      }
    </div>
  )
}

export default UpdatePassword
