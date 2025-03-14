import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { showNotification } from '../../common/headerSlice';
import './leaflet.css';
import './ModalCA.css';
import InputText from '../../../components/Input/InputText';
import SelectBox from '../../../components/Input/SelectBox';
import { fetchCurrentUser, editEvent } from '../../../components/common/userSlice';
import Swal from 'sweetalert2';
import L from 'leaflet';

export default function ModalEditinfo({ onClose, onSave, userDetails, eventID }) {
    const dispatch = useDispatch();
    const currentUser = useSelector(state => state.user.currentUser);
    const [isMapVisible, setIsMapVisible] = useState(false);
    const mapRef = useRef();

    const formattedStartDate = userDetails?.startDate ? userDetails.startDate.split('T')[0] : '';
    const formattedEndDate = userDetails?.endDate ? userDetails.endDate.split('T')[0] : '';
    const formattedStartTime = userDetails?.startTime ? userDetails.startTime.slice(0, 5) : '';
    const formattedEndTime = userDetails?.endTime ? userDetails.endTime.slice(0, 5) : '';

    const [formValues, setFormValues] = useState({
        activityName: userDetails?.activityName || '',
        course: userDetails?.course || '',
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        startTime: formattedStartTime,
        endTime: formattedEndTime,
        Nameplace: userDetails?.Nameplace || '',
        latitude: parseFloat(userDetails.latitude) || '',
        longitude: parseFloat(userDetails.longitude) || '',
        province: userDetails?.province || '',
        admin_id: currentUser?.adminID || null,
        event_type: currentUser?.role || ''
    });

    console.log(formValues);

    useEffect(() => {
        if (!currentUser) {
            dispatch(fetchCurrentUser());
        } else {
            setFormValues(prevState => ({
                ...prevState,
                admin_id: currentUser.adminID,
                event_type: currentUser.role === 'super_admin' ? userDetails?.event_type : currentUser.role,
            }));
        }
    }, [dispatch, currentUser]);


    const toggleMapVisibility = () => {
        setIsMapVisible(prev => !prev);
    };

    const handleSave = () => {
        if (!formValues.admin_id) {
            console.error("Admin ID is missing");
            return;
        }

        // ตรวจสอบว่า endDate น้อยกว่า startDate หรือไม่
        if (formValues.endDate && new Date(formValues.endDate) < new Date(formValues.startDate)) {
            Swal.fire({
                icon: 'error',
                title: 'กรุณาเลือกวันที่สิ้นสุดให้ถูกต้อง',
                text: 'วันที่สิ้นสุดต้องมากกว่าหรือเท่ากับวันที่เริ่มต้น',
            });
            return;
        }

        // ตรวจสอบว่า endTime น้อยกว่า startTime หรือไม่
        if (formValues.endTime && formValues.endTime < formValues.startTime) {
            Swal.fire({
                icon: 'error',
                title: 'กรุณาเลือกเวลาที่สิ้นสุดให้ถูกต้อง',
                text: 'เวลาที่สิ้นสุดต้องมากกว่าหรือเท่ากับเวลาที่เริ่มต้น',
            });
            return;
        }

        const currentDate = new Date();

        const formattedDate = currentDate.toLocaleDateString('th-TH', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });

        dispatch(editEvent({ eventID, formValues }))
            .unwrap()
            .then((res) => {
                console.log(res);
                dispatch(showNotification({
                    message: `ได้แก้ไขกิจกรรมสำเร็จแล้วในวันที่ ${formattedDate}`, // Use the formatted date
                    status: 1
                }));
                Swal.fire({
                    icon: 'success',
                    title: 'แก้ไขกิจกรรมสำเร็จ',
                    showConfirmButton: false,
                    timer: 1500
                });
                onSave();
            })
            .catch((error) => {
                console.error("Error editing event: ", error);
                Swal.fire({
                    icon: 'error',
                    title: 'แก้ไขกิจกรรมไม่สำเร็จ!',
                    text: 'กรุณาทำรายการใหม่อีกครั้ง',
                    showConfirmButton: false,
                    timer: 1500
                });
            });
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
        const defaultLat = formValues.latitude ?? 16.90303983261848;
        const defaultLng = formValues.longitude ?? 99.1220104695936;
    
        setFormValues(prevState => ({
            ...prevState,
            latitude: defaultLat,
            longitude: defaultLng
        }));
        getProvinceName(defaultLat, defaultLng);
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
    
    useEffect(() => {
        if (mapRef.current) {
            mapRef.current.setView([formValues.latitude, formValues.longitude], 10); // เลื่อนแผนที่ไปยังพิกัดใหม่
            mapRef.current.invalidateSize();  // อัปเดตขนาดแผนที่
        }
    }, [formValues.latitude, formValues.longitude]);
    
    function LocationMarker() {
        const map = useMapEvents({
            click(e) {
                const { lat, lng } = e.latlng;  // รับพิกัดจากแผนที่
                setFormValues(prevState => ({
                    ...prevState,
                    latitude: lat,  // อัปเดตค่าพิกัด latitude
                    longitude: lng, // อัปเดตค่าพิกัด longitude
                }));
                getProvinceName(lat, lng);  // ดึงชื่อจังหวัดใหม่จากพิกัด
            }
        });
    
        return formValues.latitude && formValues.longitude ? (
            <Marker position={[formValues.latitude, formValues.longitude]} />
        ) : null;
    }
    

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-header">
                    แก้ไขกิจกรรม : {userDetails?.activityName ?? 'ไม่ระบุ'}
                </div>
                <div className="modal-body overflow-y-auto h-[50vh]">
                    <div className="grid grid-cols-2 gap-2 justify-center">
                        <InputText
                            labelTitle={'ชื่อกิจกรรม'}
                            type={'text'}
                            placeholder={userDetails?.activityName ?? 'ไม่ระบุ'}
                            updateFormValue={handleUpdateFormValue}
                            updateType="activityName"
                        />
                        <SelectBox
                            labelTitle={'ระดับการศึกษา'}
                            placeholder={'เลือกระดับการศึกษา'}
                            options={courses}
                            value={formValues.course}
                            updateFormValue={handleUpdateFormValue}
                            updateType='course'
                        />
                        <InputText
                            labelTitle={'วันที่เริ่มต้น'}
                            type={'date'}
                            defaultValue={formattedStartDate}
                            updateFormValue={handleUpdateFormValue}
                            updateType="startDate"
                        />
                        <InputText
                            labelTitle={'วันที่สิ้นสุด'}
                            type={'date'}
                            defaultValue={formattedEndDate}
                            updateFormValue={handleUpdateFormValue}
                            updateType="endDate"
                        />
                        <InputText
                            labelTitle={'เวลาที่เริ่มต้น'}
                            type={'time'}
                            defaultValue={formattedStartTime}
                            updateFormValue={handleUpdateFormValue}
                            updateType="startTime"
                        />
                        <InputText
                            labelTitle={'เวลาที่สิ้นสุด'}
                            type={'time'}
                            defaultValue={formattedEndTime}
                            updateFormValue={handleUpdateFormValue}
                            updateType="endTime"
                        />
                    </div>
                    <InputText
                        labelTitle={'ชื่อสถานที่จัดกิจกรรม'}
                        type={'text'}
                        placeholder={userDetails?.Nameplace ?? 'ไม่ระบุ'}
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
                                center={[formValues.latitude, formValues.longitude]}
                                zoom={10}
                                style={{ height: "300px", width: "100%" }}
                                whenCreated={(mapInstance) => { mapRef.current = mapInstance; }}
                            >
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
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
