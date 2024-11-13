'use client'
import { Icon } from '@iconify/react/dist/iconify.js'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function BackButton() {
  const router = useRouter()

  return (
         <button className="flex mx-3 hover:text-yellow-300 items-center " onClick={router.back}>
        <Icon icon="akar-icons:arrow-back" className="hover:text-yellow-300 mx-4"></Icon> go back
      </button>
  )
}
