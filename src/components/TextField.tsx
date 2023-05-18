import React, { FC, InputHTMLAttributes, KeyboardEvent } from 'react';

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  submithandler?: () => void
}

const TextField: FC<TextFieldProps> = ({ submithandler, ...rest }) => {

  const keypress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && submithandler) {
      submithandler()
    }
  }
  return (
    <input {...rest} onKeyDown={keypress} className='p-2 outline-violet-500 rounded-md text-lg font-light border border-slate-100 w-full' />
  )
}

export default TextField