'use client'
import React from 'react'
import { usePathname } from 'next/navigation'


import PrivateLayout from './private-layout'
import PublicLayout from './public-layout'

const CustomLayout = ({ children }: { children: React.ReactNode }) => {

  const pathname = usePathname()

  const isPrivate = 
  pathname.startsWith('/user') || 
  pathname.startsWith('/admin') || 
  pathname.startsWith('/seller')


  if(isPrivate){
    return <PrivateLayout>{children}</PrivateLayout>
  }else{
    return <PublicLayout>{children}</PublicLayout>
  }
  


  return (
    <div>CustomLayout</div>
  )
}

export default CustomLayout