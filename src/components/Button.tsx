import React, { FC, MouseEventHandler, ReactNode } from 'react'

interface ButtonProps {
  onClick?: MouseEventHandler<HTMLButtonElement>
  children: ReactNode,
  primary?: boolean
  secondary?: boolean
}
const Button: FC<ButtonProps> = ({ onClick, children }) => {
  return (
    <button onClick={onClick} className='p-3 bg-violet-400 rounded-lg outline-none text-white'>
      {children}
    </button>
  )
}

export default Button