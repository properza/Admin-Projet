import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import TitleCard2 from "../../components/Cards/TiileCard2"
import { setPageTitle, showNotification } from "../common/headerSlice"



function GettingStarted(){

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Documentation"}))
      }, [])

    const iconBtn = "cursor-pointer hover:bg-gray-300 rounded-md";
    
    return(
        <>
            <TitleCard2 title={'ประเภทกิจกรรม'} title2={'(กยศ.)'} subTitle={'ทั้งหมด 4 รายการ'}>
                <table className='table text-center'>
                    <thead className=''>
                        <tr>
                            <th>No.</th>
                            <th>กิจกรรม</th>
                            <th>วันที่อัปเดตล่าสุด</th>
                            <th>จัดการ</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>ปลูกต้นไม้</td>
                            <td>10 ส.ค. 2024 </td>
                            <td>
                                <div className="flex justify-center gap-5 items-center">
                                    <button>
                                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect width="17" height="17" transform="translate(0.25 0.5)" fill="white" />
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M7.04922 3.89987C6.14748 3.89987 5.28268 4.25808 4.64506 4.89571C4.00743 5.53333 3.64922 6.39813 3.64922 7.29987C3.64922 8.20161 4.00743 9.06641 4.64506 9.70403C5.28268 10.3417 6.14748 10.6999 7.04922 10.6999C7.95095 10.6999 8.81576 10.3417 9.45338 9.70403C10.091 9.06641 10.4492 8.20161 10.4492 7.29987C10.4492 6.39813 10.091 5.53333 9.45338 4.89571C8.81576 4.25808 7.95095 3.89987 7.04922 3.89987ZM1.94922 7.29987C1.94912 6.49722 2.13846 5.70588 2.50186 4.9902C2.86526 4.27453 3.39245 3.65473 4.04056 3.18122C4.68866 2.70771 5.43937 2.39385 6.23164 2.26518C7.02391 2.13651 7.83537 2.19665 8.60001 2.44072C9.36466 2.68479 10.0609 3.10589 10.6321 3.66977C11.2033 4.23366 11.6334 4.9244 11.8873 5.68583C12.1412 6.44726 12.2118 7.25787 12.0934 8.05174C11.975 8.8456 11.6708 9.60031 11.2057 10.2545L15.3002 14.3489C15.455 14.5092 15.5407 14.7239 15.5387 14.9468C15.5368 15.1697 15.4474 15.3829 15.2898 15.5405C15.1322 15.6981 14.919 15.7875 14.6962 15.7894C14.4733 15.7913 14.2586 15.7057 14.0983 15.5508L10.0047 11.4572C9.24168 11.9998 8.34406 12.3218 7.41019 12.3881C6.47632 12.4543 5.54223 12.2623 4.71027 11.8329C3.87832 11.4035 3.1806 10.7534 2.69358 9.95387C2.20656 9.15429 1.94904 8.23609 1.94922 7.29987Z" fill="#FF8329" />
                                        </svg>

                                    </button>
                                    <button>
                                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect width="17" height="17" transform="translate(0.25 0.5)" fill="white" />
                                            <path d="M13.707 5.45833L13.0929 14.0589C13.0675 14.4163 12.9075 14.7508 12.6453 14.995C12.3831 15.2392 12.0381 15.375 11.6798 15.375H5.81761C5.4593 15.375 5.11429 15.2392 4.85207 14.995C4.58986 14.7508 4.42993 14.4163 4.40449 14.0589L3.79036 5.45833H6.6237V3.33333C6.6237 3.14547 6.69833 2.9653 6.83116 2.83247C6.964 2.69963 7.14417 2.625 7.33203 2.625H10.1654C10.3532 2.625 10.5334 2.69963 10.6662 2.83247C10.7991 2.9653 10.8737 3.14547 10.8737 3.33333V5.45833H13.707Z" fill="white" />
                                            <path d="M7.33203 8.29167V12.5417M10.1654 8.29167V12.5417M3.08203 5.45833H14.4154M13.707 5.45833L13.0929 14.0589C13.0675 14.4163 12.9075 14.7508 12.6453 14.995C12.3831 15.2392 12.0381 15.375 11.6798 15.375H5.81761C5.4593 15.375 5.11429 15.2392 4.85207 14.995C4.58986 14.7508 4.42993 14.4163 4.40449 14.0589L3.79036 5.45833H13.707ZM10.8737 5.45833V3.33333C10.8737 3.14547 10.7991 2.9653 10.6662 2.83247C10.5334 2.69963 10.3532 2.625 10.1654 2.625H7.33203C7.14417 2.625 6.964 2.69963 6.83116 2.83247C6.69833 2.9653 6.6237 3.14547 6.6237 3.33333V5.45833H10.8737Z" stroke="#FF2929" stroke-width="1.60002" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>

                                    </button>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>1</td>
                            <td>ปลูกต้นไม้</td>
                            <td>10 ส.ค. 2024 </td>
                            <td>
                                <div className="flex justify-center gap-5 items-center">
                                    <button className={iconBtn}>
                                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect width="17" height="17" transform="translate(0.25 0.5)" fill="white" />
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M7.04922 3.89987C6.14748 3.89987 5.28268 4.25808 4.64506 4.89571C4.00743 5.53333 3.64922 6.39813 3.64922 7.29987C3.64922 8.20161 4.00743 9.06641 4.64506 9.70403C5.28268 10.3417 6.14748 10.6999 7.04922 10.6999C7.95095 10.6999 8.81576 10.3417 9.45338 9.70403C10.091 9.06641 10.4492 8.20161 10.4492 7.29987C10.4492 6.39813 10.091 5.53333 9.45338 4.89571C8.81576 4.25808 7.95095 3.89987 7.04922 3.89987ZM1.94922 7.29987C1.94912 6.49722 2.13846 5.70588 2.50186 4.9902C2.86526 4.27453 3.39245 3.65473 4.04056 3.18122C4.68866 2.70771 5.43937 2.39385 6.23164 2.26518C7.02391 2.13651 7.83537 2.19665 8.60001 2.44072C9.36466 2.68479 10.0609 3.10589 10.6321 3.66977C11.2033 4.23366 11.6334 4.9244 11.8873 5.68583C12.1412 6.44726 12.2118 7.25787 12.0934 8.05174C11.975 8.8456 11.6708 9.60031 11.2057 10.2545L15.3002 14.3489C15.455 14.5092 15.5407 14.7239 15.5387 14.9468C15.5368 15.1697 15.4474 15.3829 15.2898 15.5405C15.1322 15.6981 14.919 15.7875 14.6962 15.7894C14.4733 15.7913 14.2586 15.7057 14.0983 15.5508L10.0047 11.4572C9.24168 11.9998 8.34406 12.3218 7.41019 12.3881C6.47632 12.4543 5.54223 12.2623 4.71027 11.8329C3.87832 11.4035 3.1806 10.7534 2.69358 9.95387C2.20656 9.15429 1.94904 8.23609 1.94922 7.29987Z" fill="#FF8329" />
                                        </svg>

                                    </button>
                                    <button className={iconBtn}>
                                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect width="17" height="17" transform="translate(0.25 0.5)" fill="white" />
                                            <path d="M13.707 5.45833L13.0929 14.0589C13.0675 14.4163 12.9075 14.7508 12.6453 14.995C12.3831 15.2392 12.0381 15.375 11.6798 15.375H5.81761C5.4593 15.375 5.11429 15.2392 4.85207 14.995C4.58986 14.7508 4.42993 14.4163 4.40449 14.0589L3.79036 5.45833H6.6237V3.33333C6.6237 3.14547 6.69833 2.9653 6.83116 2.83247C6.964 2.69963 7.14417 2.625 7.33203 2.625H10.1654C10.3532 2.625 10.5334 2.69963 10.6662 2.83247C10.7991 2.9653 10.8737 3.14547 10.8737 3.33333V5.45833H13.707Z" fill="white" />
                                            <path d="M7.33203 8.29167V12.5417M10.1654 8.29167V12.5417M3.08203 5.45833H14.4154M13.707 5.45833L13.0929 14.0589C13.0675 14.4163 12.9075 14.7508 12.6453 14.995C12.3831 15.2392 12.0381 15.375 11.6798 15.375H5.81761C5.4593 15.375 5.11429 15.2392 4.85207 14.995C4.58986 14.7508 4.42993 14.4163 4.40449 14.0589L3.79036 5.45833H13.707ZM10.8737 5.45833V3.33333C10.8737 3.14547 10.7991 2.9653 10.6662 2.83247C10.5334 2.69963 10.3532 2.625 10.1654 2.625H7.33203C7.14417 2.625 6.964 2.69963 6.83116 2.83247C6.69833 2.9653 6.6237 3.14547 6.6237 3.33333V5.45833H10.8737Z" stroke="#FF2929" stroke-width="1.60002" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>

                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </TitleCard2>
           
        </>
    )
}

export default GettingStarted