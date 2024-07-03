import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';

const PublishCourse = () => {
    const {register, handleSubmit, setValue, getValues} = useForm();
    const dispatch = useDispatch();
    const {token} = useSelector((state)=> state.auth);
    const [loading,setLoading] = useState(false)

    const goBack = () =>{
        dispatch(setStep(2));
    }

    useEffect(()=>{
        if(course?.status === COURSE.STATUS.PUBLISHED){
            setValue("public", true);
        }
    },[])

    const goToCourses = () =>{
        dispatch(resetCourseState()); 
    }
    const handleCoursePublish = async() =>{
        if(course?.status===COURSE_STATUS.PUBLISHED && getValues("public")===true 
        || course.status === COURSE.STATUS.DRAFT && getValues("public")===false){
            goToCourses();
            return;
        }

        const formData = new FormData();
        formData.append("courseId")
        const courseStatus = getValues("public") ? COURSE.STATUS.PUBLISHED : COURSE_STATUS.DRAFT;
        formData.append("status",courseStatus);

        setLoading(true);
        const result = await editCourseDetails(formData,token);

        if(result){
            goToCourses();
        }

        setLoading(false);
    }
    const onSubmit = ()=>{
        handleCoursePublish();
    }
  return (
    <div>
      <p>Publish Course</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
            <lable>Make this course as Public</lable>
            <input
                type='checkbox'
                id='public'
                {...register("public")}
            />
        </div>

        <div>
            <button disabled={loading} type='button' onClick={goBack}>Back</button>
            <IconBtn disabled={loading} text="save changes"/>
        </div>
      </form>
    </div>
  )
}

export default PublishCourse
