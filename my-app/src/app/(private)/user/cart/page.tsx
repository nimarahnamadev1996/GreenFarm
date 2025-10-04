import { getCurrentUserFromSupabase } from '@/actions/users'
import React from 'react'

const UserCartPage = async() => {

  const user = await getCurrentUserFromSupabase()

  return (
    <div>
      <h1>UserCartPage</h1>
      <h2>Email:{user?.data?.email}</h2>
      <h4>Name: {user?.data?.name}</h4>
    </div>
  )
}

export default UserCartPage