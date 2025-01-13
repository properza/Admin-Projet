import routes from '../routes/sidebar'
import React, { useState, useEffect } from 'react';
import { NavLink, Routes, Link, useLocation } from 'react-router-dom'
import SidebarSubmenu from './SidebarSubmenu';
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentUser, logoutUser } from '../components/common/userSlice';
import './LeftSidebar.css';

function LeftSidebar() {
    const location = useLocation();
    const dispatch = useDispatch();
    const currentUser = useSelector(state => state.user.currentUser);

    useEffect(() => {
        dispatch(fetchCurrentUser())
    }, [dispatch])


    const close = (e) => {
        document.getElementById('left-sidebar-drawer').click()
    }

    function logoutUser() {
        localStorage.removeItem('userToken');
        window.location.href = '/'
    }

    const roleSelect = currentUser?.role === 'super_admin' ? 'สูงสุด'
        : currentUser?.role === 'normal' ? 'ทั่วไป'
            : currentUser?.role === 'special' ? 'กยศ.'
                : null

    return (
        <div className="drawer-side  z-30  ">
            <label htmlFor="left-sidebar-drawer" className="drawer-overlay"></label>
            <ul className="menu  pt-2 w-80 bg-base-100 min-h-full   text-base-content">
                <button className="btn btn-ghost bg-base-300  btn-circle z-50 top-0 right-0 mt-4 mr-2 absolute lg:hidden" onClick={() => close()}>
                    <XMarkIcon className="h-5 inline-block w-5" />
                </button>
                <div className="grid gap-3 border-b border-b-black pb-2 justify-center items-center gap-x-6">
                    <img className="h-26 w-26 rounded-full" src="https://via.placeholder.com/100" alt="" />
                    {/*  */}
                    <p className='text-center text-[1rem] font-semibold'>แอดมิน ( {roleSelect} )</p>
                </div>
                {
                    routes.map((route, k) => {
                        if (route.onlySuperAdmin && currentUser?.role !== 'super_admin') {
                            return null
                        }

                        return route.path !== '' ? (
                            <li key={k}>
                                <NavLink
                                    to={route.path}
                                    className={({ isActive }) =>
                                        `font-normal flex items-center ${isActive ? 'active' : 'font-semibold stroke-[#7B7B7B]'} text-gray-900`
                                    }
                                >
                                    {route.icon}
                                    {route.name}
                                </NavLink>
                            </li>
                        ) : (
                            <li key={k} className="flex p-[1rem] font-semibold stroke-[#7B7B7B] text-gray-900">
                                {route.icon}
                                {route.name}
                            </li>
                        )
                    })
                }
                <li className='mt-auto'>
                    <button className="flex font-semibold stroke-[#7B7B7B] text-gray-900 hover:bg-red-200" onClick={logoutUser}>
                        <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6">
                            <path d="M12.3474 3.64036L12.3473 3.64041L12.3534 3.64655L15.3534 6.6465C15.3534 6.64652 15.3534 6.64654 15.3534 6.64655C15.4471 6.74031 15.4998 6.86744 15.4998 7C15.4998 7.13256 15.4471 7.25969 15.3534 7.35345C15.3534 7.35346 15.3534 7.35348 15.3534 7.3535L12.357 10.3499C12.263 10.4394 12.1378 10.4888 12.0079 10.4877C11.8768 10.4866 11.7514 10.434 11.6587 10.3413C11.566 10.2486 11.5134 10.1232 11.5123 9.99206C11.5112 9.86217 11.5606 9.73699 11.6501 9.64297L12.9396 8.35355L13.7931 7.5H12.586H5C4.86739 7.5 4.74022 7.44732 4.64645 7.35355C4.55268 7.25978 4.5 7.13261 4.5 7C4.5 6.86739 4.55268 6.74022 4.64645 6.64645C4.74022 6.55268 4.86739 6.5 5 6.5H12.586H13.7931L12.9396 5.64645L11.6466 4.35345L11.6466 4.35339L11.6404 4.34736C11.5926 4.30123 11.5545 4.24606 11.5283 4.18506C11.5021 4.12406 11.4883 4.05845 11.4877 3.99206C11.4872 3.92567 11.4998 3.85983 11.5249 3.79838C11.5501 3.73693 11.5872 3.6811 11.6342 3.63416C11.6811 3.58721 11.7369 3.55008 11.7984 3.52494C11.8598 3.4998 11.9257 3.48715 11.9921 3.48773C12.0584 3.48831 12.1241 3.5021 12.1851 3.52831C12.2461 3.55451 12.3012 3.5926 12.3474 3.64036ZM0.646447 0.646447C0.740215 0.552678 0.867392 0.5 1 0.5C1.13261 0.5 1.25979 0.552678 1.35355 0.646447C1.44732 0.740215 1.5 0.867392 1.5 1V13C1.5 13.1326 1.44732 13.2598 1.35355 13.3536C1.25979 13.4473 1.13261 13.5 1 13.5C0.867391 13.5 0.740214 13.4473 0.646446 13.3536C0.552679 13.2598 0.5 13.1326 0.5 13V1C0.5 0.867392 0.552678 0.740215 0.646447 0.646447Z" fill="#232325" stroke="#7B7B7B" />
                        </svg>
                        ออกจากระบบ
                    </button>
                </li>
            </ul>
        </div>
    )
}

export default LeftSidebar