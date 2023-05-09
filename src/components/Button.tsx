import React, { FC, InputHTMLAttributes } from 'react'

type BottonProps = InputHTMLAttributes<HTMLButtonElement>

const Button: FC<BottonProps> = ({ onClick, children }) => {
  return (
    <button onClick={onClick} className='p-3 bg-violet-400 rounded-lg outline-none text-white'>
      {children}
    </button>
  )
}

export default Button