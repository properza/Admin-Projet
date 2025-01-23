import ReactPaginate from 'react-paginate';
import React, { useState, useEffect } from 'react';
import { useDispatch , useSelector } from 'react-redux';
import { getEvent , fetchCurrentUser , DeleteEvent } from '../../components/common/userSlice';
import ModalQRCode from '../dashboard/Modalcreat/ModalQRCode';
import ModalHDetail from './ModalHisDe/ModalHDetail';
import TitleCard2 from "../../components/Cards/TiileCard2"
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import Swal from 'sweetalert2';

const iconF1 = (
    <svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="17" height="17" transform="translate(0.550781)" fill="white" />
        <path d="M14.15 2.12536C14.4881 2.12536 14.8123 2.25964 15.0514 2.49867C15.2904 2.73776 15.4246 3.06196 15.4246 3.4C15.4246 3.73806 15.2904 4.06229 15.0514 4.30138C15.0514 4.30139 15.0513 4.30141 15.0513 4.30143L8.72776 10.625H6.925V8.82224L13.2486 2.49867C13.2486 2.49865 13.2486 2.49864 13.2486 2.49862C13.4877 2.25962 13.8119 2.12536 14.15 2.12536Z" fill="#4400A5" stroke="white" stroke-width="0.85" />
        <path fill-rule="evenodd" clip-rule="evenodd" d="M2.25 5.1C2.25 4.64913 2.42911 4.21673 2.74792 3.89792C3.06673 3.57911 3.49913 3.4 3.95 3.4H7.35C7.57543 3.4 7.79163 3.48956 7.95104 3.64896C8.11045 3.80837 8.2 4.02457 8.2 4.25C8.2 4.47544 8.11045 4.69164 7.95104 4.85104C7.79163 5.01045 7.57543 5.1 7.35 5.1H3.95V13.6H12.45V10.2C12.45 9.97457 12.5396 9.75837 12.699 9.59896C12.8584 9.43956 13.0746 9.35 13.3 9.35C13.5254 9.35 13.7416 9.43956 13.901 9.59896C14.0604 9.75837 14.15 9.97457 14.15 10.2V13.6C14.15 14.0509 13.9709 14.4833 13.6521 14.8021C13.3333 15.1209 12.9009 15.3 12.45 15.3H3.95C3.49913 15.3 3.06673 15.1209 2.74792 14.8021C2.42911 14.4833 2.25 14.0509 2.25 13.6V5.1Z" fill="#4400A5" />
    </svg>
);
const iconF2 = (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="17" height="17" transform="translate(0.25 0.5)" fill="white"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M7.04922 3.90085C6.14748 3.90085 5.28268 4.25906 4.64506 4.89668C4.00743 5.53431 3.64922 6.39911 3.64922 7.30085C3.64922 8.20258 4.00743 9.06739 4.64506 9.70501C5.28268 10.3426 6.14748 10.7008 7.04922 10.7008C7.95095 10.7008 8.81576 10.3426 9.45338 9.70501C10.091 9.06739 10.4492 8.20258 10.4492 7.30085C10.4492 6.39911 10.091 5.53431 9.45338 4.89668C8.81576 4.25906 7.95095 3.90085 7.04922 3.90085ZM1.94922 7.30085C1.94912 6.49819 2.13846 5.70685 2.50186 4.99118C2.86526 4.2755 3.39245 3.6557 4.04056 3.18219C4.68866 2.70868 5.43937 2.39483 6.23164 2.26615C7.02391 2.13748 7.83537 2.19763 8.60001 2.44169C9.36466 2.68576 10.0609 3.10686 10.6321 3.67075C11.2033 4.23463 11.6334 4.92538 11.8873 5.68681C12.1412 6.44824 12.2118 7.25885 12.0934 8.05272C11.975 8.84658 11.6708 9.60129 11.2057 10.2554L15.3002 14.3499C15.455 14.5102 15.5407 14.7249 15.5387 14.9478C15.5368 15.1707 15.4474 15.3838 15.2898 15.5414C15.1322 15.699 14.919 15.7884 14.6962 15.7904C14.4733 15.7923 14.2586 15.7066 14.0983 15.5518L10.0047 11.4582C9.24168 12.0007 8.34406 12.3228 7.41019 12.389C6.47632 12.4553 5.54223 12.2632 4.71027 11.8339C3.87832 11.4045 3.1806 10.7544 2.69358 9.95484C2.20656 9.15527 1.94904 8.23707 1.94922 7.30085Z" fill="#FF8329"/>
    </svg>
);
const iconF3 = (
    <svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="17" height="17" transform="translate(0.550781)" fill="white" />
        <path d="M14.0078 4.95833L13.3937 13.5589C13.3682 13.9163 13.2083 14.2508 12.9461 14.495C12.6839 14.7392 12.3389 14.875 11.9806 14.875H6.1184C5.76008 14.875 5.41507 14.7392 5.15286 14.495C4.89064 14.2508 4.73071 13.9163 4.70527 13.5589L4.09115 4.95833H6.92448V2.83333C6.92448 2.64547 6.99911 2.4653 7.13195 2.33247C7.26478 2.19963 7.44495 2.125 7.63281 2.125H10.4661C10.654 2.125 10.8342 2.19963 10.967 2.33247C11.0999 2.4653 11.1745 2.64547 11.1745 2.83333V4.95833H14.0078Z" fill="white" />
        <path d="M7.63281 7.79167V12.0417M10.4661 7.79167V12.0417M3.38281 4.95833H14.7161M14.0078 4.95833L13.3937 13.5589C13.3682 13.9163 13.2083 14.2508 12.9461 14.495C12.6839 14.7392 12.3389 14.875 11.9806 14.875H6.1184C5.76008 14.875 5.41507 14.7392 5.15286 14.495C4.89064 14.2508 4.73071 13.9163 4.70527 13.5589L4.09115 4.95833H14.0078ZM11.1745 4.95833V2.83333C11.1745 2.64547 11.0999 2.4653 10.967 2.33247C10.8342 2.19963 10.654 2.125 10.4661 2.125H7.63281C7.44495 2.125 7.26478 2.19963 7.13195 2.33247C6.99911 2.4653 6.92448 2.64547 6.92448 2.83333V4.95833H11.1745Z" stroke="#FF2929" stroke-width="1.60002" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
);
const iconF4 = (
    <svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="17" height="17" transform="translate(0.299805)" fill="white" />
        <path d="M5.96663 7.79167V4.95833C5.96663 4.20689 6.26514 3.48622 6.7965 2.95486C7.32785 2.42351 8.04852 2.125 8.79997 2.125C9.55141 2.125 10.2721 2.42351 10.8034 2.95486C11.3348 3.48622 11.6333 4.20689 11.6333 4.95833M8.79997 10.625V12.0417M4.54997 14.875H13.05C13.4257 14.875 13.786 14.7257 14.0517 14.4601C14.3174 14.1944 14.4666 13.8341 14.4666 13.4583V9.20833C14.4666 8.83261 14.3174 8.47228 14.0517 8.2066C13.786 7.94092 13.4257 7.79167 13.05 7.79167H4.54997C4.17424 7.79167 3.81391 7.94092 3.54823 8.2066C3.28256 8.47228 3.1333 8.83261 3.1333 9.20833V13.4583C3.1333 13.8341 3.28256 14.1944 3.54823 14.4601C3.81391 14.7257 4.17424 14.875 4.54997 14.875Z" stroke="#FF8329" stroke-width="1.41667" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
);

