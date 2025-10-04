'use server'

import supabase from "@/config/supabase-config";
import { currentUser } from "@clerk/nextjs/server";




export const saveClerkUserToSubabase = async(clerkUser: any) => {

    try{

         const supabaseUserObj = {
            name: clerkUser.firstName + " " + clerkUser.lastName,
            email: clerkUser.emailAddresses[0].emailAddress,
            clerk_user_id: clerkUser.id,
            profile_pic: clerkUser.imageUrl || "",
            is_admin: false,
            is_seller: false,
            is_active: true,
         }


      const { data, error } = await supabase
      .from('user_profiles')
      .insert([supabaseUserObj])
      .select('*')
      
      if (error) {
         throw new Error(error.message);
      }

     return {
        success: true,
        data,
     };

    }catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
    
}





export const getCurrentUserFromSupabase = async () => {

    try{

      const clerkUser = await currentUser()

      const {data,error} = await supabase
      .from("user_profiles")
      .select('*')
      .eq('clerk_user_id', clerkUser?.id)

      if(error){
         throw new Error(error.message);
      }

    //   if we have a user in database

      if(data && data.length > 0 ){
        return{
            success: true,
            data: data[0]
        }
      }

    // if we do not have user ====> we must create user and save it  

     const newUserResponse = await saveClerkUserToSubabase(clerkUser)

     if(!newUserResponse.success){
         throw new Error(newUserResponse.message);
     }

     return{
        success: true,
        data: newUserResponse.data
     }


    }catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }

}