import React from 'react'
import {Swiper, SwiperSlide} from 'swiper/react'
import "swiper/css"
import "swiper/css/free-mode"
import {Autoplay,FreeMode, Navigation ,Pagination} from "swiper"
import CourseCard from './CourseCard'

const CourseSlider = ({Courses}) => {
  return (
    <>
      {
        Courses?.length  ? (
            <Swiper
                slidesPerView={1}
                spaceBetween={25}
                loop={true}
                modules={[Autoplay,Pagination]}
                pagination={true}
                autoplay={{
                    delay:2500,
                    disableOnInteraction:false,
                }}
            >
               {
                Courses?.map((course,index) =>(
                    <SwiperSlide key={index}>
                        <CourseCard course={course} Height={"h-[250px]"}/>
                    </SwiperSlide>
                ))
               }
            </Swiper>
        ) :(
            <p>No Course Found</p>
        )
      }
    </>
  )
}

export default CourseSlider
