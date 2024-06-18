import React from 'react'

const HoverCategories = () => {
  return (
    <div>
        <div class="all">
            <div class="lefter hidden lg:flex">
                <div class="text">Hosting</div>
            </div>
            <div class="left hidden md:flex">
                <div class="text">Web Design</div>
            </div>
            <div class="center">
                <div class="explainer"><span>Categories</span></div>
                <div class="text">Frontend Development</div>
            </div>
            <div class="right hidden md:flex">
                <div class="text">Backend Development</div>
            </div>
            <div class="righter">
                <div class="text">Many More...</div>
            </div>
        </div>
        
    </div>
  )
}

export default HoverCategories
