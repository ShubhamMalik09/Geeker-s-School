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
                    <span className={`${outline && "text-yellow-50"}`}>
                        {text}
                    </span>
                    {children}
                </>
            ):(text)
        }
    </button>
  )
}

export default IconBtn
