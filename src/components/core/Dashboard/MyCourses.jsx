import React, { useDebugValue, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'

const MyCourses = () => {
    const {token} = useSelector((state) => state.auth);
    const navigate =useNavigate();
    const [courses, setCourses] = useState();

    useEffect(() =>{
        const fetchCourses = async() =>{
            const result = await fetchInstructorCourses(token);
            if(result){
                setCourses(result);
            }
        }
        fetchCourses();
    },[])
  return (

    <div>
      <div>
        <h1>
            My Courses
        </h1>
        <IconBtn
            text="Add Course"
            onClick = {()=> navigate("/dashboard/add-course")}
        />
      </div>

      {courses && <CoursesTable courses={courses} setCourses={setCourses}/>}
    </div>
  )
}

export default MyCourses
