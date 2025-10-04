'use client'

import React, { useState } from 'react'
import Link from 'next/link';


import { Button } from '@/components/ui/button';
import hero from '../../public/hero.png'
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { SignIn, SignUp } from '@clerk/nextjs';



const HomePage = () => {

  const [openSignInForm, setOpenSignInForm] = useState(false)

  const searchParams = useSearchParams()
  const formType = searchParams.get('formType')

   const menuItems = [
    
    {
      name: "About",
      path: "/about",
    },
    {
      name: "Contact",
      path: "/contact",
    },
  ];


  return (
    <div className='p-5 lg:px-20'>

       {/* --- Navbar ---- */}

      <div className="flex justify-between items-center">

        <h1 className="font-bold text-sm text-primary md:text-xl lg:text-2xl">
          <b>Green Farm</b>
        </h1>

        <div className="flex gap-1 items-center md:gap-5">
          {
           menuItems.map((item) => (
            <Link href={item.path} className="text-sm text-gray-600 font-bold">
               {item.name}
            </Link>
           )) 
          }

          <Button onClick={() => setOpenSignInForm(true)} size='sm'>
            SignIn
          </Button>
        </div>
      </div>


      {/* --- Main page ---- */}

      <div className='mt-10 grid grid-cols-1 md:grid-cols-2 gap-5  items-center'>
        <div  className="col-span-1">
          <div>
            <h1 className=" text-2xl lg:text-4xl font-bold text-primary">
              Green<b className="text-orange-600">Farm</b>
            </h1>
            <p className="text-gray-600 text-sm font-semibold">
               Platform that connects farmers to buyers
              and provides a platform for farmers to sell their produce directly
              to consumers. Here you can find fresh farm produce at affordable
              prices.
            </p>
          </div>
        </div>

        <div className="col-span-1 flex justify-center lg:justify-end">
          <Image
           src={hero}
           alt='Hero'
           className="w-auto h-80 object-contain"/>
        </div>
      </div>


      <Sheet open={openSignInForm} onOpenChange={setOpenSignInForm}>

        <SheetContent className="min-w-[500px] flex justify-center items-center">
            <SheetHeader>
              <SheetTitle></SheetTitle>
            </SheetHeader>

            <div>
              {
               formType === 'signup' ? (
                <SignUp routing="hash" signInUrl="/?formType=signin" />
               ) : (
                 <SignIn routing="hash" signUpUrl="/?formType=signup" />
               )
              }
            </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default HomePage