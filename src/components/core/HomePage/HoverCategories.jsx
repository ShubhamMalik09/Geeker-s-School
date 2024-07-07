import React from 'react'

const HoverCategories = () => {
  return (
    <div>
        <div className="all">
            <div className="lefter hidden lg:flex">
                <div className="text">Hosting</div>
            </div>
            <div className="left hidden md:flex">
                <div className="text">Web Design</div>
            </div>
            <div className="center">
                <div className="explainer"><span>Categories</span></div>
                <div className="text">Frontend Development</div>
            </div>
            <div className="right hidden md:flex">
                <div className="text">Backend Development</div>
            </div>
            <div className="righter">
                <div className="text">Many More...</div>
            </div>
        </div>
        
    </div>
  )
}

export default HoverCategories
