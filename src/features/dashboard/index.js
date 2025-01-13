import TitleCard2 from '../../components/Cards/TiileCard2'
import { showNotification } from '../common/headerSlice'
import ModalCA from './Modalcreat/ModalCA'
import ModalEditinfo from './Modalcreat/ModalEditinfo';
import ModalQRCode from './Modalcreat/ModalQRCode';
import ReactPaginate from 'react-paginate';
import React, { useState, useEffect } from 'react';
import { useDispatch , useSelector } from 'react-redux';
import { getEvent , fetchCurrentUser , DeleteEvent } from '../../components/common/userSlice';
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
const iconF3 = (
    <svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="17" height="17" transform="translate(0.550781)" fill="white" />
        <path d="M14.0078 4.95833L13.3937 13.5589C13.3682 13.9163 13.2083 14.2508 12.9461 14.495C12.6839 14.7392 12.3389 14.875 11.9806 14.875H6.1184C5.76008 14.875 5.41507 14.7392 5.15286 14.495C4.89064 14.2508 4.73071 13.9163 4.70527 13.5589L4.09115 4.95833H6.92448V2.83333C6.92448 2.64547 6.99911 2.4653 7.13195 2.33247C7.26478 2.19963 7.44495 2.125 7.63281 2.125H10.4661C10.654 2.125 10.8342 2.19963 10.967 2.33247C11.0999 2.4653 11.1745 2.64547 11.1745 2.83333V4.95833H14.0078Z" fill="white" />
        <path d="M7.63281 7.79167V12.0417M10.4661 7.79167V12.0417M3.38281 4.95833H14.7161M14.0078 4.95833L13.3937 13.5589C13.3682 13.9163 13.2083 14.2508 12.9461 14.495C12.6839 14.7392 12.3389 14.875 11.9806 14.875H6.1184C5.76008 14.875 5.41507 14.7392 5.15286 14.495C4.89064 14.2508 4.73071 13.9163 4.70527 13.5589L4.09115 4.95833H14.0078ZM11.1745 4.95833V2.83333C11.1745 2.64547 11.0999 2.4653 10.967 2.33247C10.8342 2.19963 10.654 2.125 10.4661 2.125H7.63281C7.44495 2.125 7.26478 2.19963 7.13195 2.33247C6.99911 2.4653 6.92448 2.64547 6.92448 2.83333V4.95833H11.1745Z" stroke="#FF2929" stroke-width="1.60002" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
);

