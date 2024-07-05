import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import copy from 'copy-to-clipboard';
import toast from 'react-hot-toast';
import {ACCOUNT_TYPE} from '../../../utils/constant'

const CourseDetailsCard = ({course, setConfirmationModal, handleBuyCourse}) => {
    const {user} = useSelector((state)=> state.profile);
    const {token} = useSelector((state) => state.auth)
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const{
        thumbnail:ThumbnailImage,
        price:currentPrice,
    } = course;

    const handleAddToCart = () =>{
        if(user && user?.accountType === ACCOUNT_TYPE.INSTRUCTOR){
            toast.error("You are an instructor, you can't buy a course")
        }
        if(token){
            dispatch(addToCart(course));
            return;
        }
        setConfirmationModal({
            text1:"You are not Logged in",
            text2:"Please login to add to cart",
            btn1Text:"login",
            btn2Text:"cancel",
            btn1Handler:()=>navigate("/login"),
            btn2Handler:()=>setConfirmationModal(null),
        })
    }

    const handleShare = ()=>{
        copy(window.location.href);
        toast.success("Link copied to clipboard")
    }
  return (
    <div>
       <img src={ThumbnailImage} className='max-h-[300px] min-h-[180px] w-[400px] rounded-xl'/>
       <div>Rs. {currentPrice}</div>
       <div>
        <button 
            onClick={
                user && course?.studentEnrolled.includes(user._id) ? 
                (()=> navigate("/dashboard/enrolled-courses")) :
                (handleBuyCourse)
            }
        >
            {
                user &&  course?.studentEnrolled.includes(user?._id) ? "Go to Course" :
                "Buy Now"
            }
        </button>
        {
            (!course?.studentEnrolled.includes(user?.id) ) && (
                <button onClick={handleAddToCart}>
                    Add to cart
                </button>
            )
        }
       </div>

       <div>
        <p>
            30-Day Money-Back Guarantee
        </p>
        <p>
            This Course Includes:
        </p>
        <div>
            {
                course?.instructions?.map((item,index) =>{
                    <p key={index}>
                        <span>{item}</span>
                    </p>
                })
            }
        </div>
       </div>

       <div>
        <button onClick={handleShare}>
            Share
        </button>
       </div>


    </div>
  )
}

export default CourseDetailsCard
