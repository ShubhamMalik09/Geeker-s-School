import React from 'react'
import { FaArrowRight } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import HighlightText from '../components/core/HomePage/HighlightText'
import HoverCategories from '../components/core/HomePage/HoverCategories'
import CTAButton from '../components/core/HomePage/Button'
import Banner from "../assets/Images/banner.mp4"

const Home = () => {
  return (
    <div >
      {/* section 1 */}
        <div className='relative mx-auto flex flex-col w-11/12 max-w-maxContent items-center text-white justify-between'>
            <Link to={"/signup"}>
                <div className='group mt-16 p-1 mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200 transition-all duration-200 hover:scale-95 w-fit'>
                    <div className='flex flex-row items-center gap-2 rounded-full px-10 py-[5px] transition-all duration-200 group-hover:bg-richblack-900'>
                        <p>Become an instructor</p>
                        <FaArrowRight/>
                    </div>
                    
                </div>
            </Link>

            <div className='text-center text-4xl font-semibold mt-7'>
                Empower Your Future with 
                <HighlightText text={"Coding Skills"}/>
            </div>

            <div className='w-[90%] text-center text-lg font-bold text-richblack-300 '>
                With our coding courses, you can learn at your own pace, form anywhere in the world, and get access to a wealth of resources, including hands-on projectss, quizzes, and personalized feedback from instructors.
            </div>
            <div>
                <HoverCategories/>
            </div>
            <div className='flex flex-row gap-7 mt-8'>
                <CTAButton active={true} linkto={"/signup"}>Learn More</CTAButton>
                <CTAButton active={false} linkto={"/login"}>Book a Demo</CTAButton>
            </div>

            <div className='mx-3 my-15 shadow-blue-200'>1
              <video
              muted
              loop
              autoPlay
              >
                <source src={Banner} type='video/mp4'/>
              </video>
            </div>


        </div>




      {/* section 2 */}
      <div>
        <CodeBlocks/>
      </div>


      {/* section 3 */}



      {/* footer */}
    </div>
  )
}

export default Home
