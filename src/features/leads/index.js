import { useEffect , useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import TitleCard from "../../components/Cards/TitleCard"
import AdminModal from "./ModalTeam/AdminModal"
import { getAdmin , createAdmin , updateadmin , Deleteadmin } from "../../components/common/userSlice"
import Swal from 'sweetalert2'    
import ReactPaginate from 'react-paginate';

const TopSideButtons = ({ onAddNew }) => {
    return(
      <div className="inline-block float-right">
        <button 
          className="btn px-6 btn-sm normal-case btn-primary" 
          onClick={onAddNew}
        >
          เพิ่มผู้ดูแล
        </button>
      </div>
    )
  }

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

function Leads() {
    const dispatch = useDispatch()
    
    const getadminData = useSelector(state => state.user.getAdminData);
    const loading = useSelector(state => state.user.loading);
    const error = useSelector(state => state.user.error);
  
    // -- State สำหรับ Modal --
    const [openModal, setOpenModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [formData, setFormData] = useState({
      username: '',
      password: '',
      firstname: '',
      lastname: ''
    });
  
    // -- State สำหรับการจัดการหน้า Pagination --
    const [currentPage, setCurrentPage] = useState(1);
  
    const handlePageChange = ({ selected }) => {
      setCurrentPage(selected + 1);
    };
  
    useEffect(() => {
      dispatch(getAdmin(currentPage));
    }, [dispatch, currentPage]);
  
    // -- ฟังก์ชันเปิด Modal เพื่อเพิ่มผู้ดูแลใหม่ --
    const handleAddNewAdmin = () => {
      setIsEditMode(false);
      setFormData({
        username: '',
        password: '',
        firstname: '',
        lastname: ''
      });
      setOpenModal(true);
    }
  
    // -- ฟังก์ชันเปิด Modal เพื่อแก้ไขผู้ดูแล --
    const handleEditAdmin = (adminData) => {
      setIsEditMode(true);
      setFormData({
        username: adminData.username,
        password: '',  // สามารถให้กรอกใหม่ หรือเว้นว่างไว้ก่อน
        firstname: adminData.firstname || '',
        lastname: adminData.lastname || ''
      });
      setOpenModal(true);
      // เก็บ ID ใน formData
      setFormData(prev => ({ ...prev, id: adminData.id }))
    }
  
    // -- ฟังก์ชันกดปุ่ม Delete --
    const handleDeleteAdmin = (adminID) => {
      // ใช้ SweetAlert2 แทน window.confirm
      Swal.fire({
        title: 'คุณต้องการลบผู้ดูแลคนนี้หรือไม่?',
        text: "ลบแล้วไม่สามารถกู้คืนข้อมูลได้",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'ใช่, ต้องการลบ!',
        cancelButtonText: 'ยกเลิก'
      }).then((result) => {
        if (result.isConfirmed) {
          dispatch(Deleteadmin({ adminID }))
            .then(() => {
              // โหลดข้อมูลใหม่
              dispatch(getAdmin(currentPage));
  
              // แจ้งเตือนลบสำเร็จ
              Swal.fire({
                icon: 'success',
                title: 'ลบผู้ดูแลสำเร็จ',
                showConfirmButton: false,
                timer: 1500
              })
            })
            .catch((error) => {
              Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาดในการลบผู้ดูแล',
                text: error.message || 'กรุณาลองใหม่อีกครั้ง',
                showConfirmButton: false,
                timer: 2000
              })
            })
        }
      })
    }
  
    // -- ฟังก์ชันส่งข้อมูลเมื่อกด "บันทึก" ใน Modal --
    const handleSubmitModal = () => {
      if(isEditMode){
        // กรณีแก้ไข
        if(!formData.id){
          Swal.fire({
            icon: 'error',
            title: 'ไม่พบ ID ผู้ดูแล',
            text: 'ไม่สามารถแก้ไขได้',
            showConfirmButton: false,
            timer: 1500
          })
          return;
        }
        const adminID = formData.id;
        const { id, ...rest } = formData;  // แยก id ออกไม่ให้ปนใน formData
        dispatch(updateadmin({ adminID, formData: rest }))
          .unwrap()
          .then(() => {
            Swal.fire({
              icon: 'success',
              title: 'แก้ไขข้อมูลสำเร็จ',
              showConfirmButton: false,
              timer: 1500
            })
            setOpenModal(false);
            dispatch(getAdmin(currentPage));
          })
          .catch((err) => {
            Swal.fire({
              icon: 'error',
              title: 'เกิดข้อผิดพลาดในการแก้ไขข้อมูล',
              text: err?.message || '',
              showConfirmButton: false,
              timer: 2000
            })
          })
      } else {
        // กรณีสร้างใหม่
        dispatch(createAdmin({ formData }))
          .unwrap()
          .then(() => {
            Swal.fire({
              icon: 'success',
              title: 'เพิ่มผู้ดูแลใหม่สำเร็จ',
              showConfirmButton: false,
              timer: 1500
            })
            setOpenModal(false);
            dispatch(getAdmin(currentPage));
          })
          .catch((err) => {
            Swal.fire({
              icon: 'error',
              title: 'เกิดข้อผิดพลาดในการเพิ่มผู้ดูแล',
              text: err?.message || '',
              showConfirmButton: false,
              timer: 2000
            })
          })
      }
    }
  
    // -- Render รายการผู้ดูแลในตาราง --
    const renderAdmin = () => {
      if (loading) {
        return <tr><td colSpan="9">Loading...</td></tr>;
      }
      if (error) {
        return <tr><td colSpan="9">Error: {error}</td></tr>;
      }
      if (!getadminData || !getadminData.data || getadminData.data.length === 0) {
        return <tr><td colSpan="9">ยังไม่มีข้อมูลผู้ดูแล</td></tr>;
      }
      
      return (
        <>
          {getadminData.data.map((data, index) => (
            <tr key={data.id}>
              <td>{index + 1}</td>
              <td>{data.id}</td>
              <td>{data.username}</td>
              <td><p>{data.firstname} {data.lastname}</p></td>
              <td>{data.role === 'normal' ? 'ทั่วไป' : 'กยศ.'}</td>
              <td>
                <div className="flex gap-4">
                  {/* ไอคอนแก้ไข: กดแล้วเปิด Modal พร้อมข้อมูล */}
                  <span 
                    className="cursor-pointer" 
                    onClick={() => handleEditAdmin(data)}
                  >
                    {iconF1}
                  </span>
  
                  {/* ไอคอนลบ: กดแล้วเรียก Delete */}
                  <span 
                    className="cursor-pointer text-red-500" 
                    onClick={() => handleDeleteAdmin(data.id)}
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
  
    return (
      <>
        <TitleCard 
          title="รายชื่อผู้ดูแล" 
          topMargin="mt-2" 
          TopSideButtons={
            <TopSideButtons onAddNew={handleAddNewAdmin} />
          }
        >
          <div className="overflow-x-auto w-full">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>ลำดับ</th>
                  <th>รหัสผู้ดูแล</th>
                  <th>ชื่อผู้ใช้</th>
                  <th>ชื่อ - นามสกุล</th>
                  <th>ตำแหน่ง</th>
                  <th>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                { renderAdmin() }
              </tbody>
            </table>
          </div>
            {getadminData?.meta?.total >= 10 &&
                        <div className="flex justify-end mt-10">
                            <ReactPaginate
                                previousLabel={"<"}
                                nextLabel={">"}
                                breakLabel={"..."}
                                pageCount={getadminData?.meta?.last_page || 1}
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
        </TitleCard>
  
        {/* Modal สำหรับเพิ่ม/แก้ไขผู้ดูแล */}
        <AdminModal
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
          isEditMode={isEditMode}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmitModal}
        />
      </>
    )
  }
  
  export default Leads