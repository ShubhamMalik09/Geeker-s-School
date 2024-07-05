import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { buyCourse } from '../services/operations/studentFeaturesAPI';
import { fetchCourseDetails } from '../services/operations/courseDetailsAPI';
import { Error } from './Error';
import ConfirmationModal from "../components/common/ConfirmationModal"
import RatingStars from "../components/common/RatingStars"
import CourseDetailsCard from '../components/core/Course/CourseDetailsCard';

const CourseDetails = () => {
  
  const {user} = useSelector((state) => state.profile);
  const {token} = useSelector((state) => state.auth); 
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const courseId = useParams(); 

  const [courseData, setCourseData] = useState(null); 
  const [confirmationModal, setConfirmationModal] = useState(null);

  const {loading} = useSelector((state)=> state.profile);
  const {paymentLoading} = useSelector((state) => state.course).

  useEffect(()=>{
    const getCourseFullDetails = async() =>{
      try{
        const result = await fetchCourseDetails(courseId);
      } catch(err){ 
        console.log("Could not fetch course Details");
      }
    }
    getCourseFullDetails();
  },[courseId]);

  const [avgReviewCount, setAvgReviewCount] = useState(0);

  useEffect(()=>{
    const count = GetAvgRating(courseData?.data?.courseDetails.ratingAndReviews);
    setAvgReviewCount(count);
  },[courseData]);

  const [totalNoOfLectures, setTotalNoOfLectures] = useState(0);

  useEffect(()=>{
    let lectures=0;

    response?.data?.courseDetails?.courseContent?.forEach((sec)=>{
      lectures += sec.subsection.length || 0;
    })

    setTotalNoOfLectures(lectures);
  },[courseData]);

  const handleBuyCourse = () =>{
      if(token) {
          buyCourse(token,[courseId],user,navigate,dispatch);
          return;
      }
      setConfirmationModal({
        text1:"you are not logged in",
        text2:"Please login to purchase the course",
        btn1Text:"Login",
        btn2Text:"Cancel",
        btn1Handler:() => navigate("/login"),
        btn2Handler:() => setConfirmationModal(null),
      })

  }

  const [isActive, setIsActive] = useState(Array(0));

  const handleActive = (id) =>{
    setIsActive(
      !isActive.includes(id) ? isActive.concat(id) : isActive.filter( (e) => e!=id)
    )
  }

  if(loading || !courseData){
    return (
      <div>
        Loading.....
      </div>
    )
  }

  if(!courseData.success){
    return (
      <div>
        <Error/>
      </div>
    )
  }

  const {
    _id:course_id,
    courseName,
    courseDescription, 
    thumbnail,
    price,
    whatYouWillLearn,
    courseContent,
    ratingAndReviews,
    instructor,
    studentsEnrolled,
    createdAt,
  } = courseData.data?.courseDetails

  return (
    <div>
      <p>{courseName}</p>
      <p>{courseDescription}</p>
      <div>
        <span>{avgReviewCount}</span>
        <RatingStars Review_Count= {avgReviewCount} Star_Size={24} />
        <span>{`${ratingAndReviews.length} reviews`}</span>
        <span>{`${studentsEnrolled.length} students enrolled`}</span>
      </div>
    
      <div>
        <p>Created By {`${instructor.firstName}`}</p>
      </div>

      <div>
        <p>Created at {formatDate(createdAt)}</p>
        <p>{" "} English</p>
      </div>

      <div>
        <CourseDetailsCard 
          course={courseData?.data?.courseDetails}
          setConfirmationModal={setConfirmationModal}
          handleBuyCourse={handleBuyCourse}
        />
      </div>

      <div>
        <p>
          What you will learn
        </p>
        <div>
          {whatYouWillLearn}
        </div>
      </div>

      <div>
        <div>
          <p>Course Content</p>
        </div>

        <div>
          <div>
            <span>{courseContent.length} section(s)</span>
            <span>{totalNoOfLectures} lectures</span>
            <span>{courseData.data?.totalDuration} total length</span>
          </div>

          <div>
            <button onClick={setIsActive([])}>
              Collapse all sections
            </button>
          </div>
        </div> 
      </div>





      {confirmationModal && <ConfirmationModal modalData={confirmationModal}/>}
      <button onClick={()=> handleBuyCourse()}>Buy Now</button>
    </div>
  )
}

export default CourseDetails
