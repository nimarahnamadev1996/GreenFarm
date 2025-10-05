'use client'

import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from 'next/navigation'



import PageTitle from '@/components/ui/page-title'
import { getAddressesByUserId } from '@/actions/addresses'
import usersGlobalStore, { IUsersGlobalStore } from '@/global-store/users-store'
import productsCartStore, { IProductsCartStore } from '@/global-store/products-cart-store'
import { IAddress } from '@/interfaces'
import { Button } from '@/components/ui/button'
import AddressForm from '../addresses/_components/address-form'
import { getStripePaymentIntentToken } from '@/actions/payments'
import CheckoutForm from './_components/checkout-form';


const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);


const UserCheckoutPage = () => {

   const [loading, setLoading] = useState(false)
   const [addresses, setAddresses] = useState([])
   const [selectedAddress, setSelectedAddress] = useState<IAddress | null>(null)
   const [openAddressForm, setOpenAddressForm] = useState(false);
   const [paymentIntentToken, setPaymentIntentToken] = useState("");
   const [openCheckoutForm, setOpenCheckoutForm] = useState(false);


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


   
  const onCheckout = async () => {
    try {
      setLoading(true);
      const response = await getStripePaymentIntentToken(total);
      if (!response.success) {
        console.log(response);
        toast.error("Failed to checkout");
        return;
      }
      setPaymentIntentToken(response.data);
      console.log(response.data);
      
      setOpenCheckoutForm(true);
    } catch (error) {
      toast.error("Failed to checkout");
    } finally {
      setLoading(false);
    }
  };


  const onPaymentSuccess = async (paymentId: string) => {

  }

    const options = {
    // passing the client secret obtained from the server
    clientSecret: paymentIntentToken,
  };
  

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
        <Button disabled={!selectedAddress || loading} onClick={onCheckout}>
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


      
      {openCheckoutForm && (
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm
            openCheckoutForm={openCheckoutForm}
            setOpenCheckoutForm={setOpenCheckoutForm}
            onPaymentSuccess={onPaymentSuccess}
          />
        </Elements>
      )}

    </div>
  )
}

export default UserCheckoutPage