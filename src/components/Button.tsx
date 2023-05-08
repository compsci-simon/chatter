import React, { FC, MouseEventHandler, ReactNode } from 'react'

interface ButtonProps {
  onClick?: MouseEventHandler<HTMLButtonElement>
  children: ReactNode
}
const Button: FC<ButtonProps> = ({ onClick, children }) => {
  return (
    <button onClick={onClick} className='border border-violet-300 p-3 bg-gradient-to-b from-blue-600 to-violet-400 rounded-lg text-white'>
      {children}
    </button>
  )
}

export default Button