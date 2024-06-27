import React from 'react'
import HighlightText from '../HomePage/HighlightText';
import CTAButton from "../HomePage/Button"

const LearningGridArray =[
    {
        order:-1,
        heading:"World-Class Learning for",
        highlightedText: "Anyone, Anywhere",
        description:"Geeker's School partners with more than 275+ leading universities and companies to bring flexible, affordable, job-relevant online learning to individuals and organisations worldwide.",
        BtnText:"Learn more",
        BtnLink :"/",
    },
    {
        order:1,
        heading:"Curriculum Based on INdustry needs",
        description:"Save time and money! The Belajar curriculum is made to be easier to understand and in line with industry needs.",
    },
    {
        order:2,
        heading:"Our Learning Methods",
        description:"Geeker's School partners with more than 275+ leading universities and companies to bring",
    },
    {
        order:3,
        heading:"Certification",
        description:"Geeker's School partners with more than 275+ leading universities and companies to bring",
    },
    {
        order:4,
        heading:"Rating 'Auto-grading'",
        description:"Geeker's School partners with more than 275+ leading universities and companies to bring",
    },
    {
        order:5,
        heading:"Ready to work",
        description:"Geeker's School partners with more than 275+ leading universities and companies to bring.",
    },
];

const LearningGrid = () => {
  return (
    <div className='grid mx-auto grid-cols-1 lg:grid-cols-4 mb-10'>
      {
        LearningGridArray.map((card,index) =>(
            <div className={`${card.order===-1 && "lg:col-span-2"} ${card.order %2===1 ?"bg-richblack-700" :"bg-richblack-800"} ${card.order===3 && "lg:col-start-2"} `} key={index}>
                {
                    card.order<0 ? (
                        <div className='bg-transparent'>
                            <div>
                                {card.heading}
                                <HighlightText text={card.highlightedText}/>
                            </div>
                            <p>{card.description}</p>
                            <div>
                                <CTAButton active={true} linkto={card.BtnLink}>{card.BtnText}</CTAButton>
                            </div>
                        </div>
                    ): (
                    <div>
                        <h1>{card.heading}</h1>
                        <p>{card.description}</p>
                    </div>
                    )
                }
            </div>
        ))
      }
    </div>
  )
}

export default LearningGrid
