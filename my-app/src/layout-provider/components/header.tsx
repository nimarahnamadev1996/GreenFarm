import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Menu } from 'lucide-react';


import { IUser } from '@/interfaces'
import logo from '../../../public/hero.png'
import { Button } from '@/components/ui/button';
import MenuItems from './menu-items';

const Header = ({ user }: { user: IUser }) => {

 const [openMenuItems, setOpenMenuItems] = useState(false);

 const router = useRouter()

  return (
    <div className='bg-primary p-5 flex justify-between items-center'>

        <div className='bg-white rounded-2xl flex items-center'>
            <Image
             src={logo}
             alt='Logo'
             className="w-10 h-10 object-contain md:w-16 md:h-16"/>
        </div>

        <div className="flex items-center gap-5">
            <h1 className="text-sm text-white md:text-md">{user?.name}</h1>

            <Button onClick={() => setOpenMenuItems(true)} size='icon'>
                <Menu className="text-white cursor-pointer" />
            </Button>
        </div>

        {
          openMenuItems && (
            <MenuItems
             openMenuItems={openMenuItems}
             setOpenMenuItems={setOpenMenuItems}/>
          )  
        }
    </div>
  )
}

export default Header