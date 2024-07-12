import React from 'react'
import toast from 'react-hot-toast';
import { apiConnector } from '../apiconnector';
import { catalogData } from '../api';

export const getCatalogPageData = async(categoryId) => {
  const toastId = toast.loading("Loading...")
  let result =[];
  try{
    const response = await apiConnector("POST",catalogData.CATALOGPAGEDATA_API, {catalogId:categoryId});
    console.log('category response', response)
    if(response?.data?.data?.success){
        throw new Error("Could not fetch Category page data")
    }

    result = response?.data;
  } catch(error){
    console.log("catalog page data api error",error)
    toast.error(error.message)
    result = error.response?.data;
  }
  toast.dismiss(toastId);
  return result;
}

