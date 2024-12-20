import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { showNotification } from '../../common/headerSlice';
import './leaflet.css';
import './ModalCA.css';
import InputText from '../../../components/Input/InputText';
import SelectBox from '../../../components/Input/SelectBox';
import { fetchCurrentUser, createEvent } from '../../../components/common/userSlice';
import Swal from 'sweetalert2';

export default function ModalDetail({ onClose }) {
    const dispatch = useDispatch();
    const currentUser = useSelector(state => state.user.currentUser);
    const [isMapVisible, setIsMapVisible] = useState(false);

    const formattedStartDate = userDetails?.startDate ? userDetails.startDate.split('T')[0] : '';
    const formattedEndDate = userDetails?.endDate ? userDetails.endDate.split('T')[0] : '';
    const formattedStartTime = userDetails?.startTime ? userDetails.startTime.slice(0,5) : '';
    const formattedEndTime = userDetails?.endTime ? userDetails.endTime.slice(0,5) : '';

    const [formValues, setFormValues] = useState({
        activityName: userDetails?.activityName || '',
        course: userDetails?.course || '',
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        startTime: formattedStartTime,
        endTime: formattedEndTime,
        Nameplace: userDetails?.Nameplace || '',
        latitude: userDetails?.latitude ? parseFloat(userDetails.latitude) : null,
        longitude: userDetails?.longitude ? parseFloat(userDetails.longitude) : null,
        province: userDetails?.province || '',
        admin_id: currentUser?.adminID,
        event_type: currentUser?.role
    });

    console.log(userDetails);

    useEffect(() => {
        if (!currentUser) {
            dispatch(fetchCurrentUser());
        } else {
            setFormValues((prevState) => ({
                ...prevState,
                admin_id: currentUser.adminID,
                event_type: currentUser.role,
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
        const currentDate = new Date();
    
        const formattedDate = currentDate.toLocaleDateString('th-TH', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });

        dispatch(editEvent({ eventID , formValues}))
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
                // text: 'กรุณาทำรายการใหม่อีกครั้ง',
                showConfirmButton:false,
                timer:1500
            });
            onSave();
        })
        .catch((error) => {
            console.error("Error creating event: ", error);
            Swal.fire({
                icon: 'error',
                title: 'แก้ไขกิจกรรมไม่สำเร็จ!',
                text: 'กรุณาทำรายการใหม่อีกครั้ง',
                showConfirmButton:false,
                timer:1500
            });
        });
    };

    const courses = [
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
                    แก้ไขกิจกรรม : {userDetails?.Nameplace ?? 'ไม่ระบุ'}
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
                            labelTitle={'หลักสูตร'}
                            placeholder={userDetails?.course ?? 'ไม่ระบุ'}
                            options={courses}
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
                        placeholder={userDetails?.Nameplace?? 'ไม่ระบุ'}
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
