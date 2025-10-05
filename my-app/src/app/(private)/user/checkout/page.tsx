'use client'

import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'



import PageTitle from '@/components/ui/page-title'
import { getAddressesByUserId } from '@/actions/addresses'
import usersGlobalStore, { IUsersGlobalStore } from '@/global-store/users-store'
import productsCartStore, { IProductsCartStore } from '@/global-store/products-cart-store'
import { IAddress } from '@/interfaces'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import AddressForm from '../addresses/_components/address-form'


const UserCheckoutPage = () => {

   const [loading, setLoading] = useState(false)
   const [addresses, setAddresses] = useState([])
   const [selectedAddress, setSelectedAddress] = useState<IAddress | null>(null)
   const [openAddressForm, setOpenAddressForm] = useState(false);



   const router = useRouter()

   const { user } = usersGlobalStore() as IUsersGlobalStore
   const { items , clearCart} = productsCartStore() as IProductsCartStore;

  const fetchAddresses = async () => {
    try{

     const response: any = await getAddressesByUserId(user.id)

     if (!response.success) {
        toast.error("Failed to fetch addresses");
      }else{
        setAddresses(response.data)
      }

    }catch (error) {
      toast.error("Failed to fetch addresses");
    }
  }

  useEffect(() => {
     fetchAddresses()
  },[])


  let total = 0;
  let subTotal = 0;

  items.forEach((item) => subTotal += item.price * item.quantity)

   let deliveryFeeAndTax = subTotal * 0.1

   total = parseFloat((subTotal + deliveryFeeAndTax).toFixed(2));

  

  return (
    <div className="flex flex-col gap-5">

      <PageTitle title="Checkout" />

      <h1 className="text-xl font-bold text-gray-600">
        Amount to pay: ${total.toFixed(2)}
      </h1>

      <div className="flex flex-col gap-5">
         <h1 className="text-sm font-bold">Select an address</h1>

         {
          addresses.map((address: IAddress) => (
            <div
             key={address.id}
             className={`p-5 border border-gray-300 rounded cursor-pointer ${
              selectedAddress?.id === address.id ? "border-primary border-2" : ''}`}
              onClick={() => setSelectedAddress(address)}>
              <h1 className="text-sm font-semibold">
                {address.name} ({address.phone_number}) - {address.email}
              </h1>
              <h1 className="text-sm text-gray-600">
                {address.address}
              </h1>
              <h1 className="text-sm text-gray-600">
                {address.city}, {address.state} {address.postal_code}
              </h1>
            </div>
          ))
         }

         <div className="flex justify-end underline cursor-pointer">
          <h1
            className="text-gray-600 text-sm font-bold"
            onClick={() => setOpenAddressForm(true)}>
            Add new address
          </h1>
        </div>
      </div>

      <div className="flex justify-center items-center gap-5">
        <Button variant={"outline"} onClick={() => router.push("/user/cart")}>
          Back to cart
        </Button>
        <Button disabled={!selectedAddress || loading}>
          Proceed to payment
        </Button>
      </div>


      {
        openAddressForm && (
          <AddressForm
           openAddressForm={openAddressForm}
           setOpenAddressForm={setOpenAddressForm}/>
        )
      }

    </div>
  )
}

export default UserCheckoutPage