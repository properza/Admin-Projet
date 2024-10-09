import { themeChange } from 'theme-change'
import React, {  useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import BellIcon  from '@heroicons/react/24/outline/BellIcon'
import Bars3Icon  from '@heroicons/react/24/outline/Bars3Icon'
import MoonIcon from '@heroicons/react/24/outline/MoonIcon'
import SunIcon from '@heroicons/react/24/outline/SunIcon'
import { openRightDrawer } from '../features/common/rightDrawerSlice';
import { RIGHT_DRAWER_TYPES } from '../utils/globalConstantUtil'

import { NavLink,  Routes, Link , useLocation} from 'react-router-dom'


function Header(){

    const dispatch = useDispatch()
    const {noOfNotifications, pageTitle} = useSelector(state => state.header)
    const [currentTheme, setCurrentTheme] = useState(localStorage.getItem("theme"))

    useEffect(() => {
        themeChange(false)
        if(currentTheme === null){
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ) {
                setCurrentTheme("dark")
            }else{
                setCurrentTheme("light")
            }
        }
        // 👆 false parameter is required for react project
      }, [])


    // Opening right sidebar for notification
    const openNotification = () => {
        dispatch(openRightDrawer({header : "Notifications", bodyType : RIGHT_DRAWER_TYPES.NOTIFICATION}))
    }

    return(
        <>
            <div className="navbar sticky bg-black top-0  z-10 shadow-md ">
                <div className="flex-1">
                    <h1 className="text-2xl text-white font-semibold ml-2">{pageTitle}</h1>
                </div>

            </div>

        </>
    )
}

export default Header