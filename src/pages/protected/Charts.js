import ReactPaginate from 'react-paginate';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getNormal } from '../../components/common/userSlice'
import { setPageTitle } from '../../features/common/headerSlice'
import Integration from '../../features/integration'
import TitleCard2 from '../../components/Cards/TiileCard2'
import UserDetailModal from './ModalDetailUser/UserDetailModal'

function InternalPage() {
    const dispatch = useDispatch()
    const [currentPage, setCurrentPage] = useState(1);
    const eventData = useSelector(state => state.user.getNormalsData);
    const loading = useSelector(state => state.user.loading);
    const error = useSelector(state => state.user.error);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const openModal = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
    };

    useEffect(() => {
        dispatch(setPageTitle({ title: "รายชื่อนักศึกษา ทั่วไป" }))
    }, [])

    useEffect(() => {
        dispatch(getNormal(currentPage))
    }, [dispatch])

    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected + 1);
    };

    const renderEvents = () => {
        if (loading) {
            return <tr><td colSpan="9">Loading...</td></tr>;
        }

        if (error) {
            return <tr><td colSpan="9">Error: {error}</td></tr>;
        }

        if (!eventData || !eventData.data || eventData.data.length === 0) {
            return <tr><td colSpan="9">ยังไม่มีข้อมูลนักศึกษา</td></tr>;
        }

        return eventData.data.map((data, index) => {
            const totalPoints = data?.total_point ?? 0;
            const totalMinutes = totalPoints * 6; // 1 คะแนน = 6 นาที
            const hours = Math.floor(totalMinutes / 60); // จำนวนชั่วโมง
            const minutes = totalMinutes % 60; // จำนวนนาที

            // แสดงผลในรูปแบบ "X ชั่วโมง Y นาที"
            const timeDisplay = `${hours} ชม ${minutes} นาที`;

            return (
                <tr key={data.id}>
                    <td>{index + 1}</td>
                    <td>{data.user_code}</td>
                    <td>
                        <p>{data.first_name} {data.last_name}</p>
                    </td>
                    <td>
                        {data?.group_st}
                    </td>
                    <td>
                        {data?.branch_st}
                    </td>
                    <td>
                        {data?.total_point ?? '0'}
                    </td>
                    <td>
                        {timeDisplay}
                    </td>
                    <td>
                        <button
                            className='border border-orange-400 rounded-md text-orange-400 p-1 hover:bg-orange-400 hover:text-white'
                            onClick={() => openModal(data)}
                        >
                            ดูรายละเอียด
                        </button>
                    </td>
                </tr>
            );
        });
    };

    return (
        <TitleCard2 title={'นักศึกษา ทั่วไป'} subTitle={`ทั้งหมด ${eventData?.meta?.total} รายการ`}>
            <div className="overflow-auto h-[50vh]">
                <table className='table text-center'>
                    <thead className=''>
                        <tr>
                            <th>No.</th>
                            <th>รหัสนักศึกษา</th>
                            <th>ชื่อ - นามสกุล</th>
                            <th>คณะ</th>
                            <th>สาขา</th>
                            <th>คะแนน</th>
                            <th>เวลาที่เข้าร่วม</th>
                            <th>เพิ่มเติม</th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderEvents()}
                    </tbody>
                </table>
            </div>
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

            <UserDetailModal
                user={selectedUser}
                isOpen={isModalOpen}
                onClose={closeModal}
            />

        </TitleCard2>
    )
}

export default InternalPage