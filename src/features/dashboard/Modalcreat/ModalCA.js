import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { showNotification } from '../../common/headerSlice';
import './leaflet.css';
import './ModalCA.css';
import InputText from '../../../components/Input/InputText';
import SelectBox from '../../../components/Input/SelectBox';
import { fetchCurrentUser, createEvent, SentMessage, getNormal , getSpecail } from '../../../components/common/userSlice';
import Swal from 'sweetalert2';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

export default function ModalCA({ onClose, onSave }) {
    const dispatch = useDispatch();
    const currentUser = useSelector(state => state.user.currentUser);
    const specialDataRaw = useSelector(state => state.user.getSpecailsData);
    const normalDataRaw = useSelector(state => state.user.getNormalsData);

    const specialUsers = specialDataRaw?.data?.map(item => ({
        lineUserId: item.customer_id,
        name: item.name,
        stType: item.st_tpye
      })) || [];
    
      const normalUsers = normalDataRaw?.data?.map(item => ({
        lineUserId: item.customer_id,
        name: item.name,
        stType: item.st_tpye
      })) || [];

    const [isMapVisible, setIsMapVisible] = useState(false);
    const [formValues, setFormValues] = useState({
        activityName: '',
        course: '',
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
        Nameplace: '',
        latitude: null,
        longitude: null,
        province: '',
        admin_id: currentUser?.adminID,
        event_type: '' // กำหนดเป็นค่าว่างเริ่มต้น
    });

    useEffect(()=>{
        dispatch(getSpecail())
        dispatch(getNormal())
    },[dispatch])

    useEffect(() => {
        if (!currentUser) {
            dispatch(fetchCurrentUser());
        } else {
            setFormValues((prevState) => ({
                ...prevState,
                admin_id: currentUser.adminID,
                event_type: currentUser.role !== 'super_admin' ? currentUser.role : '' // ถ้าไม่ใช่ super_admin กำหนด event_type จากบทบาท
            }));
        }
    }, [dispatch, currentUser]);

    const toggleMapVisibility = () => {
        setIsMapVisible(prev => !prev);
    };

    const handleSave = async () => {
        try {
          if (!formValues.admin_id) {
            console.error("Admin ID is missing");
            return;
          }
    
          // ถ้าเป็น super_admin แต่ยังไม่เลือก event_type
          if (currentUser?.role === 'super_admin' && !formValues.event_type) {
            Swal.fire({
              icon: 'warning',
              title: 'เลือกประเภทกิจกรรม',
              text: 'กรุณาเลือกประเภทกิจกรรม (ทั่วไป หรือ กยศ.)',
            });
            return;
          }
    
          // สร้างรูปแบบข้อความ
          const startDateFormatted = formValues.startDate
            ? format(new Date(formValues.startDate), "d MMM yyyy", { locale: th })
            : "วันที่ไม่ถูกต้อง";
          const startTimeFormatted = formValues.startTime
            ? format(new Date(`1970-01-01T${formValues.startTime}:00`), "HH:mm", { locale: th })
            : "เวลาไม่ถูกต้อง";
          const endTimeFormatted = formValues.endTime
            ? format(new Date(`1970-01-01T${formValues.endTime}:00`), "HH:mm", { locale: th })
            : "เวลาไม่ถูกต้อง";
    
          const messageText = `
            เชิญชวน นศ. ${formValues.event_type === 'special' ? 'กยศ.' : 'ทั่วไป'}
            เข้าร่วม ${formValues.activityName}
            จัดขึ้นในวันที่ ${startDateFormatted}
            เวลา ${startTimeFormatted} - ${endTimeFormatted}
            ณ ${formValues.Nameplace}
          `.trim();
    
          // 1) เรียก createEvent
          const createdResult = await dispatch(createEvent(formValues)).unwrap();
          console.log("สร้างกิจกรรมเสร็จ:", createdResult);
    
          // 2) แจ้งเตือนว่ากิจกรรมสร้างสำเร็จ
          const currentDate = new Date().toLocaleDateString('th-TH', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          });
          dispatch(showNotification({
            message: `ได้สร้างกิจกรรมสำเร็จแล้วในวันที่ ${currentDate}`,
            status: 1
          }));
    
          // 3) เลือกกลุ่มผู้ใช้
          const isSpecial = (formValues.event_type === 'special');
          const targetUsers = isSpecial ? specialUsers : normalUsers;
    
          // 4) ส่งข้อความให้ทีละคน
          const promises = targetUsers.map(user => {
            const updatedSentData = {
              to: user.lineUserId,
              messages: [
                {
                  type: 'text',
                  text: messageText
                }
              ]
            };
            return dispatch(SentMessage(updatedSentData));
          });
    
          await Promise.all(promises);
    
          // สุดท้ายปิด modal
          onSave();
        } catch (err) {
          console.error("Error creating event or sending messages:", err);
          Swal.fire({
            icon: 'error',
            title: 'สร้างกิจกรรมไม่สำเร็จ',
            text: 'กรุณากรอกข้อมูลให้ครบ หรือ ตรวจสอบการส่งข้อความอีกครั้ง'
          });
        }
      };

    const courses = [
        { value: 'ทุกระดับการศึกษา', name: 'ทุกระดับการศึกษา' },
        { value: 'ปวช.', name: 'ปวช.' },
        { value: 'ปวส', name: 'ปวส.' },
        { value: 'ป.ตรี', name: 'ป.ตรี' }
    ];

    const handleUpdateFormValue = ({ updateType, value }) => {
        setFormValues(prevState => ({
            ...prevState,
            [updateType]: value
        }));
    };

    useEffect(() => {
        // Get user's current position
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                setFormValues(prevState => ({
                    ...prevState,
                    latitude: lat,
                    longitude: lng
                }));
                getProvinceName(lat, lng);
            }, (error) => {
                console.error("Error obtaining location: ", error);
                const defaultLat = 16.87724352429937;
                const defaultLng = 99.12706375122072;
                setFormValues(prevState => ({
                    ...prevState,
                    latitude: defaultLat,
                    longitude: defaultLng
                }));
                getProvinceName(defaultLat, defaultLng);
            });
        } else {
            console.error("Geolocation is not supported by this browser.");
            const defaultLat = 16.87724352429937;
            const defaultLng = 99.12706375122072;
            setFormValues(prevState => ({
                ...prevState,
                latitude: defaultLat,
                longitude: defaultLng
            }));
            getProvinceName(defaultLat, defaultLng);
        }
    }, []);

    const getProvinceName = async (latitude, longitude) => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
            const data = await response.json();
            const address = data.address || {};
            const province = address.state || address.province || "Unknown";
            setFormValues(prevState => ({
                ...prevState,
                province: province
            }));
        } catch (error) {
            console.error("Error fetching province name: ", error);
        }
    };

    function LocationMarker() {
        useMapEvents({
            click(e) {
                const { lat, lng } = e.latlng;
                setFormValues(prevState => ({
                    ...prevState,
                    latitude: lat,
                    longitude: lng
                }));
                getProvinceName(lat, lng);
            }
        });

        return formValues.latitude !== null ? (
            <Marker position={[formValues.latitude, formValues.longitude]} />
        ) : null;
    }

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-header">
                    สร้างกิจกรรม
                </div>
                <div className="modal-body overflow-y-auto h-[50vh]">
                    <div className="grid grid-cols-2 gap-2 justify-center">
                        <InputText
                            labelTitle={'ชื่อกิจกรรม'}
                            type={'text'}
                            placeholder={'ชื่อกิจกรรม'}
                            updateFormValue={handleUpdateFormValue}
                            updateType="activityName"
                        />
                        <SelectBox
                            labelTitle={'ระดับการศึกษา'}
                            placeholder={'กรุณาเลือกระดับการศึกษา'}
                            options={courses}
                            updateFormValue={handleUpdateFormValue}
                            updateType='course'
                        />
                        <InputText
                            labelTitle={'วันที่เริ่มต้น'}
                            type={'date'}
                            placeholder={'เลือกวันที่เริ่มต้น'}
                            updateFormValue={handleUpdateFormValue}
                            updateType="startDate"
                        />
                        <InputText
                            labelTitle={'วันที่สิ้นสุด'}
                            type={'date'}
                            placeholder={'เลือกวันที่สิ้นสุด'}
                            updateFormValue={handleUpdateFormValue}
                            updateType="endDate"
                        />
                        <InputText
                            labelTitle={'เวลาที่เริ่มต้น'}
                            type={'time'}
                            placeholder={'เลือกเวลาที่เริ่มต้น'}
                            updateFormValue={handleUpdateFormValue}
                            updateType="startTime"
                        />
                        <InputText
                            labelTitle={'เวลาที่สิ้นสุด'}
                            type={'time'}
                            placeholder={'เลือกเวลาที่สิ้นสุด'}
                            updateFormValue={handleUpdateFormValue}
                            updateType="endTime"
                        />
                        {currentUser?.role === 'super_admin' && (
                            <SelectBox
                                labelTitle={'ประเภทกิจกรรม'}
                                placeholder={'กรุณาเลือกประเภทกิจกรรม'}
                                options={[
                                    { value: '', name: 'ประเภท' },
                                    { value: 'normal', name: 'ทั่วไป' },
                                    { value: 'special', name: 'กยศ.' }
                                ]}
                                updateFormValue={handleUpdateFormValue}
                                updateType='event_type'
                            />
                        )}
                    </div>
                    
                    <InputText
                        labelTitle={'ชื่อสถานที่จัดกิจกรรม'}
                        type={'text'}
                        placeholder={'ชื่อสถานที่จัดกิจกรรม'}
                        updateFormValue={handleUpdateFormValue}
                        updateType="Nameplace"
                    />

                    <button onClick={toggleMapVisibility} className="btn bg-white w-full text-black hover:bg-gray-200 mt-4">
                        {isMapVisible ? "ซ่อนแผนที่" : "แสดงแผนที่"}
                    </button>

                    {/* Display Leaflet Map */}
                    {isMapVisible && (
                        <div className="mt-4">
                            <h4>เลือกตำแหน่งที่ตั้ง: {formValues.province} </h4>
                            <MapContainer
                                center={[formValues.latitude || 16.87724352429937, formValues.longitude || 99.12706375122072]}
                                zoom={10}
                                style={{ height: "300px", width: "100%" }}
                            >
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <LocationMarker />
                            </MapContainer>
                        </div>
                    )}

                </div>
                <div className="flex justify-between">
                    <button onClick={onClose} className="btn border border-black bg-white">ยกเลิก</button>
                    <button onClick={handleSave} className="btn bg-[#FF8329] text-white hover:text-[#FF8329]">บันทึก</button>
                </div>
            </div>
        </div>
    );
}
