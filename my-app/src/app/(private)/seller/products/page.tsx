'use client'

import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import dayjs from "dayjs";


import { deleteProductById, getProductsBySellerId } from '@/actions/products'
import { Button } from '@/components/ui/button'
import PageTitle from '@/components/ui/page-title'
import Spinner from '@/components/ui/spinner'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import usersGlobalStore, { IUsersGlobalStore } from '@/global-store/users-store'
import { IProduct } from '@/interfaces'
import { Pencil, Trash2 } from 'lucide-react';

const SellerProductsPage = () => {

   const [loading, setLoading] = useState(true);
   const [products, setProducts] = useState([])


  const { user } = usersGlobalStore() as IUsersGlobalStore;

   const fetchData = async () => {
    try {

      setLoading(true);

      const response: any = await getProductsBySellerId(user.id);

      if (response.success) {
        console.log(response.data);
        setProducts(response.data);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const deleteProductHandler = async (productId: number) => {
    try {
      setLoading(true);

      const response = await deleteProductById(productId);

      if (response.success) {
        toast.success(response.message);
        fetchData();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Failed to delete product");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    "Name",
    "Category",
    "Price",
    "Available Stock",
    "Created At",
    "Actions",
  ];


  return (
    <div>

      <div  className="flex justify-between items-center">
        <PageTitle title="My Products"/>
        <Button size='sm'>
          <Link href="/seller/products/add">Add Product</Link>
        </Button>
      </div>


       {loading && <Spinner height={150} />}

      {!loading && products.length > 0 && (
        <Table className="mt-7">
          <TableHeader className="bg-gray-200">
            <TableRow>
              {columns.map((column, index) => (
                <TableHead className="font-bold" key={index}>
                  {column}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product: IProduct) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>{product.available_stock}</TableCell>
                <TableCell>
                  {dayjs(product.created_at).format("MMMM DD, YYYY hh:mm A")}
                </TableCell>
                <TableCell className="flex gap-5 items-center">
                  <Button
                    size={"icon"}
                    variant={"secondary"}
                    onClick={() => deleteProductHandler(product.id)}
                  >
                    <Trash2 size={14} />
                  </Button>

                  <Button size={"icon"} variant={"secondary"}>
                    <Link href={`/seller/products/edit/${product.id}`}>
                      <Pencil size={14} />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}

export default SellerProductsPage