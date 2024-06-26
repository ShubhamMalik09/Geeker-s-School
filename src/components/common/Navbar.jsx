import React, { useEffect, useState } from 'react'
import { Link, matchPath } from 'react-router-dom'
import logo from "../../assets/Logo/Logo-Small.png"
import {NavbarLinks} from "../../data/navbar-links"
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { AiOutlineShoppingCart } from 'react-icons/ai'
import ProfileDropDown from '../core/Auth/ProfileDropDown'
import { apiConnector } from '../../services/apiconnector'
import { categories } from '../../services/api'
import { IoIosArrowDropdown } from 'react-icons/io'

const Navbar = () => {
    const {token} = useSelector((state) => state.auth);
    const {user} = useSelector((state) => state.profile);
    const {totalItems} = useSelector((state) => state.cart);
    const location = useLocation();

    // const [subLinks,setSubLinks] = useState([]);

    // const fetchSubLinks = async() =>{
    //     try{
    //         const result = await apiConnector("GET",categories.CATEGORIES_API);
    //         setSubLinks(result.data.data);
    //     } catch(err){
    //         console.log("could not fetch the category list")
    //     }
    // }

    // useEffect(()=> {
    //     fetchSubLinks();
    // }, [])
    const subLinks =[
        {
            title:"Python",
            link:"/cateogries/python",
        },
        {
            title:"webdev",
            link:"/cateogries/webdev",
        },

    ]

    const matchRoute = (route) =>{

        return matchPath({path:route}, location.pathname);
    }
  return (
    <div className='flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700'>
      <div className='flex w-11/12 max-w-maxContent items-center justify-between'>
        <Link to="/">
            <div className='flex flex-row items-center justify-center'>
                <img src={logo} className='w-[75px]'/>
                <span className='text-xl text-richblack-5 font-bold'>Geeker's School</span>
            </div>
        </Link>

        <nav>
            <ul className='flex gap-x-6 text-richblack-25'>
            {
                NavbarLinks.map((link,index) =>(
                    <li key={index}>
                        {
                            link.title === "Catalog" ? (
                                <div className='relative flex items-center gap-2 group'>
                                    <p>{link.title}</p>
                                    <IoIosArrowDropdown/>

                                    <div className='invisible absolute translate-x-[-50%] translate-y-[80%] left-[50%] top-[50%] flex flex-col rounded-md bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 w-[300px]'>
                                        <div className='absolute left-[50%] top-0 h-6 w-6 rotate-45 rounded bg-richblack-5 translate-x-[80%] translate-y-[-45%]'></div>
                                        {
                                            subLinks.length ? (
                                                     subLinks.map((subLink,index) => (
                                                        <Link to={`${subLink.link}`} key={index}>
                                                            <p>{subLink.title}</p>
                                
                                                        </Link>

                                                     ))
                                            ): (<div></div>)
                                        }
                
                                    </div>
                                </div>
                            ) : (
                                <Link to={link?.path}>
                                    <p className={`${ matchRoute(link?.path) ? "text-yellow-25": " text-richblack-25"}`}>
                                        {link.title}
                                    </p>
                                </Link>
                            )
                        }
                    </li>
                ))
            }
            </ul>
        </nav>

        <div className='flex gap-4 items-center'>
            {
                user && user?.accountType != "Instructor" && (
                    <Link to="/dasboard/cart" className='relative '>
                        <AiOutlineShoppingCart/>
                        {
                            totalItems>0 && (
                                <span>
                                    {totalItems}
                                </span>
                            )
                        }
                    </Link>
                )
            }

            {
                token ===null && (
                    <Link to="/login">
                        <button className='border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md'>
                            Log in
                        </button>
                    </Link>
                )
            }
            {
                token ===null && (
                    <Link to="/signup">
                        <button className='border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md'>
                            Sign Up
                        </button>
                    </Link>
                )
            }

            {
                token !== null && <ProfileDropDown/>
            }
        </div>
      </div>
    </div>
  )
}

export default Navbar
