import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const CourseCard = ({course,Height }) => {
    const [avgReviewCount, setAvgReviewCount] = useState(0);

    useEffect(()=>{
        const count = GetAvgRating(course.ratingAndReviews);
        setAvgReviewCount(count);
    },[course])
  return (
    <div>
      <Link to={`/courses/${course._id}`}>
        <div>
            <div>
                <img src={`${course?.thumbnail} `} className={`${Height} w-full rounded-xl object-cover`} />
            </div>
            <div>
                <p>{course?.courseName}</p>
                <p>{course?.instructor?.firstName} {course?.instructor?.lastName}</p>
                <div>
                    <span>{avgReviewCount || 0}</span>
                    <RatingStars ReviewCount={avgReviewCount}/>
                    <span>{course?.ratingAndReviews?.length} Ratings</span>
                </div>
                <p>{course?.price}</p>
            </div>
        </div>
      </Link>
    </div>
  )
}

export default CourseCard
