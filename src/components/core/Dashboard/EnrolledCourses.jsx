import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import getUserEnrolledCoursses from "../../../services/operations/profileAPI"

const EnrolledCourses = () => {
    const {token} = useSelector((state)=>state.auth);
    const [enrolledCourses,setEnrolledCourses] = useState(null);

    useEffect(()=>{
      const getEnrolledCourses = async() =>{
        try{
            const response = await getUserEnrolledCourses(token);
            setEnrolledCourses(response);
        } catch(error){
            console.log("Unable to get Enrolled Courses");
        }
      }   
    },[]);

  return (
    <div>
      <div>Enrolled Courses</div>
    </div>
  )
}

export default EnrolledCourses
