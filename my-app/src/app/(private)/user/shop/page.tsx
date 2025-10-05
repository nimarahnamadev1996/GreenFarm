import React from 'react'


import { getAllProducts } from '@/actions/products'
import PageTitle from '@/components/ui/page-title';
import { IProduct } from '@/interfaces';
import ProductTile from './_components/product-tile';
import Filters from './_components/filters';


interface UserShopPageProps {
  searchParams: Promise<{
    category?: string;
    searchText?: string;
    sortBy?: string;
  }>;
}


const UserShopPage = async({searchParams}: UserShopPageProps) => {

  const { category, searchText, sortBy } = await searchParams

  const response: any = await getAllProducts({
    category: category ||'',
    searchText: searchText || '',
    sortBy: sortBy || ''
  })

  if (!response.success) {
    return <div>{response.message}</div>;
  }

  return (
    <div className='flex flex-col gap-5'>

        <PageTitle title="Shop Products" />

         <Filters/>

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