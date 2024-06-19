import React from 'react'
import CTAButton from "./Button"

const CodeBlocks = ({position,heading,subheading, ctabtn1, ctabtn2, codeblock, backgroundGradient, codeColor}) => {
  return (
    <div className={`flex ${position} my-20 justify-between gap-10`}>
      <div className='w-[50%] flex flex-col gap-8'>
        {heading}
        <div className='text-richblack-300 font-bold '>
            {subheading}
        </div>

        <div className='flex gap-7 mt-7'>
            <CTAButton></CTAButton>
        </div>
      </div>
    </div>
  )
}

export default CodeBlocks
