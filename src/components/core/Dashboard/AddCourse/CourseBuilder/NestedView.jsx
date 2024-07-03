import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RxDropdownMenu } from 'react-icons/rx';
import { MdEdit } from 'react-icons/md';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { BiDownArrow } from 'react-icons/bi';
import { AiOutlinePlus } from 'react-icons/ai';
import SubSectionModal from './SubSectionModal';
import { setCourse } from '../../../../../slices/courseSlice';
import { deleteSubSection } from '../../../../../../server/controllers/SubSection';

const NestedView = ({handleChangeEditSectionName}) => {

    const {course} = useSelector((state)=>state.course);
    const {token} = useSelector((state)=>state.auth);
    const dispatch = useDispatch();
    const [addSubSection ,setAddSubSection] = useState(null);
    const [editSubSection ,setEditSubSection] = useState(null);
    const [viewSubSection ,setViewSubSection] = useState(null);

    const [confirmationModal, setConfirmationModal] = useState(null);

    const handleDeleteSubSection = async(subSectionId,sectionId)=>{
        const result = await deleteSubSection({
            subSectionId,
            sectionId,
            token
        })
        if(result){
            const updatedCourseContent = course.courseContent.map(
                                                    (section) => section._id === sectionId ? result: section);
            const updatedCourse = {...course, courseContent : updatedCourseContent}                                      
            dispatch(setCourse(updatedCourse));
        }
        setConfirmationModal(null)
    }
    const handleDeleteSection = async(sectionId)=>{
        const result = await deleteSection({
            sectionId,
            courseId: course._id,
            token
        })

        if(result) {
            dispatch(setCourse(result))
        }

        setConfirmationModal(null);
    }

  return (
    <div>
      <div>
        {
            course?.courseContent?.map((section) =>(
                <details key={section._id} open>
                    <summary>
                        <div>
                            <RxDropdownMenu/>
                            <p>{section.sectionName}</p>
                        </div>
                        <div>
                            <button onClick={handleChangeEditSectionName(section._id, section.sectionName)}>
                                <MdEdit/>
                            </button>
                            <button onClick={()=>{
                                setConfirmationModal({
                                    text1:"Delete the Section",
                                    text2:"All the lectures in this section will be deleted",
                                    btn1Text:"Delete",
                                    btn2Text:"Cancel",
                                    btn1Handler : ()=>handleDeleteSection(section._id),
                                    btn2Handler : () =>setConfirmationModal(null),
                                })
                            }}>
                                <RiDeleteBin6Line/>

                            </button>
                            <span></span>
                            <BiDownArrow/>
                        </div>
                    </summary>
                    <div> 
                        {
                            section.subSection.map((data) =>(
                                <div key={data?._id} onClick={ () => setViewSubSection(data)}>
                                    <div>
                                        <RxDropdownMenu/>
                                        <p>{data.title}</p>
                                    </div>

                                    <div>
                                        <button onClick={()=> setEditSubSection({...data,sectionId:section._id})}>
                                            <MdEdit/>
                                        </button>
                                        <button onClick={()=>{
                                setConfirmationModal({
                                    text1:"Delete the Sub Section",
                                    text2:"All the lectures in this section will be deleted",
                                    btn1Text:"Delete",
                                    btn2Text:"Cancel",
                                    btn1Handler : ()=>handleDeleteSubSection(data._id,section._id),
                                    btn2Handler : () =>setConfirmationModal(null),
                                })
                            }}>
                                <RiDeleteBin6Line/>

                            </button>
                                    </div>
                                </div>
                            ))
                        }
                        <button onClick={setAddSubSection(section._id)}>
                            <AiOutlinePlus/>
                            <p>Add Lecture</p>
                        </button>
                    </div>
                </details>
            ))
        }
      </div>
      {
        addSubSection ? 
        (<SubSectionModal
            modalData={addSubSection}
            setModalData={setAddSubSection}
            add={true}
        />)
        : viewSubSection ?
        (<SubSectionModal
            modalData={viewSubSection}
            setModalData={setViewSubSection}
            view={true}
        />)
        : editSubSection ?
        (<SubSectionModal
            modalData={editSubSection}
            setModalData={setEditSubSection}
            edit={true}
        />) : (<div></div>)
      }
      {
        confirmationModal ?(
            <confirmationModal modalData={confirmationModal} />
        ) : (<div></div>)
      }
    </div>
  )
}

export default NestedView
