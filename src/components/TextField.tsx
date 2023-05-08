import React, { ChangeEventHandler, FC, InputHTMLAttributes } from 'react';

type TextFieldProps = InputHTMLAttributes<HTMLInputElement>

const TextField: FC<TextFieldProps> = (props) => {
  return (
    <input {...props} className='p-2 outline-violet-500 rounded-md text-lg font-light border border-slate-100 w-full' />
  )
}

export default TextField