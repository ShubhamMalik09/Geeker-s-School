import React from 'react'
import HighlightText from '../components/core/HomePage/HighlightText'
import BannerImage1 from "../assets/Images/aboutus1.webp"
import BannerImage2 from "../assets/Images/aboutus2.webp"
import BannerImage3 from "../assets/Images/aboutus3.webp"
import Quote from '../components/core/AboutPage/Quote'
import FoundingStory from "../assets/Images/FoundingStory.png"
import StatsComponent from '../components/core/AboutPage/StatsComponent'
import LearningGrid from '../components/core/AboutPage/LearningGrid'
import ContactFormSection from '../components/core/AboutPage/ContactFormSection'

const About = () => {
  return (
    <div className=' text-white'>
      {/* section 1 */}
      <section>
        <div>
            <header>
                Driving Innovation in Online Education for a 
                <HighlightText text={"Brighter Future "}/> 

                <p>Geeker's School is at the forefront of driving innovation in online education. We're passionate about creating a brghter future by offering cutting-edge courses, leaveraging emerging technologies, and nurturing a vibrant learning community.</p>
            </header>

            <div className='flex gap-3 mx-auto'>
                <img src={BannerImage1}/>
                <img src={BannerImage2}/>
                <img src={BannerImage3}/>
            </div>

        </div>
      </section>

      {/* section 2 */}
      <section>
        <div>
            <Quote/>
        </div>
      </section>

      {/* section 3 */}
      <section>
        <div className='flex flex-col'>
            <div className='flex'>
                <div>
                    <h1>Our Founding Story</h1>
                    <p>Our e-learning platform was born out of a shared vision and passion for transforming education. It all begin with a group of educators, technologists, and lifelong learners who recognized the need for accessible, flexible and high-quality learning opportunities in a rapidly evolving digital world.</p>
                    <p></p>
                </div>
                <div>
                  <img src={FoundingStory}  />
                </div>
            </div>

            <div>
              <div>
                <h1>Our Vision</h1>
                <p>With this vision in mind, we set out on a journey to create an e-learning platform that would revolutionize the way people learn. Our teaam of dedicated experts worked tirelessly to develop a robust and intutive platform that combines cutting-edge technology with engaging context, fostering a dynamic and interactive learning experience.</p>
              </div>

              <div>
                <h1>Our Mission</h1>
                <p>Our Mission goes beyond just delivering courses online. We wanted to create a vibrant community of learners, where individuals can connect, collaborate, and learn from one another. We believe that knowledge thrives in an environment of sharing and dialogue, and we foster this spirit of collaboration through forms, live sessions, and networking opportunities</p>
              </div>

            </div>
        </div>
      </section>


      {/* section 4 */}
      <section>
      `<StatsComponent/>
      </section>

      {/* section 5 */}
      <section>
        <LearningGrid/>
      </section>

      {/* section 6 */}
      <section>
        <ContactFormSection/>
      </section>

    </div>
  )
}

export default About
