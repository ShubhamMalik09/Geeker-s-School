import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import ReactStars from 'react-stars';

const CourseReviewModal = ({setReviewModal}) => {

    const {user} = useSelector((state) => state.profile);
    const {token} = useSelector((state) => state.auth);
    const {courseEntireData} = useSelector((state)=> state.viewCourse)

    const {
        register,
        handleSubmit, 
        setValue,
        formState : {errors}
    } = useForm()

    useEffect(()=>{
        setValue("courseExperience","");
        setValue("courseRating",0);
    },[])

    const onSubmit = async(data) =>{
      await createRating({
        courseId:courseEntireData._id,
        rating:data.courseRating,
        review:data.courseExperience,
      },token);

      setReviewModal(false);

    }

    const ratingChanged = (newRating) =>{
      setValue("courseRating",newRating)
    }

  return (
    <div>
      <div>
        <div>
            <p>Add Review</p>
            <button onClick={setReviewModal(false)}>Close</button>
        </div>

        <div>
            <div>
                <img src={user?.image} alt="user Image"/>
                <div>
                    <p>{user?.firstName} {user?.lastName}</p>
                    <p>Posting Publicly</p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <ReactStars
                count={5}
                onChange={ratingChanged}
                size={24}
              />

              <div>
                <label htmlFor="courseExperience">
                  Add your experience
                </label>
                <textarea 
                  placeholder="Add your experience"
                  {...register("courseExperience",{required:true})}
                />

                {
                  errors.courseExperience && (
                    <span>
                      Please add your experience
                    </span>
                  )
                }
              </div>

              <div>
                <button
                  onClick={()=> setReviewModal(false)}
                >
                  Cancel
                </button>
                <IconBtn
                  text="save"
                />
              </div>

            </form>
        </div>
      </div>
    </div>
  )
}

export default CourseReviewModal
