import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactPaginate from 'react-paginate';
import './leaflet2.css';
import './ModalCA2.css';
import { getEventDetail } from '../../../components/common/userSlice';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import TitleCard2 from '../../../components/Cards/TiileCard2';

export default function ModalHDetail({ onClose , eventID }) {
    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(1);
    const eventDataDe = useSelector(state => state.user.getEventDetailsData); 
    const currentUser = useSelector(state => state.user.currentUser);
    const loading = useSelector(state => state.user.loading);
    const error = useSelector(state => state.user.error);
    
    useEffect(()=>{
        dispatch(getEventDetail({page:currentPage , eventID }))
    },[dispatch])

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
    
        if (!eventDataDe || !eventDataDe.data || !Array.isArray(eventDataDe.data.listST) || eventDataDe.data.listST.length === 0) {
            return <tr><td colSpan="9">ยังไม่มีข้อมูลกิจกรรม</td></tr>;
        }
    
        return eventDataDe.data.listST.map((data, index) => (
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
                    <span className='whitespace-nowrap'
                        style={{
                            backgroundColor: data?.status === 'กำลังเข้าร่วม' ? 'orange' :data?.status === 'เข้าร่วมสำเร็จ' ? 'green' : 'red',
                            color: '#fff',
                            padding: '4px 8px',
                            borderRadius: '6px',
                        }}
                    >
                        {data?.status}
                    </span>
                </td>
            </tr>
        ));
    };
    
    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-header">
                    รายละเอียด
                    <div className="my-2 grid grid-cols-2 text-[1rem] justify-center text-left gap-2">
                        <label className='text-black font-normal'>กิจกรรม 
                            <div className="border border-gray-300 p-1 rounded-md">
                                {eventDataDe.data.activityName}
                            </div>
                        </label>
                        <label className='text-black font-normal'>
                            ระดับการศึกษา 
                            <div className="border border-gray-300 p-1 rounded-md">
                                {eventDataDe.data.course || 'ไม่ระบุ'}
                            </div>
                        </label>
                        <label className='text-black font-normal grid'> วันที่ได้เริ่มต้น - วันที่สิ้นสุด 
                            <div className="flex gap-2 border border-gray-300 p-1 rounded-md">
                                {eventDataDe?.data?.startDate ? format(new Date(eventDataDe?.data?.startDate), "d MMM yyyy", { locale: th }) : '-'} - {eventDataDe?.data?.endDate ? format(new Date(eventDataDe?.data?.endDate), "d MMM yyyy", { locale: th }) : '-'}
                            </div>
                        </label>
                        <label className='text-black font-normal grid'> สถานที่จัดกิจกรรม
                            <div className="flex gap-2 border border-gray-300 p-1 rounded-md">
                                {eventDataDe?.data?.Nameplace}
                            </div>
                        </label>
                        <label className='text-black font-normal grid'> เวลาที่เริ่ม - เวลาที่สิ้นสุด 
                            <div className="flex gap-2 border border-gray-300 p-1 rounded-md">
                                {eventDataDe?.data?.startTime} - {eventDataDe?.data?.endTime}
                            </div>
                        </label>
                    </div>
                </div>
                <div className="modal-body ">
                <div className="grid justify-start">
                    <p>ทั้งหมด {eventDataDe?.data?.listST?.length} รายการ</p>
                </div>
                <div className="overflow-y-auto h-[50vh]">
                    <table className='table text-center'>
                        <thead className=''>
                            <tr>
                                <th>No.</th>
                                <th>รหัสรักศึกษา</th>
                                <th>ชื่อ - นามสกุล</th>
                                <th>คณะ</th>
                                <th>สาขา</th>
                                <th>สถานะ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {renderEvents()}
                        </tbody>
                    </table>
                </div>
                    {eventDataDe.meta?.total >= 10 &&
                            <div className="flex justify-end mt-10">
                                <ReactPaginate
                                    previousLabel={"<"}
                                    nextLabel={">"}
                                    breakLabel={"..."}
                                    pageCount={eventDataDe.meta?.last_page || 1}
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
                </div>
                <div className="flex justify-end">
                    <button onClick={onClose} className="btn border border-black bg-white">ปิด</button>
                </div>
            </div>
        </div>
    );
}
