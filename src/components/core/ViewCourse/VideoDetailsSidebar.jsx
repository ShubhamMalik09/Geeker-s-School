import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import IconBtn from '../../common/IconBtn';

const VideoDetailsSidebar = ({setReviewModal}) => {

    const [activateStatus, setActivateStatus] = useState("");
    const [videoBarActive, setVideoBarActive] = useState("");
    const navigate = useNavigate();
    const {sectionId, subSectionId} = useParams();
    const location = useLocation();

    const {
        courseSectionData,
        courseEntireData,
        totalNoOfLectures,
        completedLectures
    } = useSelector((state)=> state.viewCourse)

    useEffect(()=>{
        const setActiveFlags = () =>{
            if(!courseSectionData.length)
                return;
            const currentSectionIndex = courseSectionData.findIndex(
                (data)=> data._id === sectionId
            )
            const currentSubSectionIndex = courseSectionData?.[currentSectionIndex]?.
                                            subSection.findIndex(
                                                (data)=> data._id === subSectionId
                                            )
            const activeSubSectionId = courseSectionData[currentSectionIndex]?.subSection[currentSubSectionIndex]?._id;

            setActivateStatus(courseSectionData?.[currentSectionIndex]?._id);
            setVideoBarActive(activeSubSectionId);
        }
        setActiveFlags();
    },[courseSectionData, courseEntireData, location.pathname])

  return (
    <>
      <div>
        <div>
            <div>
                <div onClick={()=>{
                    navigate("/dashboard/enrolled-courses");
                }}>
                    Back
                </div>

                <div>
                    <IconBtn
                        text="Add Review"
                        onClick={()=>{
                            setReviewModal(true)
                        }}
                    />
                </div>
            </div>
            <div>
                <p>{courseEntireData?.courseName}</p>
                <p>{completedLectures?.length} / {totalNoOfLectures}</p>
            </div>
        </div>

        <div>
            {
                courseSectionData.map((course,index)=>(
                    <div onClick={() => setActivateStatus(course?._id)} key={index}>
                        <div>
                            <div>
                                {course?.sectionName}
                            </div> 
                        </div>

                        <div>
                            {
                                activateStatus === course?._id && (
                                    <div>
                                        {
                                            course.subSection.map((topic,index) =>{
                                                <div className={`flex gap-5 p-5 ${videoBarActive === topic._id ? "bg-yellow-200 text-richblack-900" : "bg-richblack-900 text-white"}`}
                                                    key={index}
                                                    onClick={()=>{
                                                        navigate(`/view-course/${courseEntireData?._id}/section/${course?._id}/sub-section/${topic?._id}`)
                                                        setVideoBarActive(topic?._id) 
                                                    }}
                                                >
                                                    <input type="checkbox"
                                                        checked={completedLectures.includes(topic?._id)}
                                                     />
                                                    <span>{topic.title}</span>
                                                </div>
                                            })
                                        }
                                    </div>
                                )
                            }
                        </div>
                    </div>
                ))
            }
        </div>
      </div>
    </>
  )
}

export default VideoDetailsSidebar