function Dashboard() {
    const dispatch = useDispatch();
    
    // state สำหรับ Modal ต่าง ๆ
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [showModalQRCode, setShowModalQRCode] = useState(false);

    // state สำหรับข้อมูลเพจ
    const [currentPage, setCurrentPage] = useState(1);

    // *** เพิ่ม state สำหรับเก็บ status ที่ต้องการดู (เริ่มด้วย 'inactive' หรือ 'active' ก็ได้) ***
    const [selectedStatus, setSelectedStatus] = useState('inactive');

    // state สำหรับข้อมูลที่จะแก้ไข/ดู QR
    const [selectedUserDetails, setSelectedUserDetails] = useState(null);
    const [selectedID, setSelectedID] = useState(null);
    const [qrEventID, setQrEventID] = useState(null);

    // ข้อมูลที่ได้จาก Redux
    const eventData = useSelector(state => state.user.getEventData);
    const currentUser = useSelector(state => state.user.currentUser);
    const loading = useSelector(state => state.user.loading);
    const error = useSelector(state => state.user.error);

    // เรียกใช้ API ครั้งแรก และทุกครั้งที่ currentPage หรือ selectedStatus เปลี่ยน
    useEffect(()=> {
        if (!currentUser) {
            dispatch(fetchCurrentUser());
        }
        dispatch(getEvent({
            page: currentPage,
            role: currentUser?.role,
            status: selectedStatus,
        }));
    }, [dispatch, currentPage, currentUser, selectedStatus]);

    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected + 1);
    };

    // ฟังก์ชันสลับ status ด้วย 2 ปุ่ม
    const handleSelectStatus = (newStatus) => {
        setSelectedStatus(newStatus);
        setCurrentPage(1); // กลับไปหน้าแรกหรือคงหน้าเดิมก็ได้
    };

    // เปิด Modal สร้างกิจกรรม
    const openModal = () => {
        setIsModalOpen(true);
    };

    // แก้ไข
    const handleEdit = (item, itemID) => {
        setShowModalEdit(true);
        setSelectedUserDetails(item);
        setSelectedID(itemID);
    };

    // ลบ
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
                .then(() => {
                    Swal.fire({
                        icon: 'success',
                        title: 'ลบกิจกรรมสำเร็จ!',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    // reload data
                    dispatch(getEvent({ 
                        page: currentPage, 
                        role: currentUser?.role,
                        status: selectedStatus
                    }));
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

    // QR Code
    const handleQRCode = (item, eventID) => {
        setQrEventID(eventID);
        setSelectedUserDetails(item);
        setShowModalQRCode(true);
    };
    
    // ปิด Modal
    const closeModal = () => {
        // reload data (กรณีสร้าง/แก้ไขเสร็จ)
        dispatch(getEvent({ 
            page: currentPage, 
            role: currentUser?.role,
            status: selectedStatus
        }));
        setIsModalOpen(false);
        setShowModalEdit(false);
        setShowModalQRCode(false);
    };

    const updateDashboardPeriod = () => {
        closeModal();
    };

    // ปุ่มสร้างกิจกรรม
    const createBTN = (
        <button
            onClick={openModal}
            className='btn text-white bg-[#FF9C00] hover:bg-yellow-600'
        >
            สร้างกิจกรรม
        </button>
    );

    // render ตาราง
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
                        <td>{data.activityName ?? '-'}</td>
                        <td>
                            {data.created_at
                                ? format(new Date(data.created_at), "d MMM yyyy", { locale: th })
                                : '-'
                            }
                        </td>
                        <td>
                            <div className="flex gap-2 justify-center">
                                <button onClick={() => handleEdit(data, data.id)}>
                                    {iconF1}
                                </button>
                                <button onClick={() => handleDelete(data.id, data.event_type)}>
                                    {iconF3}
                                </button>
                            </div>
                        </td>
                        <td>
                            <div className="flex justify-center items-center">
                                <button 
                                    onClick={() => handleQRCode(data, data.id)} 
                                    className='cursor-pointer hover:bg-gray-300 rounded-md'
                                >
                                    {/* icon QR... */}
                                    <svg /* ...attributes... */> ... </svg>
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
            </>
        );
    };

    const roleSelect = currentUser?.role === 'super_admin' 
        ? '' 
        : currentUser?.role === 'normal' 
            ? '(ทั่วไป)'
            : currentUser?.role === 'special' 
                ? '(กยศ.)'
                : null

    return (
        <>
            {/* 2 ปุ่มสำหรับเลือกดูกิจกรรม status active / inactive */}
            

            {/* Modal QRCode */}
            {showModalQRCode && (
                <ModalQRCode
                    onClose={closeModal}
                    eventID={qrEventID}
                    userDetails={selectedUserDetails}
                />
            )}
            {/* Modal แก้ไขกิจกรรม */}
            {showModalEdit && (
                <ModalEditinfo
                    onClose={closeModal}
                    onSave={updateDashboardPeriod}
                    eventID={selectedID}
                    userDetails={selectedUserDetails}
                />
            )}
            {/* Modal สร้างกิจกรรม */}
            {isModalOpen && (
                <ModalCA
                    onClose={closeModal}
                    onSave={updateDashboardPeriod}
                />
            )}

            <TitleCard2
                title={'ประเภทกิจกรรม'}
                title2={roleSelect}
                subTitle={`ทั้งหมด ${eventData.meta?.total} รายการ`}
                TopSideButtons={createBTN}
            >

            <div className="mb-4 flex gap-3">
                
                <button
                  onClick={() => handleSelectStatus('inactive')}
                  className={`font-semibold ${selectedStatus === 'inactive' ? 'border-b-[#FF8329] border-b-[5px] px-1' : ''}`}
                >
                  กิจกรรมที่ยังไม่เริ่ม
                </button>

                <button
                  onClick={() => handleSelectStatus('active')}
                  className={`font-semibold ${selectedStatus === 'active' ? 'border-b-[#FF8329] border-b-[5px] px-1' : ''}`}
                >
                  กิจกรรมที่เริ่มอยู่
                </button>

            </div>
                <table className='table text-center'>
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>รหัสกิจกรรม</th>
                            <th>กิจกรรม</th>
                            <th>วันที่อัปเดตล่าสุด</th>
                            <th>จัดการ</th>
                            <th>QR Code</th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderEvents()}
                    </tbody>
                </table>

                {/* pagination */}
                {eventData.meta?.total >= 10 && (
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
                )}
            </TitleCard2>
        </>
    );
}

export default Dashboard;
