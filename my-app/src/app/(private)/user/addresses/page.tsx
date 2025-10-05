'use client'

import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'


import { getAddressesByUserId } from '@/actions/addresses'
import { Button } from '@/components/ui/button'
import PageTitle from '@/components/ui/page-title'
import usersGlobalStore, { IUsersGlobalStore } from '@/global-store/users-store'
import Spinner from '@/components/ui/spinner'
import { IAddress } from '@/interfaces'
import AddressForm from './_components/address-form'


const UserAddressesPage = () => {

  const [openAddressForm, setOpenAddressForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [addresses = [], setAddresses] = useState([])


   const { user } = usersGlobalStore() as IUsersGlobalStore;


   const fetchData = async() => {

    try{

        setLoading(true)

        const response : any = await getAddressesByUserId(user.id)

        if(response.success){
            setAddresses(response.data)
        }else {
         throw new Error(response.message);
        }

    }catch (error) {
      toast.error("Failed to fetch addresses");
    } finally {
      setLoading(false);
    }

   }


   useEffect(() => {
      fetchData() 
   },[])


   const renderAddressProperty = (label: string, value: any) => (
    <div className="flex flex-col">
      <div className="text-xs text-gray-500 font-semibold">{label}</div>
      <div className="text-sm font-semibold">{value}</div>
    </div>
  );

  return (
    <div>

        <div className="flex justify-between items-center">
            <PageTitle title="Addresses" /> 
            <Button onClick={() => setOpenAddressForm(true)}>Add Address</Button>
        </div>

          {loading && <Spinner height={120} />}

          {!loading && addresses.length === 0 && (
           <div>
            You do not have any addresses saved. Click on the "Add Address" button
            to add a new address.
          </div>
         )}


          <div className="flex flex-col gap-5 mt-7">
        {addresses.map((address: IAddress) => (
          <div
            key={address.id}
            className="p-5 border border-gray-300 rounded grid lg:grid-cols-3 gap-7"
          >
            {renderAddressProperty("Name", address.name)}
            {renderAddressProperty("Email", address.email)}
            {renderAddressProperty("Phone Number", address.phone_number)}
            {renderAddressProperty("City", address.city)}
            {renderAddressProperty("State", address.state)}
            {renderAddressProperty("Postal Code", address.postal_code)}

            <div className="col-span-3">
              {renderAddressProperty("Address", address.address)}
            </div>
          </div>
        ))}
      </div>

      {
        openAddressForm && (
            <AddressForm
               openAddressForm={openAddressForm}
               setOpenAddressForm={setOpenAddressForm}
               onSave={fetchData}/>
        )
      }

    </div>
  )
}

export default UserAddressesPage