import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom';

const Dashboard = () => {
    const {loading:authLoading} = useSelector((state)=> state.auth);
    const {loading:profileLoading} = useSelector((state)=> state.profile);  

    if(profileLoading || authLoading){
        return (
            <div className='mt-12'>
                Loading....
            </div>
        )
    }
  return (
    <div className='relative flex min-h-[calc(100vh-3.5rem)]'>
      <Siderbar/>
      <div className='h-[calc(100vh-3.5rem)] overflow-auto'>
        <div className='mx-auto w-11/12 max-w-[1080px] py-10'>
            <Outlet/>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
