import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setPageTitle } from "../../common/headerSlice"
import TitleCard2 from "../../../components/Cards/TiileCard2"
import { getRewardUSE, updateCompleted } from "../../../components/common/userSlice"
import { showNotification } from "../../common/headerSlice"
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import { BrowserMultiFormatReader } from '@zxing/library';

export default function Rewarduse() {
    const dispatch = useDispatch()
    const [rewardCode, setRewardCode] = useState('')  // สร้าง state สำหรับเก็บค่ารหัสที่ป้อน
    const rewardData = useSelector((state) => state.user.getRewardUSEData)
    const error = useSelector((state) => state.user.error)
    const loading = useSelector((state) => state.user.loading)
    const [scanning, setScanning] = useState(false);
    const [videoRef, setVideoRef] = useState(null);
    

    useEffect(() => {
        dispatch(setPageTitle({ title: "แลกใช้ของรางวัล" }))
    }, [dispatch])

    useEffect(() => {
        if (scanning && videoRef) {
          const codeReader = new BrowserMultiFormatReader();
          codeReader.decodeFromVideoDevice(null, videoRef, (result, error) => {
            if (result) {
              setRewardCode(result.getText());
              setScanning(false); // Stop scanning after successful scan
            }
            if (error) {
              console.error('Error decoding barcode', error);
            }
          });
    
          return () => codeReader.reset(); // Clean up the reader
        }
      }, [scanning, videoRef]);

    console.log(error)

    const handleConfirm = () => {
        if (rewardCode) {
            dispatch(getRewardUSE(rewardCode))
        }
    }

    const currentDate = new Date().toLocaleDateString('th-TH', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    const handleComplete = async (reID) => {
        if (reID) {
            try {
                const result = await dispatch(updateCompleted({ rewardID: reID })).unwrap();
                dispatch(showNotification({
                    message: `ได้แลกของรางวัลสำเร็จแล้ว ${currentDate}`,
                    status: 1,
                }));
                dispatch(getRewardUSE(rewardCode))
            } catch (error) {
                dispatch(showNotification({
                    message: `เกิดข้อผิดพลาด: ${error.message}`,
                    status: 0,
                }));
                dispatch(getRewardUSE(rewardCode))
            }
        }
    };


    const BarCode = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75v-.75ZM13.5 19.5h.75v.75h-.75v-.75ZM19.5 13.5h.75v.75h-.75v-.75ZM19.5 19.5h.75v.75h-.75v-.75ZM16.5 16.5h.75v.75h-.75v-.75Z" />
    </svg>;

    const empty = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
    </svg>
        ;

    return (
        <TitleCard2
            title={'แลกใช้รางวัล'}
        >
            <div className="flex justify-center">
                <div className="grid gap-1 w-1/2 justify-center text-center" htmlFor="ป้อนรหัส">
                    ป้อนรหัสเพื่อใช้ของรางวัล
                    <div className="flex justify-center items-center gap-1">
                        {scanning ? (
                            <video
                                ref={setVideoRef}
                                width="300"
                                height="200"
                                style={{
                                    transform: "scaleX(-1)", // การกลับภาพให้เหมือนกระจก
                                    border: "2px solid red", // เส้นแนวนอนด้านบน
                                }}
                            />
                        ) :
                        <input
                            type="text"
                            className="border border-gray-400 text-gray-400"
                            value={rewardCode}  // ค่าจาก state
                            onChange={(e) => setRewardCode(e.target.value)}  // อัพเดทค่าที่ป้อนลงใน state
                        />}
                        {!scanning ? <button onClick={() => setScanning(true)} className="w-7 h-7 p-1 hover:bg-gray-400 rounded-md">{BarCode}</button> : <button onClick={() => setScanning(false)} className="w-7 h-7 p-1 hover:bg-gray-400 rounded-md">ปิด</button>}
                    </div>
                    <div className="mt-2">
                        <button
                            className="text-white bg-orange-400 rounded-md p-2 hover:bg-orange-200"
                            onClick={handleConfirm}  // เรียกฟังก์ชันเมื่อกดปุ่ม
                        >
                            ยืนยัน
                        </button>
                    </div>
                    <div className="mt-10">
                        <div className="">
                            {loading ? (
                                <p>กำลังโหลด...</p> // คุณสามารถแสดงข้อความโหลดระหว่างที่มีการร้องขอ
                            ) : error ? (
                                <div className="flex justify-center">
                                    <div className="grid gap-1 bg-orange-200 rounded-md p-2">
                                        <p className="w-[32px] h-[32px] mx-auto">{empty}</p>
                                        <p>ไม่พบข้อมูล: {error.message }</p>
                                    </div>
                                </div> // แสดงข้อความข้อผิดพลาดเมื่อเกิดข้อผิดพลาด
                            ) : rewardData && rewardData.data && rewardData.data.length > 0 ? (
                                rewardData.data.map((data, index) => (
                                    <div key={data.id} className="w-full">
                                        <img src={data?.reward_url} className="w-15 h-15" />
                                        <p className="mt-2">คุณ {data?.customer_name} ได้แลกของรางวัล</p>
                                        <div className="flex gap-1 justify-center mt-3">
                                            <button onClick={() => handleComplete(data.id)} className="bg-green-400 text-white p-2 rounded-md hover:bg-green-200">
                                                แลกสำเร็จ
                                            </button>
                                            <button className="bg-red-400 text-white p-2 rounded-md hover:bg-red-200">
                                                ยกเลิก
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex justify-center">
                                    <div className="grid gap-1 bg-orange-200 rounded-md p-2">
                                        <p className="w-[32px] h-[32px] mx-auto">{empty}</p>
                                        <p>ไม่มีข้อมูล</p>
                                    </div>
                                </div> // แสดงข้อความเมื่อไม่มีข้อมูล
                            )}
                        </div>

                    </div>
                </div>
            </div>

        </TitleCard2>
    )
}
