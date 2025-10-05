import { Button } from '@/components/ui/button'
import PageTitle from '@/components/ui/page-title'
import usersGlobalStore, { IUsersGlobalStore } from '@/global-store/users-store'
import React, { useState } from 'react'

const UserAddressesPage = () => {

  const [openAddressForm, setOpenAddressForm] = useState(false)
  const [loading, setLoading] = useState(false)


   const { user } = usersGlobalStore() as IUsersGlobalStore;

  return (
    <div>

        <div className="flex justify-between items-center">
            <PageTitle title="Addresses" /> 
            <Button onClick={() => setOpenAddressForm(true)}>Add Address</Button>
        </div>
    </div>
  )
}

export default UserAddressesPage