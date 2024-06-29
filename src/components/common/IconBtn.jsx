import React from 'react'

const IconBtn = ({
    text,
    onClick,
    children,
    disabled,
    outline=false,
    custonClasses,
    type
}) => {
  return (
    <button disabled={disabled} onClick={onclick} type={type}>
        {
            children ? (
                <>
                    <span>
                        {text}
                    </span>
                </>
            ):(text)
        }
    </button>
  )
}

export default IconBtn
