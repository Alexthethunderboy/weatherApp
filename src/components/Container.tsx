import { cn } from '@/utils/cn';
import React from 'react'

export default function Container(props:React.HTMLProps<HTMLDivElement>) {
  return (
    <div {...props}
     className={cn(
        'w-full bg-black text-gray-100 border border-gray-900 rounded-xl flex md:py-4 shadow-sm', props.className
     )}
     />
  );
}