import React from 'react'
import { useSelector } from 'react-redux'
import IconBtn from '../../../common/IconBtn'

const RenderTotalAmount = () => {
    const {total} = useSelector((state)=> state.cart);

    const handleBuyCourse = () =>{
        const courses = cart.map((course)=> course._id);
        console.log("Bought these courses",courses);
    }
  return (
    <div>
      <p>Total</p>
      <p>Rs{total}</p>

      <IconBtn text={"Buy Now"}
      onClick={handleBuyCourse}
      custonClasses={"w-full justify-center"}/>
    </div>
  )
}

export default RenderTotalAmount
