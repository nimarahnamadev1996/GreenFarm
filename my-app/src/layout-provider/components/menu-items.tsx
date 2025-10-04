import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import usersGlobalStore, { IUsersGlobalStore } from '@/global-store/users-store';
import { useAuth } from '@clerk/nextjs';
import { Gem, LayoutDashboardIcon, List, Map, ShoppingBag, ShoppingCart, User2 } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import React, { useMemo, useState } from 'react'
import toast from 'react-hot-toast';


interface IMenuItems {
  openMenuItems: boolean;
  setOpenMenuItems: React.Dispatch<React.SetStateAction<boolean>>;
}


const MenuItems = ({ openMenuItems, setOpenMenuItems }: IMenuItems) => {

  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState('user')

  const { user } = usersGlobalStore() as IUsersGlobalStore;

  const pathname = usePathname();
  const router = useRouter();

  const iconSize = 16;

   const { signOut } = useAuth();

  const onSignOut = async () => {
    try {
      setLoading(true);
      await signOut();
      toast.success("Signed out successfully");
      router.push("/");
    } catch (error) {
      toast.error("Failed to sign out");
    } finally {
      setLoading(false);
    }
  };


  const userMenuItems = [
    {
      name: "Shop",
      route: "/user/shop",
      icon: <ShoppingBag size={iconSize} />,
    },
    {
      name: "Cart",
      route: "/user/cart",
      icon: <ShoppingCart size={iconSize} />,
    },
    {
      name: "Orders",
      route: "/user/orders",
      icon: <List size={iconSize} />,
    },
    {
      name: "Addresses",
      route: "/user/addresses",
      icon: <Map size={iconSize} />,
    },
    {
      name: "Profile",
      route: "/user/profile",
      icon: <User2 size={iconSize} />,
    },
  ];

  const sellerMenuItems = [
    {
      name: "Products",
      route: "/seller/products",
      icon: <ShoppingBag size={iconSize} />,
    },
    {
      name: "Orders",
      route: "/seller/orders",
      icon: <List size={iconSize} />,
    },
  ];

  const adminMenuItems = [
    {
      name: "Dashboard",
      route: "/admin/dashboard",
      icon: <LayoutDashboardIcon size={iconSize} />,
    },
    {
      name: "Orders",
      route: "/admin/orders",
      icon: <List size={iconSize} />,
    },
    {
      name: "Users",
      route: "/admin/users",
      icon: <User2 size={iconSize} />,
    },
    {
      name: "Sellers",
      route: "/admin/sellers",
      icon: <Gem size={iconSize} />,
    },
  ];


  let userRoles = [
    {
      name: "User",
      value: "user",
    },
    {
      name: "Seller",
      value: "seller",
    },
    {
      name: "Admin",
      value: "admin",
    },
  ];

  if(!user.is_seller){
     userRoles = userRoles.filter((role) => role.value !== 'seller')
  }

  if(!user.is_admin){
    userRoles = userRoles.filter((role) => role.value !== 'admin')
  }


   let menuItemsToRender = useMemo(() => {

    if(selectedRole === 'user'){
        return userMenuItems
    }else if(selectedRole === 'admin'){
        return adminMenuItems
    }else{
        return sellerMenuItems
    }

   },[selectedRole])

  return (
    <Sheet open={openMenuItems} onOpenChange={setOpenMenuItems}>

        <SheetContent>
          <SheetHeader>
            <SheetTitle className='text-sm mt-7'>
                Welcome {user.name}
            </SheetTitle>
          </SheetHeader>

          {
            userRoles.length > 1 && (
                <div  className="flex flex-col gap-6 mt-10">
                    <h3 className="text-sm md:font-semibold text-gray-500">Select Role</h3>

                    <RadioGroup
                      defaultValue={selectedRole}
                      onValueChange={(value) => setSelectedRole(value as string)}
                      className="flex flex-row gap-2 md:gap-5">
                       {
                        userRoles.map((role,index) => (
                         <div className="flex items-center space-x-1 md:space-x-2" key={index}>
                            <RadioGroupItem value={role.value} id={role.value}/>
                            <Label htmlFor="r1">{role.name}</Label>
                         </div>
                        ))
                       }
                    </RadioGroup>
                </div>
            )
          }

        <div className="flex flex-col gap-6 mt-10">
          {menuItemsToRender.map((item, index) => (
            <div
              className={`flex gap-5 p-3 rounded-md cursor-pointer items-center
             ${ pathname === item.route
                 ? "bg-gray-100 border border-gray-500 text-primary" : ""}`}
              key={index}
              onClick={() => {
                router.push(item.route);
                setOpenMenuItems(false);
              }}
            >
              {item.icon}
              <span className="text-sm">{item.name}</span>
            </div>
          ))}

          <Button onClick={onSignOut} disabled={loading}>
            Sign Out
          </Button>
        </div>
        </SheetContent>
    </Sheet>
  )
}

export default MenuItems