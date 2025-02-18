import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDetailUser, getDetailUseruserEvent } from '../../../components/common/userSlice';
import './ModalDetail.css'
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import ModalImage from './ModalImage';
import ReactPaginate from 'react-paginate';

function UserDetailModal({ user, isOpen, onClose }) {
    const dispatch = useDispatch()
    const detailUserdata = useSelector((state) => state.user.getDetailUserData);
    const detailUserEventdata = useSelector((state) => state.user.getDetailUseruserEventData);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentPage2, setCurrentPage2] = useState(1);
    const loading = useSelector(state => state.user.loading);
    const error = useSelector(state => state.user.error);
    const [activeBtn, setactiveBtn] = useState('กิจกรรม');
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);

    const openImageModal = (images) => {
        setSelectedImages(images);
        setIsImageModalOpen(true);
    };

    const closeImageModal = () => {
        setIsImageModalOpen(false);
        setSelectedImages([]);
    };

    useEffect(() => {
        dispatch(getDetailUser({ page: currentPage, userID: user?.customer_id }))
        dispatch(getDetailUseruserEvent({ page: currentPage2, userID: user?.customer_id }))
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
                        {data?.pointsEarned}
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
                </tr>
            );
        });
    };

    if (!isOpen || !user) return null;
    return (
        <div className="modalD">
            <div className="modal-contentD">
                <div className="">
                    {/* <span className="close" onClick={onClose}>&times;</span> */}
                    <h2 className='font-bold text-xl mb-2'>รายละเอียดนักศึกษา</h2>
                    <div className="pl-2">
                        <p>รหัสนักศึกษา: {user.user_code}</p>
                        <p>ชื่อ - นามสกุล: {user.first_name} {user.last_name}</p>
                        <p>คณะ: {user.group_st}</p>
                        <p>สาขา: {user.branch_st}</p>
                    </div>
                </div>
                <div className="flex gap-2 my-2">
                    <button className={`${activeBtn === 'กิจกรรม' ? 'active' : ''}`} onClick={() => setactiveBtn('กิจกรรม')}>กิจกรรม</button>
                    <button className={`${activeBtn === 'กิจกรรมพิเศษ' ? 'active' : ''}`} onClick={() => setactiveBtn('กิจกรรมพิเศษ')}>กิจกรรมพิเศษ</button>
                </div>

                {activeBtn === 'กิจกรรม' ? <>
                <div className="overflow-auto h-[30vh]">
                    <table className='table'>
                        <thead>
                            <tr>
                                <th>ลำดับ</th>
                                <th>กิจกรรม</th>
                                <th>วันที่เริมกิจกรรม</th>
                                <th>คะแนน</th>
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
                                <th>วันที่เริมกิจกรรม</th>
                                <th>รูปภาพ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {renderspecailEvents()}
                        </tbody>
                    </table>
                </div>
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
