'use client'

import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import toast from 'react-hot-toast'


import { getCurrentUserFromSupabase } from '@/actions/users'
import usersGlobalStore, { IUsersGlobalStore } from '@/global-store/users-store'
import Header from './components/header'
import Spinner from '@/components/ui/spinner'



const PrivateLayout = ({ children }: { children: React.ReactNode }) => {

    const [loading, setLoading] = useState<boolean>(false)

    const {user,setUser} = usersGlobalStore() as IUsersGlobalStore

    const pathname = usePathname()


    const fetchUser = async() => {

     try{

        setLoading(true)

        const response = await getCurrentUserFromSupabase()

        if(!response.success){
           toast.error("An error occurred while fetching user");
        }else{
          setUser(response.data)
        }

     }catch (error) {
       toast.error("An error occurred while fetching user");
     } finally {
       setLoading(false);
     }

    }


    useEffect(() => {
      if(!user){
        fetchUser()
      }
    },[])


    if(loading){
        return <Spinner/>
    }

    

  return (
    <div>
        <Header user={user!}/>
        <div className="p-5">{children}</div>
    </div>
  )
}

export default PrivateLayout