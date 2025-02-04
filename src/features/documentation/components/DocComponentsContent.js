import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setPageTitle, showNotification } from '../../common/headerSlice'
import TitleCard2 from '../../../components/Cards/TiileCard2'
import { getReward, updateReward, createReward, DeleteReward } from '../../../components/common/userSlice'
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import RewardModal from './ModalReward/RewardModal'
import Swal from 'sweetalert2'
import ReactPaginate from 'react-paginate';

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

function DocComponentsContent() {
    const dispatch = useDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [selectedImageUrl, setSelectedImageUrl] = useState('');

    // State formData สำหรับ create / edit
    const [formData, setFormData] = useState({
        reward_name: '',
        points_required: '',
        amount: '',
        images: '',
        can_redeem: true, // ค่าเริ่มต้น
    });

    const rewardData = useSelector(state => state.user.getRewardData);
    const loading = useSelector(state => state.user.loading);
    const error = useSelector(state => state.user.error);

    const [currentPage, setCurrentPage] = useState(1);

    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected + 1);
    };

    const handleOpenImage = (imageUrl) => {
        setSelectedImageUrl(imageUrl);
        setIsImageModalOpen(true);
    };

    const handleCloseImage = () => {
        setIsImageModalOpen(false);
        setSelectedImageUrl('');
    };

    useEffect(() => {
        dispatch(getReward(currentPage))
    }, [dispatch, currentPage])

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        // เคลียร์ค่า หรือคงค่าเดิมก็ได้
        setFormData({
            reward_name: '',
            points_required: '',
            amount: '',
            images: '',
            can_redeem: true,
        })
    };

    /* -------------------- CREATE -------------------- */
    const handleOpenCreateReward = () => {
        setIsEditMode(false);
        setFormData({
            reward_name: '',
            points_required: '',
            amount: '',
            images: '',
            can_redeem: true,
        });
        setIsModalOpen(true);
    };

    /* -------------------- EDIT -------------------- */
    const handleOpenEditReward = (data) => {
        setIsEditMode(true);
        setFormData({
            reward_name: data.reward_name || '',
            points_required: data.points_required || 0,
            amount: data.amount || 0,
            images:data.rewardUrl[0] || [], // Clear previous images when editing
            can_redeem: data.can_redeem || false,
            id: data.id, 
        });
        setIsModalOpen(true);
    };
    

    /* -------------------- DELETE -------------------- */
    const handleDeleteReward = (rewardID) => {
        // ใช้ SweetAlert2 แทน window.confirm
        Swal.fire({
            title: 'คุณต้องการลบของรางวัลนี้หรือไม่?',
            text: "หากลบแล้วจะไม่สามารถกู้คืนได้",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',  // ปุ่มยืนยันสีแดง
            cancelButtonColor: '#3085d6', // ปุ่มยกเลิกสีฟ้า
            confirmButtonText: 'ใช่, ลบเลย',
            cancelButtonText: 'ยกเลิก'
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(DeleteReward({ rewardID }))
                    .unwrap()
                    .then(() => {
                        Swal.fire({
                            icon: 'success',
                            title: 'ลบของรางวัลสำเร็จ',
                            showConfirmButton: false,
                            timer: 1500,
                        })
                        dispatch(getReward(currentPage));
                    })
                    .catch(err => {
                        console.error(err);
                        Swal.fire({
                            icon: 'error',
                            title: 'เกิดข้อผิดพลาดในการลบของรางวัล',
                            text: err?.message || 'กรุณาลองใหม่อีกครั้ง',
                            showConfirmButton: false,
                            timer: 2000
                        })
                    })
            }
        })
    };

    /* -------------------- SUBMIT (CREATE/EDIT) -------------------- */
    const handleSubmitModal = () => {
        if (!formData.reward_name || !formData.points_required || !formData.amount) {
            Swal.fire({
                icon: 'error',
                title: 'ข้อมูลไม่ครบถ้วน',
                text: 'กรุณากรอกข้อมูลให้ครบทุกช่อง',
                showConfirmButton: false,
                timer: 1500
            });
            return;
        }
    
        // Create FormData for file uploads
        const formDataToSend = new FormData();
        formDataToSend.append('reward_name', formData.reward_name);
        formDataToSend.append('points_required', formData.points_required);
        formDataToSend.append('amount', formData.amount);
        formDataToSend.append('can_redeem', formData.can_redeem);
    
        // Append files (multiple files if present)
        if (formData.images && formData.images.length > 0) {
            formData.images.forEach((file) => {
                formDataToSend.append('images', file);  // Append each file
            });
        } else {
            console.log('No images to append');
        }

        console.log([...formDataToSend]);
    
        // If we are in edit mode, we are updating an existing reward
        if (isEditMode) {
            if (!formData.id) {
                Swal.fire({
                    icon: 'error',
                    title: 'ไม่พบ ID ของรางวัล',
                    text: 'ไม่สามารถแก้ไขได้',
                    showConfirmButton: false,
                    timer: 1500
                });
                return;
            }
    
            const { id, ...rest } = formData; // Extract id, leave rest of the fields as is
            dispatch(updateReward({ rewardID: id, formData: formDataToSend }))
                .unwrap()
                .then(() => {
                    Swal.fire({
                        icon: 'success',
                        title: 'แก้ไขของรางวัลสำเร็จ',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    dispatch(getReward(currentPage)); // Reload rewards
                    closeModal();
                })
                .catch((err) => {
                    console.error(err);
                    Swal.fire({
                        icon: 'error',
                        title: 'เกิดข้อผิดพลาดในการแก้ไขของรางวัล',
                        text: err?.message || 'ไม่สามารถแก้ไขของรางวัลได้',
                        showConfirmButton: false,
                        timer: 2000
                    });
                });
        } else {
            // Otherwise, create a new reward
            dispatch(createReward({ formData: formDataToSend }))
                .unwrap()
                .then(() => {
                    Swal.fire({
                        icon: 'success',
                        title: 'เพิ่มของรางวัลสำเร็จ',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    dispatch(getReward(currentPage)); // Reload rewards
                    closeModal();
    
                    // Send notification
                    const currentDate = new Date();
                    const formattedDate = currentDate.toLocaleDateString('th-TH', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                    });
                    dispatch(showNotification({
                        message: `เพิ่มของรางวัลใหม่แล้วในวันที่ ${formattedDate}`,
                        status: 1
                    }));
                })
                .catch((err) => {
                    console.error(err);
                    Swal.fire({
                        icon: 'error',
                        title: 'เกิดข้อผิดพลาดในการเพิ่มของรางวัล',
                        text: err?.message || 'ไม่สามารถเพิ่มของรางวัลได้',
                        showConfirmButton: false,
                        timer: 2000
                    });
                });
        }
    };

    /* -------------------- RENDER TABLE -------------------- */
    const renderReward = () => {
        if (loading) {
            return <tr><td colSpan="9">Loading...</td></tr>;
        }
        if (error) {
            return <tr><td colSpan="9">Error: {error}</td></tr>;
        }
        if (!rewardData || !rewardData.data || rewardData.data.length === 0) {
            return <tr><td colSpan="9">ยังไม่มีข้อมูลของรางวัล</td></tr>;
        }

        return (
            <>
                {rewardData.data.map((data, index) => (
                    <tr key={data.id}>
                        <td>{index + 1}</td>
                        <td>{data.reward_name}</td>
                        <td>{data.amount}</td>
                        <td className='flex justify-center items-center'>
                            <img
                                src={data.rewardUrl}
                                alt=""
                                className='w-5 h-5 cursor-pointer'
                                onClick={() => handleOpenImage(data.rewardUrl)}
                            />
                        </td>
                        <td>
                            {data.created_at
                                ? format(new Date(data.created_at), "d MMM yyyy", { locale: th })
                                : '-'
                            }
                        </td>
                        <td>
                            <div className="flex gap-4 justify-center items-center">
                                <span
                                    className="cursor-pointer"
                                    onClick={() => handleOpenEditReward(data)}
                                >
                                    {iconF1}
                                </span>
                                <span
                                    className="cursor-pointer text-red-500"
                                    onClick={() => handleDeleteReward(data.id)}
                                >
                                    {iconF3}
                                </span>
                            </div>
                        </td>
                    </tr>
                ))}
            </>
        );
    };

    /* -------------------- BTN ด้านบน (เพิ่มของรางวัล) -------------------- */
    const createBTN = (
        <button
            onClick={handleOpenCreateReward}
            className='btn text-white bg-[#FF9C00] hover:bg-yellow-600'
        >
            เพิ่มของรางวัล
        </button>
    );

    return (
        <>
            <TitleCard2
                title={'รางวัล'}
                subTitle={`ทั้งหมด ${rewardData?.data?.length || 0} รายการ`}
                TopSideButtons={createBTN}
            >
                <table className='table text-center'>
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>ชื่อของรางวัล</th>
                            <th>จำนวน (ชิ้น / อัน)</th>
                            <th>รูปของรางวัล</th>
                            <th>วันที่ได้เพิ่ม</th>
                            <th>จัดการ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderReward()}
                    </tbody>
                </table>
                {rewardData?.meta?.total >= 10 &&
                        <div className="flex justify-end mt-10">
                            <ReactPaginate
                                previousLabel={"<"}
                                nextLabel={">"}
                                breakLabel={"..."}
                                pageCount={rewardData?.meta?.last_page || 1}
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

            {isImageModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-4 rounded shadow max-w-[90%] max-h-[90%] flex flex-col items-center">
                        {/* รูปใหญ่ */}
                        <img
                            src={selectedImageUrl}
                            alt="Enlarged Reward"
                            className="max-h-[80vh] object-contain"
                        />
                        {/* ปุ่มปิด */}
                        <button
                            onClick={handleCloseImage}
                            className="btn mt-4"
                        >
                            ปิด
                        </button>
                    </div>
                </div>
            )}

            <RewardModal
                isOpen={isModalOpen}
                onClose={closeModal}
                isEditMode={isEditMode}
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleSubmitModal}
            />
        </>
    )
}

export default DocComponentsContent