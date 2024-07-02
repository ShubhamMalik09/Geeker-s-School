import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import IconBtn from "../../../../common/IconBtn"
import { GrAddCircle } from 'react-icons/gr';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { setStep } from '../../../../../slices/courseSlice';

const CourseBuilderForm = () => {

    const {register, handleSubmit, setValue, formState:{errors}} = useForm();
    const [editSectionName, setEditSectionName] = useState(null);
    const {course} = useSelector((state)=>state.course)
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const {token} = useSelector((state)=> state.auth)

    const onSubmit = async(data) => {
        setLoading(true);
        let result;
        if(editSectionName){
            result = await updateSection({
                sectionName: data.sectionName,
                sectionId : editSectionName,
                courseId: course._id
            },token)
        }
        else{
            result = await createSection({
                sectionName : data.sectionName,
                courseId: course._id
            },token)
        }

        if(result){
            dispatch(setCourse(result));
            setEditSectionName(null);
            setValue("sectionName","");
        }
        setLoading(false); 
    }

    const cancelEdit = () =>{
        setEditSectionName(null);
        setValue("sectionName","")
    }

    const goBack = ()=>{
        dispatch(setStep(1));
        dispatch(setEditCourse(true));
    }

    const goToNext = () => {
        if(course.courseContent.length===0){
            toast.error("Please add at least one section")
        }

        if(course.courseContent.some((section) => section.subSection.length===0)){
            toast.error("Please add least one lecture in each section");
        }

        dispatch(setStep(3));
    }

    const handleChangeEditSectionName = (sectionId,sectionName) =>{
        if(editSectionName == sectionId){
            cancelEdit();
            return;
        }
        setEditSectionName(sectionId);
        setValue("sectiionName",sectionName);
    }
  return (
    <div>
      <p>Course Buider</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
            <label htmlFor="sectionName">Section Name <sup>*</sup></label>
            <input
                type="text"
                id="sectionName"
                placeholder='Add a section name'
                {...register("sectionName",{required:true})} 
            />
            {
                errors.sectionName && (
                    <span>section name is required</span>
                )
            }
        </div>

        <div>
            <IconBtn 
                type="submit"
                text={editSectionName ? "Edit Section Name" : "Create Section Name"}
                outline={true}
            >
                <GrAddCircle/>
            </IconBtn>

            {
                editSectionName && (
                    <button type='button' onClick={cancelEdit}>
                        Cancel Edit
                    </button>
                )
            }

        </div>
      </form>

      {
        course.courseContent.length > 0 && (
            <NestedView handleChangeEditSectionName={handleChangeEditSectionName}/>
        )
      } 
      <div>
        <button onClick={goBack}>back</button>
        <IconBtn text="Next" onClick={goToNext}></IconBtn>
    </div>
    </div>
  )
}

export default CourseBuilderForm
