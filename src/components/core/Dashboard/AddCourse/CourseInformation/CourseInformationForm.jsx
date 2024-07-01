import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { HiOutlineCurrencyRupee } from 'react-icons/hi';
import RequirementField from './RequirementField';
import { setStep } from '../../../../../slices/courseSlice';
import IconBtn from ""

const CourseInformationForm = () => {

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState:{errors}} = useForm();

  const dispatch = useDispatch();
  const {token} = useSelector((state) => state.auth); 
  const {course, editCourse} = useSelector((state) => state.course);
  const [loading, setLoading] = useState(false);
  const [courseCategories, setCourseCategories] = useState([]);
  
  const getCategories = async() =>{
    setLoading(true);
    const categories = await fetchCourseCategories();
    if(categories.length >0){
      setCourseCategories(categories)
    }
    setLoading(false);
  }
  useEffect(()=>{
    if(editCourse){
      setValue("courseTitle",course.courseName);
      setValue("courseShortDesc",course.courseDescription);
      setValue("coursePrice",course.price);
      setValue("courseTags",course.tag);
      setValue("courseBenefits",course.whatYouWillLearn);
      setValue("courseCategory",course.category);
      setValue("courseRequirements",course.instructions);
      setValue("courseImage",course.thumbnail);
    }
    getCategories();
  },[])

  const isFormUpdated = () => {
    const currentValues = getValues();
    if(currentValues.courseTitle !== course.courseName
      || currentValues.courseShortDesc !== course.courseDescription
      || currentValues.coursePrice !== course.price
      || currentValues.courseTags.toString() !== course.tag.toString()
      || currentValues.courseBenefits !== course.whatYouWillLearn
      || currentValues.courseCategory._id != course.category._id 
      || currentValues.courseImage != course.thumbnail
      || currentValues.courseRequirements.toString() != course.instructions.toString()
    ) 
      return true;
    else return false;
  }

  const onSubmit = async(data)=>{
    if(editCourse){
      if(isFormUpdated()){
        const currentValues = getValues();
      const formData = new FormData();

      formData.append("courseId", course._id);
      if(currentValues.courseTitle !== course.courseName){
        formData.append("courseName",data.courseTitle);
      }

      if(currentValues.courseShortDesc !== course.courseDescription){
        formData.append("courseDescription",data.courseShortDesc );
      }

      if(currentValues.coursePrice !== course.price){
        formData.append("price",data.courseprice);
      }

      if(currentValues.courseBenefits !== course.whatYouWillLearn){
        formData.append("whatYouWillLearn",data.courseBenefits);
      }

      if(currentValues.courseCategory._id !== course.category._id){
        formData.append("category",data.courseCategory);
      }

      if(currentValues.courseRequirements.toString() !== course.instructions.toString()){
        formData.append("instructions",JSON.stringify(data.courseRequirements));
      }

      if(currentValues.courseTitle !== course.courseName){
        formData.append("courseName",data.courseTitle);
      }

      setLoading(true);
      const result= await editCourseDetails(formData,token);
      setLoading(false);
      if(result){
        setStep (2);
        dispatch(setCourse(result));
      }
      }
      else{
        toast.error("no changes made to the form")
      } 
      return ;
    }

    const formData = new FormData();
    formData.append("courseName",data.courseTitle);
    formData.append("courseDescription",data.courseShortDesc);
    formData.append("price",data.coursePrice);
    formData.append("whatYouWillLearn",data.courseBenefits);
    formData.append("category",data.courseCategory);
    formData.append("instructions",JSON.stringify(data.courseRequirements));
    formData.append("courseName",data.courseTitle);
    formData.append("courseName",data.courseTitle);
    formData.append("status",COURSE_STATUS.DRAFT);

    setLoading(true);
    const result = await addCourseDetails(formData,token);
    if(result){
      setStep (2);
      dispatch(setCourse(result));
    }
    setLoading(false);
    
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className='rounded-md border-richblack-700'>
      <div>
        <label htmlFor='courseTitle'>Course Title <sup>*</sup></label>
        <input type="text" id="courseTitle"
          placeholder='Enter Course Title'
          {...register("courseTitle", {required:true})}/>
          {
            errors.courseTitle && (
              <span>Course Title is Required</span>
            )
          }
      </div>

      <div>
        <label htmlFor='courseShortDesc'>Course Short Description</label>
        <textarea  id="courseShortDesc"
          placeholder='Enter Description'
          {...register("courseShortDesc",{required:true})}
        />
        {
          errors.courseShortDesc && (
            <span>Course Description is required</span>
          )
        }
      </div>

      <div>
        <label htmlFor='coursePrice'>Course Price <sup>*</sup></label>
        <input type="number" id="coursePrice"
          placeholder='Enter Course Price'
          {...register("coursePrice", {
                required:true,
                valueAsNumber:true})}
        />
        <HiOutlineCurrencyRupee/>
        {
          errors.coursePrice && (
            <span>Course Price is Required</span>
          )
        }
      </div>

      <div>
        <label htmlFor='courseCategory'>Course Category <sup>*</sup></label>
        <select
            id="courseCategory"
            defaultValue=""
            {...register("courseCategory",{required:true})}
        >
          <option value="" disabled>Choose a category</option>
          {
            !loading && courseCategories.map((category,index) =>(
              <option key={index} value={category._id}>{category?.name}</option>
            ))
          }
            
        </select>
        {
          errors.courseCategory && (
            <span>Course Category is Required</span>
          )
        }
      </div>

      <div>
        <label htmlFor='courseBenefits'>Benefits of the course</label>
        <textarea  id="courseBenefits"
          placeholder='Enter Benefits of the course'
          {...register("courseBenefits",{required:true})}
        />
        {
          errors.courseBenefits && (
            <span>Course Benefits is required</span>
          )
        }
      </div>

      <RequirementField
        name="courseRequirements"
        label="Requirements/Instructions"
        register={register}
        errors={errors}
        setValue={setValue}
        getValues={getValues}
      />
      <div>
        {
          editCourse && (
            <button onClick={() =>dispatch(setStep(2))}>Continue Without Saving</button>
          )
        }

        <IconBtn
          text={!editCourse ? "Next" :"Save Changes"}
        />
      </div>
    </form>
  )
}

export default CourseInformationForm
