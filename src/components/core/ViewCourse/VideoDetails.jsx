import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Player } from 'video-react';
import 'video-react/dist/video-react.css';
import {AiFillPlayCircle} from "react-icons/ai"

const VideoDetails = () => {

  const {courseId, sectionId, subSectionId} = useParams();
  const navigate= useNavigate();
  const dispatch = useDispatch();
  const playerRef = useRef();
  const location = useLocation();
  const {token} = useSelector((state) => state.auth);
  const {courseSectionData, courseEntireData, completedLectures} = useSelector((state) => state.viewCourse);

  const [videoData, setVideoData] = useState([]);
  const [videoEnded, setVideoEnded] = useState(false);
  const [loading, setLoading] = useState(false);


  useEffect(()=>{
    const setVideoSpecificDetails = async() =>{
      if(!courseSectionData.length) return;
      if(!courseId && !sectionId && !subSectionId) navigate('/dashboard/enrolled-courses');
      else{
        const filteredData = courseSectionData.filter((course) => course._id===sectionId);
        const filteredVideoData = filteredData?.[0].subSection.filter((data => data._id === subSectionId));
        setVideoData(filteredVideoData[0]);
        setVideoEnded(false);
      }
    }
    setVideoSpecificDetails();
  },[courseSectionData, courseEntireData, location.pathname])


  const isFirstVideo = () =>{
    const currentSectionIndex = courseSectionData.findIndex((data) => data._id === sectionId);
    const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex((data) => data._id === subSectionId);

    if(currentSectionIndex === 0 && currentSubSectionIndex===0){
      return true;
    }
    else return false;
  }

  const isLastVideo = ()=>{
    const currentSectionIndex = courseSectionData.findIndex((data) => data._id === sectionId);
    const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex((data) => data._id === subSectionId);

    const noOfSubSection = courseSectionData[currentSectionIndex].subSection.length;


    if(currentSectionIndex === courseSectionData.length-1 && currentSubSectionIndex===noOfSubSection-1){
      return true;
    }
    else return false;
  }

  const goToNextVideo = () =>{
    const currentSectionIndex = courseSectionData.findIndex((data) => data._id === sectionId);
    const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex((data) => data._id === subSectionId);

    const noOfSubSection = courseSectionData[currentSectionIndex].subSection.length;

    if(currentSubSectionIndex !== noOfSubSection-1){
      const nextSubSectionId = courseSectionData[currentSectionIndex].subSection[currentSubSectionIndex+1]._id;
      navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`);
    }
    else{
      const nextSectionId = courseSectionData[currentSectionIndex+1]._id;
      const nextSubSectionId = courseSectionData[currentSectionIndex+1].subSection[0]._id;
      navigate(`/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubSectionId}`);
    }
  }

  const goToPrevVideo = () =>{

    const currentSectionIndex = courseSectionData.findIndex((data) => data._id === sectionId);
    const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex((data) => data._id === subSectionId);

    if(currentSubSectionIndex !== 0){
      const prevSubSectionId = courseSectionData[currentSectionIndex].subSection[currentSubSectionIndex-1]._id;
      navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSectionId}`);
    }
    else{
      const prevSectionId = courseSectionData[currentSectionIndex-1]._id;
      const noOfSubSection = courseSectionData[currentSectionIndex-1].subSection.length;
      const prevSubSectionId = courseSectionData[currentSectionIndex+1].subSection[noOfSubSection-1]._id;
      navigate(`/view-course/${courseId}/section/${prevSectionId}/sub-section/${prevSubSectionId}`);
    }
  }

  const handleLectureCompletion = async() =>{
    setLoading(true);

    const res = await markLectureAsComplete({courseId:courseId, subSectionId:subSectionId ,},token);

    if(res){
      dispatch(updateCompletedLectures(subSectionId));
    }


    setLoading(false);

  }

  return (
    <div>
      {
        !videoData ? (<div>No Data Found</div>)
        : (
          <Player
            ref={playerRef}
            aspectRatio='16:9'
            playsInline
            onEnded={() => setVideoEnded(true)}
            src={videoData?.videoUrl}
          >

            <AiFillPlayCircle />

            {
              videoEnded && (
                <div>
                  {
                    !completedLectures.includes(subSectionId) && (
                      <IconBtn
                         disabled = {loading}
                         onClick = {()=> handleLectureCompletion}
                         text ={!loading ? "mark as Completed": "loading"}
                      />
                    )
                  }

                  <IconBtn
                    disabled={loading}
                    onClick={()=>{
                      if(playerRef?.current){
                        playerRef.current?.seek(0);
                        videoEnded(false);
                      }
                    }}
                    text="Rewatch"
                    customClasses = ""
                  />

                  <div>
                    {
                      !isFirstVideo() && (
                        <button
                          disabled={loading}
                          onClick={goToPrevVideo}
                          className='blackbutton'
                        >
                          Prev
                        </button>
                      )
                    }
                    {
                      !isLastVideo() && (
                        <button
                          disabled={loading}
                          onClick={goToNextVideo}
                          className='blackbutton'
                        >
                          Next
                        </button>
                      )
                    }
                  </div>
                </div>
              )
            }

          </Player>
        )
      }

      <h1>{videoData?.title}</h1>
      <p>{videoData?.description}</p>
    </div>
  )
}

export default VideoDetails
