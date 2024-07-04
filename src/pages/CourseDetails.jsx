import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { buyCourse } from '../services/operations/studentFeaturesAPI';

const CourseDetails = () => {
  
  const {user} = useSelector((state) => state.profile);
  const {token} = useSelector((state) => state.auth); 
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const courseId = useParams(); 

  const handleBuyCourse = () =>{
      if(token) {
          buyCourse(token,[courseId],user,navigate,dispatch);
          return;
      }
  }
  return (
    <div>
      <button onClick={()=> handleBuyCourse()}>Buy Now</button>
    </div>
  )
}

export default CourseDetails
