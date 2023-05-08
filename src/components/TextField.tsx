import React, { ChangeEventHandler, FC } from 'react';

interface TextFieldProps {
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}

const TextField: FC<TextFieldProps> = ({ value, onChange }) => {
  return (
    <input type='text' value={value} onChange={onChange} placeholder='Your name' className='p-2 outline-violet-500 rounded-md text-lg font-light border border-slate-100' />
  )
}

export default TextField