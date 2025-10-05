import { getAllProducts } from '@/actions/products'
import PageTitle from '@/components/ui/page-title';
import { IProduct } from '@/interfaces';
import React from 'react'
import ProductTile from './_components/product-tile';

const UserShopPage = async() => {

  const response: any = await getAllProducts({
    category: '',
    searchText: '',
    sortBy: ''
  })

  if (!response.success) {
    return <div>{response.message}</div>;
  }

  return (
    <div className='flex flex-col gap-5'>

        <PageTitle title="Shop Products" />

         {/* <Filters/> */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {
           response.data.map((product: IProduct) => (
            <ProductTile product={product} key={product.id}/>
           )) 
          }
        </div>
    </div>
  )
}

export default UserShopPage