function Transactions(){
    const dispatch = useDispatch()
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const eventData = useSelector(state => state.user.getEventData); 
    const currentUser = useSelector(state => state.user.currentUser);
    const loading = useSelector(state => state.user.loading);
    const error = useSelector(state => state.user.error);

    const iconBtn = "cursor-pointer hover:bg-gray-300 rounded-md";

    const [showModalEdit , setshowModalEdit] = useState(false);
    const [selectedUserDetails, setSelectedUserDetails] = useState(null);
    const [selectedID, setSelectedID] = useState(null);

    const [showModalQRCode, setShowModalQRCode] = useState(false);
    const [qrEventID, setQrEventID] = useState(null);

    useEffect(()=>{
        dispatch(getEvent({page:currentPage , role:currentUser?.role , status: "complete" }))
        if(!currentUser){
            dispatch(fetchCurrentUser())
        }
    },[dispatch , currentPage , currentUser])

    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected + 1);
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const handleH = (itemID) => {
        setSelectedID(itemID)
        setshowModalEdit(true);
    }

    const handleDelete = (itemID, itemtype) => {
        Swal.fire({
            icon: 'question',
            title: 'ต้องการที่จะลบกิจกรรม?',
            text: 'หากทำรายการไปแล้วจะไม่สามารถกู้คืนได้',
            showCancelButton: true,
            confirmButtonText: 'ตกลง',
            cancelButtonText: 'ยกเลิก',
            confirmButtonColor: '#FF8329',
            cancelButtonColor: '#333333'
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(DeleteEvent({ eventID: itemID, event_type: itemtype }))
                .unwrap()
                .then((res) => {
                    Swal.fire({
                        icon: 'success',
                        title: 'ลบกิจกรรมสำเร็จ!',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    dispatch(getEvent({ page: currentPage, role: currentUser?.role ,status: "complete"}));
                })
                .catch((error) => {
                    Swal.fire({
                        icon: 'error',
                        title: 'เกิดข้อผิดพลาด!',
                        text: error || 'ไม่สามารถลบกิจกรรมได้',
                        showConfirmButton: false,
                        timer: 1500
                    });
                });
            }
        });
    };

    const handleQRCode = (item,eventID) => {
        setQrEventID(eventID);
        setSelectedUserDetails(item);
        setShowModalQRCode(true);
    };
    
    const closeModal = () => {
        dispatch(getEvent({page:currentPage , role:currentUser?.role ,status: "complete"}))
        setIsModalOpen(false);
        setshowModalEdit(false);
        setShowModalQRCode(false);
    };

    const updateDashboardPeriod = () => {
        closeModal();
    };

    const createBTN = (
        <button
            onClick={openModal}
            className='btn text-white bg-[#FF9C00] hover:bg-yellow-600'>
            สร้างกิจกรรม
        </button>
    );

    const renderEvents = () => {
        if (loading) {
            return <tr><td colSpan="9">Loading...</td></tr>;
        }
    
        if (error) {
            return <tr><td colSpan="9">Error: {error}</td></tr>;
        }

        if (!eventData || !eventData.data || eventData.data.length === 0) {
            return <tr><td colSpan="9">ยังไม่มีข้อมูลกิจกรรม</td></tr>;
        }

        return (
            <>
                {eventData.data.map((data, index) => (
                    <tr key={data.id}>
                        <td>{index + 1}</td>
                        <td>{data.id}</td>
                        <td>{data.activityName ?? '-' }</td>
                        {currentUser?.role === 'super_admin' && <td> <p className={`badge-ghost rounded-md p-1 ${data.event_type === 'normal' ? 'bg-green-300' : 'bg-orange-300'}`}>{data.event_type === 'normal' ? 'ทั่วไป' : 'กยศ.'}</p> </td>}
                        <td>
                            {data.created_at ? 
                                format(new Date(data.created_at), "d MMM yyyy", { locale: th })
                                : '-'
                            }
                        </td>
                        <td>
                            <div className="flex gap-2 justify-center">
                                <button onClick={()=>handleH(data.id)}>{iconF2}</button>
                                {/* <button onClick={()=>handleEdit(data , data.id)}>{iconF1}</button> */}
                                <button onClick={()=> handleDelete(data.id , data.event_type)}>{iconF3}</button>
                            </div>
                        </td>
                        <td>
                                <div className="flex justify-center items-center">
                                    <button onClick={() => handleQRCode(data , data.id)} className='cursor-pointer hover:bg-gray-300 rounded-md'>
                                        <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M3.84961 4.79961C3.84961 4.48135 3.97604 4.17612 4.20108 3.95108C4.42612 3.72604 4.73135 3.59961 5.04961 3.59961H8.64961C8.96787 3.59961 9.27309 3.72604 9.49814 3.95108C9.72318 4.17612 9.84961 4.48135 9.84961 4.79961V8.39961C9.84961 8.71787 9.72318 9.02309 9.49814 9.24814C9.27309 9.47318 8.96787 9.59961 8.64961 9.59961H5.04961C4.73135 9.59961 4.42612 9.47318 4.20108 9.24814C3.97604 9.02309 3.84961 8.71787 3.84961 8.39961V4.79961ZM6.24961 7.19961V5.99961H7.44961V7.19961H6.24961ZM3.84961 15.5996C3.84961 15.2813 3.97604 14.9761 4.20108 14.7511C4.42612 14.526 4.73135 14.3996 5.04961 14.3996H8.64961C8.96787 14.3996 9.27309 14.526 9.49814 14.7511C9.72318 14.9761 9.84961 15.2813 9.84961 15.5996V19.1996C9.84961 19.5179 9.72318 19.8231 9.49814 20.0481C9.27309 20.2732 8.96787 20.3996 8.64961 20.3996H5.04961C4.73135 20.3996 4.42612 20.2732 4.20108 20.0481C3.97604 19.8231 3.84961 19.5179 3.84961 19.1996V15.5996ZM6.24961 17.9996V16.7996H7.44961V17.9996H6.24961ZM15.8496 3.59961C15.5313 3.59961 15.2261 3.72604 15.0011 3.95108C14.776 4.17612 14.6496 4.48135 14.6496 4.79961V8.39961C14.6496 8.71787 14.776 9.02309 15.0011 9.24814C15.2261 9.47318 15.5313 9.59961 15.8496 9.59961H19.4496C19.7679 9.59961 20.0731 9.47318 20.2981 9.24814C20.5232 9.02309 20.6496 8.71787 20.6496 8.39961V4.79961C20.6496 4.48135 20.5232 4.17612 20.2981 3.95108C20.0731 3.72604 19.7679 3.59961 19.4496 3.59961H15.8496ZM17.0496 5.99961V7.19961H18.2496V5.99961H17.0496Z" fill="#232325" />
                                            <path d="M13.4496 4.79961C13.4496 4.48135 13.3232 4.17612 13.0981 3.95108C12.8731 3.72604 12.5679 3.59961 12.2496 3.59961C11.9313 3.59961 11.6261 3.72604 11.4011 3.95108C11.176 4.17612 11.0496 4.48135 11.0496 4.79961V5.99961C11.0496 6.31787 11.176 6.62309 11.4011 6.84814C11.6261 7.07318 11.9313 7.19961 12.2496 7.19961C12.5679 7.19961 12.8731 7.07318 13.0981 6.84814C13.3232 6.62309 13.4496 6.31787 13.4496 5.99961V4.79961ZM12.2496 8.39961C12.5679 8.39961 12.8731 8.52604 13.0981 8.75108C13.3232 8.97612 13.4496 9.28135 13.4496 9.59961V10.7996H15.8496C16.1679 10.7996 16.4731 10.926 16.6981 11.1511C16.9232 11.3761 17.0496 11.6813 17.0496 11.9996C17.0496 12.3179 16.9232 12.6231 16.6981 12.8481C16.4731 13.0732 16.1679 13.1996 15.8496 13.1996H12.2496C11.9313 13.1996 11.6261 13.0732 11.4011 12.8481C11.176 12.6231 11.0496 12.3179 11.0496 11.9996V9.59961C11.0496 9.28135 11.176 8.97612 11.4011 8.75108C11.6261 8.52604 11.9313 8.39961 12.2496 8.39961V8.39961ZM19.4496 10.7996C19.1313 10.7996 18.8261 10.926 18.6011 11.1511C18.376 11.3761 18.2496 11.6813 18.2496 11.9996C18.2496 12.3179 18.376 12.6231 18.6011 12.8481C18.8261 13.0732 19.1313 13.1996 19.4496 13.1996C19.7679 13.1996 20.0731 13.0732 20.2981 12.8481C20.5232 12.6231 20.6496 12.3179 20.6496 11.9996C20.6496 11.6813 20.5232 11.3761 20.2981 11.1511C20.0731 10.926 19.7679 10.7996 19.4496 10.7996ZM11.0496 15.5996C11.0496 15.2813 11.176 14.9761 11.4011 14.7511C11.6261 14.526 11.9313 14.3996 12.2496 14.3996H13.4496C13.7679 14.3996 14.0731 14.526 14.2981 14.7511C14.5232 14.9761 14.6496 15.2813 14.6496 15.5996C14.6496 15.9179 14.5232 16.2231 14.2981 16.4481C14.0731 16.6732 13.7679 16.7996 13.4496 16.7996V19.1996C13.4496 19.5179 13.3232 19.8231 13.0981 20.0481C12.8731 20.2732 12.5679 20.3996 12.2496 20.3996C11.9313 20.3996 11.6261 20.2732 11.4011 20.0481C11.176 19.8231 11.0496 19.5179 11.0496 19.1996V15.5996ZM8.64961 13.1996C8.96787 13.1996 9.27309 13.0732 9.49814 12.8481C9.72318 12.6231 9.84961 12.3179 9.84961 11.9996C9.84961 11.6813 9.72318 11.3761 9.49814 11.1511C9.27309 10.926 8.96787 10.7996 8.64961 10.7996H5.04961C4.73135 10.7996 4.42612 10.926 4.20108 11.1511C3.97604 11.3761 3.84961 11.6813 3.84961 11.9996C3.84961 12.3179 3.97604 12.6231 4.20108 12.8481C4.42612 13.0732 4.73135 13.1996 5.04961 13.1996H8.64961ZM20.6496 15.5996C20.6496 15.9179 20.5232 16.2231 20.2981 16.4481C20.0731 16.6732 19.7679 16.7996 19.4496 16.7996H17.0496C16.7313 16.7996 16.4261 16.6732 16.2011 16.4481C15.976 16.2231 15.8496 15.9179 15.8496 15.5996C15.8496 15.2813 15.976 14.9761 16.2011 14.7511C16.4261 14.526 16.7313 14.3996 17.0496 14.3996H19.4496C19.7679 14.3996 20.0731 14.526 20.2981 14.7511C20.5232 14.9761 20.6496 15.2813 20.6496 15.5996ZM19.4496 20.3996C19.7679 20.3996 20.0731 20.2732 20.2981 20.0481C20.5232 19.8231 20.6496 19.5179 20.6496 19.1996C20.6496 18.8813 20.5232 18.5761 20.2981 18.3511C20.0731 18.126 19.7679 17.9996 19.4496 17.9996H15.8496C15.5313 17.9996 15.2261 18.126 15.0011 18.3511C14.776 18.5761 14.6496 18.8813 14.6496 19.1996C14.6496 19.5179 14.776 19.8231 15.0011 20.0481C15.2261 20.2732 15.5313 20.3996 15.8496 20.3996H19.4496Z" fill="#232325" />
                                        </svg>
                                    </button>
                                </div>
                            </td>
                    </tr>
                ))}
            </>
        );
    };

    const roleSelect = currentUser?.role === 'super_admin' ? '' 
                        : currentUser?.role === 'normal' ? '(ทั่วไป)'
                        : currentUser?.role === 'special' ? '(กยศ.)'
                        :null

    return (
        <> 
            {showModalQRCode && (<ModalQRCode onClose={closeModal} eventID={qrEventID} userDetails={selectedUserDetails} />)}
            {showModalEdit && <ModalHDetail onClose={closeModal} eventID={selectedID}/>}
            <TitleCard2 title={'ประเภทกิจกรรม'} title2={roleSelect} subTitle={`ทั้งหมด ${eventData.meta?.total} รายการ`}>
                <table className='table text-center'>
                    <thead className=''>
                        <tr>
                            <th>No.</th>
                            <th>รหัสกิจกรรม</th>
                            <th>กิจกรรม</th>
                            {currentUser?.role === 'super_admin' && <th>ประเภท</th>}
                            <th>วันที่อัปเดตล่าสุด</th>
                            <th>จัดการ</th>
                            <th>QR Code</th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderEvents()}
                    </tbody>
                </table>
                {eventData.meta?.total >= 10 &&
                        <div className="flex justify-end mt-10">
                            <ReactPaginate
                                previousLabel={"<"}
                                nextLabel={">"}
                                breakLabel={"..."}
                                pageCount={eventData.meta?.last_page || 1}
                                marginPagesDisplayed={2}
                                pageRangeDisplayed={3}
                                onPageChange={handlePageChange}
                                containerClassName={"pagination"}
                                activeClassName={"active"}
                                breakClassName={"page-item"}
                                breakLinkClassName={"page-link"}
                                pageClassName={"page-item"}
                                pageLinkClassName={"page-link"}
                                previousClassName={"page-item"}
                                previousLinkClassName={"page-link"}
                                nextClassName={"page-item"}
                                nextLinkClassName={"page-link"}
                                disabledClassName={"disabled"}
                            />
                        </div>
                    }
            </TitleCard2>


        </>
    )
}

export default Transactions