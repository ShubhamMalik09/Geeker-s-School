import React from 'react'
import {Swiper, SwiperSlide} from "swiper/react"
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
import {Autoplay, FreeMode, Navigation, Pagination} from "swiper"
import ReactStars from 'react-stars'
import {ratingEndpoints} from "../../services/api"


const ReviewSlider = () => {

    const [reviews, setReviews] = useState([]);
    const truncateWords = 15; 


    useEffect(() =>{
        const fetchAllReviews = async() =>{
            const {data} = await apiConnector("GEt", ratingEndpoints.REVIEWS_DETAILS_API);
            if(data?.success){
                setReviews(data?.data);
            }
        }
        fetchAllReviews();
    },[])
  return (
    <div>
      <div>
        <Swiper
            slidesPerView={4}
            spaceBetween={24}
            loop={true}
            freeMode={true}
            autoplay={{
                delay:2500,
            }}
            modules={[FreeMode, Pagination, Autoplay]}
        >
            {
                reviews.map((review,index) =>(
                    <SwiperSlide key={index}>
                        <img src={review?.user?.image ? review?.user?.image: ``} />
                        <p>{review?.user?.firstName}{review?.user?.lastName}</p>
                        <p>{review?.course?.courseName}</p>
                        <p>{review?.review}</p>
                        <p>{review?.rating.toFixed(1)}</p>
                        <ReactStars
                            count={5}
                            value={review?.rating}
                            size={28}
                            edit={false}
                            activeColor={"#ffd700"}
                        />
                    </SwiperSlide>
                ))
            }
        </Swiper>
      </div>
    </div>
  )
}

export default ReviewSlider
 