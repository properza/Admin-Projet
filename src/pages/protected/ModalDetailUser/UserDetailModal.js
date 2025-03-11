import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDetailUser, getDetailUseruserEvent, getdetailSpecial, fetchCurrentUser , setComplete } from '../../../components/common/userSlice';
import './ModalDetail.css'
import { showNotification } from '../../../features/common/headerSlice';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import ModalImage from './ModalImage';
import ReactPaginate from 'react-paginate';
import Swal from 'sweetalert2'; 

function UserDetailModal({ user, isOpen, onClose }) {
    const dispatch = useDispatch()
    const currentUser = useSelector(state => state.user.currentUser);
    const detailUserdata = useSelector((state) => state.user.getDetailUserData);
    const detailUserEventdata = useSelector((state) => state.user.getDetailUseruserEventData);
    const detailspecialdata = useSelector((state) => state.user.getdetailSpecialsData);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentPage2, setCurrentPage2] = useState(1);
    const loading = useSelector(state => state.user.loading);
    const error = useSelector(state => state.user.error);
    const [activeBtn, setactiveBtn] = useState('กิจกรรม');
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);
    
        useEffect(() => {
            dispatch(fetchCurrentUser())
        }, [dispatch])

    const openImageModal = (images) => {
        setSelectedImages(images);
        setIsImageModalOpen(true);
    };

    const closeImageModal = () => {
        setIsImageModalOpen(false);
        setSelectedImages([]);
    };

    const handleApprove = (eventId) => {
        // แสดง swal ให้ผู้ใช้ยืนยันการอนุมัติ
        Swal.fire({
            title: 'ต้องการอนุมัติหรือไม่?',
            showCancelButton: true,
            confirmButtonText: 'อนุมัติ',
            cancelButtonText: 'ยกเลิก',
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(setComplete({ eventID: eventId, status: 'อนุมัติ' }))
                    .then(() => {
                        Swal.fire({
                            title: 'ทำรายการสำเร็จ',
                            icon: 'success',
                            showConfirmButton: false,
                            timer: 1500
                        });
    
                        dispatch(getdetailSpecial({ page: currentPage2, userID: user?.customer_id }));
                    })
                    .catch(error => {
                        Swal.fire({
                            title: 'เกิดข้อผิดพลาด',
                            text: error.message,
                            icon: 'error',
                            timer: 1500
                        });
                        dispatch(getdetailSpecial({ page: currentPage2, userID: user?.customer_id }));
                    });
            }
        });
    };
    
    const handleReject = (eventId) => {
        Swal.fire({
            title: 'ต้องการไม่อนุมัติหรือไม่?',
            showCancelButton: true,
            confirmButtonText: 'ไม่อนุมัติ',
            cancelButtonText: 'ยกเลิก',
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(setComplete({ eventID: eventId, status: 'ไม่อนุมัติ' }))
                    .then(() => {
                        Swal.fire({
                            title: 'ทำรายการสำเร็จ',
                            icon: 'success',
                            showConfirmButton: false,
                            timer: 1500
                        });
    
                        dispatch(getdetailSpecial({ page: currentPage2, userID: user?.customer_id }));
                    })
                    .catch(error => {
                        Swal.fire({
                            title: 'เกิดข้อผิดพลาด',
                            text: error.message,
                            icon: 'error',
                            timer: 1500
                        });
                        dispatch(getdetailSpecial({ page: currentPage2, userID: user?.customer_id }));
                    });
            }
        });
    };
    
    useEffect(() => {
        dispatch(getDetailUser({ page: currentPage, userID: user?.customer_id }))
        dispatch(getDetailUseruserEvent({ page: currentPage2, userID: user?.customer_id }))
        dispatch(getdetailSpecial({ page: currentPage2, userID: user?.customer_id }))

    }, [dispatch, user , currentPage ,currentPage2])

    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected + 1);
    };

    const handlePageChange2 = ({ selected }) => {
        setCurrentPage2(selected + 1);
    };

    const image =
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
        </svg>;

    const renderEvents = () => {
        if (loading) {
            return <tr><td colSpan="9">Loading...</td></tr>;
        }

        if (error) {
            return <tr><td colSpan="9">Error: {error}</td></tr>;
        }

        if (!detailUserEventdata || !detailUserEventdata.data || detailUserEventdata.data.length === 0) {
            return <tr><td colSpan="9">ยังไม่มีข้อมูลนักศึกษา</td></tr>;
        }

        return detailUserEventdata.data.map((data, index) => {
            const totalPoints = data?.total_point ?? 0;
            const totalMinutes = totalPoints * 6; // 1 คะแนน = 6 นาที
            const hours = Math.floor(totalMinutes / 60); // จำนวนชั่วโมง
            const minutes = totalMinutes % 60; // จำนวนนาที

            // แสดงผลในรูปแบบ "X ชั่วโมง Y นาที"
            const timeDisplay = `${hours} ชม ${minutes} นาที`;

            return (
                <tr key={data.id}>
                    <td>{index + 1}</td>
                    <td>{data.activityName}</td>
                    <td>
                        {data.startDate ? format(new Date(data.startDate), "d MMM yyyy", { locale: th })
                            : '-'
                        }
                    </td>
                    <td>
                        {data?.activityDurationString}
                    </td>
                    <td>
                        <button
                            className='hover:bg-gray-300 h-8 w-8 p-1 rounded-md'
                            onClick={() => openImageModal(data.registrationImages)}
                        >
                            {image}
                        </button>
                    </td>
                </tr>
            );
        });
    };

    const renderspecailEvents = () => {
        if (loading) {
            return <tr><td colSpan="9">Loading...</td></tr>;
        }

        if (error) {
            return <tr><td colSpan="9">Error: {error}</td></tr>;
        }

        if (!detailUserdata || !detailUserdata.data || detailUserdata.data.length === 0) {
            return <tr><td colSpan="9">ยังไม่มีข้อมูลนักศึกษา</td></tr>;
        }

        return detailUserdata.data.map((data, index) => {
            const totalPoints = data?.total_point ?? 0;
            const totalMinutes = totalPoints * 6; // 1 คะแนน = 6 นาที
            const hours = Math.floor(totalMinutes / 60); // จำนวนชั่วโมง
            const minutes = totalMinutes % 60; // จำนวนนาที

            // แสดงผลในรูปแบบ "X ชั่วโมง Y นาที"
            const timeDisplay = `${hours} ชม ${minutes} นาที`;

            return (
                <tr key={data.id}>
                    <td>{index + 1}</td>
                    <td>{data.event_name}</td>
                    <td>กิจกรรมพิเศษ</td>
                    <td>
                        {data.created_at ? format(new Date(data.created_at), "d MMM yyyy", { locale: th })
                            : '-'
                        }
                    </td>
                    <td>
                        <button
                            className='hover:bg-gray-300 h-8 w-8 p-1 rounded-md'
                            onClick={() => openImageModal(data.images)}
                        >
                            {image}
                        </button>
                    </td>
                    {currentUser?.role === 'special' && 
                        <td>
                            <div className="flex justify-center gap-1">
                                <select className='border border-gray-400 p-1 rounded-md' name="" id="">
                                    <option selected value="">เลือกประเภท</option>
                                    <option value="">กิจกรรมภายใน</option>
                                    <option value="">กิจกรรมภายนอก</option>
                                    <option value="">กิจกรรมออนไลน์</option>
                                </select>
                                <button className='border border-gray-400 rounded-md text-gray-400 p-1'>ปฏิเสธ</button>
                            </div>

                        </td>
                        }
                </tr>
            );
        });
    };

    const renderspecailUser = () => {
        if (loading) {
            return <tr><td colSpan="9">Loading...</td></tr>;
        }

        if (error) {
            return <tr><td colSpan="9">Error: {error}</td></tr>;
        }

        if (!detailspecialdata || !detailspecialdata.data || detailspecialdata.data.length === 0) {
            return <tr><td colSpan="9">ยังไม่มีข้อมูลนักศึกษา</td></tr>;
        }

        return detailspecialdata.data.map((data, index) => {
            const totalPoints = data?.total_point ?? 0;
            const totalMinutes = totalPoints * 6; // 1 คะแนน = 6 นาที
            const hours = Math.floor(totalMinutes / 60); // จำนวนชั่วโมง
            const minutes = totalMinutes % 60; // จำนวนนาที

            // แสดงผลในรูปแบบ "X ชั่วโมง Y นาที"
            const timeDisplay = `${hours} ชม ${minutes} นาที`;

            return (
                <tr key={data.id}>
                    <td>{index + 1}</td>
                    <td >{data.event_name}</td>
                    <td className='text-center'>{data.scores_type}</td>
                    <td>
                        {data.created_at ? format(new Date(data.created_at), "d MMM yyyy", { locale: th })
                            : '-'
                        }
                    </td>
                    <td>
                        <button
                            className='hover:bg-gray-300 h-8 w-8 p-1 rounded-md'
                            onClick={() => openImageModal(data.images)}
                        >
                            {image}
                        </button>
                    </td>
                    {user.st_tpye === 'กยศ.' && 
                        <td>
                            {data.status === 'รอดำเนินการ' ?
                            <div className="flex justify-center gap-2">
                                <button 
                                    className='border border-green-600  rounded-md text-green-600  p-2'
                                    onClick={() => handleApprove(data.id)}
                                >
                                    อนุมัติ
                                </button>
                                <button 
                                    className='border border-red-400 rounded-md text-red-400 p-2'
                                    onClick={() => handleReject(data.id)}
                                >
                                    ไม่อนุมัติ
                                </button>
                            </div>:
                            data.status === 'อนุมัติ' ?
                            <p className='w-8 h-8'>{iconCorrect}</p>:
                            data.status === 'ไม่อนุมัติ' ?
                            <p className='w-8 h-8'>{iconWrong}</p>: null
                            }

                        </td>
                        }
                </tr>
            );
        });
    };

    const iconCorrect = 
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="green" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
        </svg>;
    const iconWrong = 
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="red" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="m8.99 14.993 6-6m6 3.001c0 1.268-.63 2.39-1.593 3.069a3.746 3.746 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043 3.745 3.745 0 0 1-3.068 1.593c-1.268 0-2.39-.63-3.068-1.593a3.745 3.745 0 0 1-3.296-1.043 3.746 3.746 0 0 1-1.043-3.297 3.746 3.746 0 0 1-1.593-3.068c0-1.268.63-2.39 1.593-3.068a3.746 3.746 0 0 1 1.043-3.297 3.745 3.745 0 0 1 3.296-1.042 3.745 3.745 0 0 1 3.068-1.594c1.268 0 2.39.63 3.068 1.593a3.745 3.745 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.297 3.746 3.746 0 0 1 1.593 3.068ZM9.74 9.743h.008v.007H9.74v-.007Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm4.125 4.5h.008v.008h-.008v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
        </svg>;
    
    

    if (!isOpen || !user) return null;
    return (
        <div className="modalD">
            <div className="modal-contentD">
                <div className="">
                    {/* <span className="close" onClick={onClose}>&times;</span> */}
                    <h2 className='font-bold text-xl mb-2'>รายละเอียดนักศึกษา</h2>
                    <div className="pl-2 grid grid-cols-2 gap-2">
                        <label>รหัสนักศึกษา : <p className='border border-gray-400 p-1 rounded-md'>{user.user_code}</p></label>
                        <label>ชื่อ - นามสกุล : <p className='border border-gray-400 p-1 rounded-md'>{user.first_name} {user.last_name}</p></label>
                        <label>คณะ : <p className='border border-gray-400 p-1 rounded-md'>{user.group_st}</p></label>
                        <label>สาขา : <p className='border border-gray-400 p-1 rounded-md'>{user.branch_st}</p></label>
                        <label>ประเภทนักศึกษา : <p className='border border-gray-400 p-1 rounded-md'>{user.st_tpye}</p></label>
                    </div>
                </div>
                <div className="flex gap-2 my-2">
                    <button className={`${activeBtn === 'กิจกรรม' ? 'active' : ''}`} onClick={() => setactiveBtn('กิจกรรม')}>กิจกรรม</button>
                    
                    <button className={`${activeBtn === 'กิจกรรมพิเศษ' ? 'active' : ''}`} onClick={() => setactiveBtn('กิจกรรมพิเศษ')}>{user.st_tpye === 'กยศ.' ? 'กิจกรรมจิตอาสา' : 'กิจกรรมพิเศษ' }</button>

                </div>

                {activeBtn === 'กิจกรรม' ? <>
                <div className="overflow-auto h-[30vh]">
                    <table className='table'>
                        <thead>
                            <tr>
                                <th>ลำดับ</th>
                                <th>กิจกรรม</th>
                                <th>วันที่เริมกิจกรรม</th>
                                <th>ชม. กิจกรรม</th>
                                <th>รูปภาพ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {renderEvents()}
                        </tbody>
                    </table>
                </div>
                    {detailUserEventdata.meta?.total >= 10 &&
                        <div className="flex justify-end mt-10">
                            <ReactPaginate
                                previousLabel={"<"}
                                nextLabel={">"}
                                breakLabel={"..."}
                                pageCount={detailUserEventdata.meta?.last_page || 1}
                                marginPagesDisplayed={2}
                                pageRangeDisplayed={3}
                                onPageChange={handlePageChange2}
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

                </>:
                <>
                <div className="overflow-auto h-[30vh]">
                    <table className='table'>
                        <thead>
                            <tr>
                                <th>ลำดับ</th>
                                <th>กิจกรรม</th>
                                <th>ประเภทกิจกรรม</th>
                                <th>วันที่เพิ่มกิจกรรม</th>
                                <th>รูปภาพ</th>
                                {user.st_tpye === 'กยศ.' && <th>จัดการ</th> }
                            </tr>
                        </thead>

                        <tbody>
                            {user.st_tpye !== 'กยศ.' ?
                                renderspecailEvents():
                                renderspecailUser()
                            }
                        </tbody>

                    </table>
                </div>
                {user.st_tpye !== 'กยศ.' ?<>
                    {detailUserdata.meta?.total >= 10 &&
                        <div className="flex justify-end mt-10">
                            <ReactPaginate
                                previousLabel={"<"}
                                nextLabel={">"}
                                breakLabel={"..."}
                                pageCount={detailUserdata.meta?.last_page || 1}
                                marginPagesDisplayed={2}
                                pageRangeDisplayed={3}
                                onPageChange={handlePageChange2}
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
                    }</>:
                    <>
                    {detailspecialdata.meta?.total >= 10 &&
                        <div className="flex justify-end mt-10">
                            <ReactPaginate
                                previousLabel={"<"}
                                nextLabel={">"}
                                breakLabel={"..."}
                                pageCount={detailspecialdata.meta?.last_page || 1}
                                marginPagesDisplayed={2}
                                pageRangeDisplayed={3}
                                onPageChange={handlePageChange2}
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
                    </>
                     }
                </>
                }

                <ModalImage
                    images={selectedImages}
                    isOpen={isImageModalOpen}
                    onClose={closeImageModal}
                />

                

                <div className="flex justify-end mt-5">
                    <button onClick={onClose} className='border border-black text-black py-1 rounded-md px-2 hover:bg-gray-400'>
                        ปิด
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UserDetailModal;
