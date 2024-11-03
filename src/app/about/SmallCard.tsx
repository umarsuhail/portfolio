import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'
type cardData={
    name:string,
    icon:string,
    description:string
}
export default function SmallCard({name,icon,description}:cardData) {
  return (
    <div className='w-full md:mx-3 mx-auto flex m-3 p-6 items-center border-2 border-gray-200 rounded-md'>
    <Icon icon={icon} fontSize={50} className=''/>
    <div className='flex justify-between items-center'>
    <span className='text-gray-900 mx-2'>{name}</span>
    <span className='text-gray-600 text-sm ml-4'>

    {description}</span>
    </div>
   
    </div>
    // <div className='md:flex items-center justify-center w-full bg-white shadow-xl md:h-36 p-2 rounded-md'>
    // <div className='w-full md:mx-3 mx-auto flex m-3 p-2 items-center border-2 border-gray-200 rounded-md'>
    // <Icon icon="noto-v1:cricket-game" fontSize={50} className=''/>
    // <span className='text-gray-900 mx-2'>Cricket</span>
    // </div>
    // <div className='w-full md:mx-3 mx-auto flex m-3 p-2 items-center border-2 border-gray-200 rounded-md'>
    // <Icon icon="noto-v1:musical-score" fontSize={50} className=''/>
    // <span className='text-gray-900 mx-2'>Music</span>
    // </div>
    // <div className='w-full md:mx-3 mx-auto flex m-3 p-2 items-center border-2 border-gray-200 rounded-md'>
    // <Icon icon="logos:google-photos" fontSize={50} className=''/>
    // <span className='text-gray-900 mx-2'>Photography</span>
    // </div>
    // </div>
  )
}
