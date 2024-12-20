import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react'; // Updated import
import Swal from 'sweetalert2';

const ModalQRCode = ({ onClose, eventID, userDetails }) => {
    const qrUrl = `https://profile-lyp5.onrender.com/event?referral=${eventID}`;
    const svgRef = useRef(null);

    const handleDownload = () => {
        const svgElement = svgRef.current;
        if (!svgElement) {
            console.error('SVG element not found');
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: 'ไม่พบ QR Code',
                showConfirmButton: false,
                timer: 1500,
            });
            return;
        }

        try {
            // Serialize the SVG XML
            const serializer = new XMLSerializer();
            const svgString = serializer.serializeToString(svgElement);

            // Create a Blob from the SVG string
            const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(svgBlob);

            // Create an Image to load the SVG
            const img = new Image();
            img.onload = () => {
                // Define padding
                const padding = 50; // พื้นที่รอบ QR Code

                // Define additional text
                const additionalText = `กิจกรรม: ${userDetails.activityName}`;
                const fontSize = 24;
                const fontFamily = 'Arial';

                // Create a canvas and set its size
                const canvas = document.createElement('canvas');
                canvas.width = img.width + padding * 2;
                canvas.height = img.height + padding * 2 + fontSize + 20; // เพิ่มพื้นที่สำหรับข้อความ
                const ctx = canvas.getContext('2d');

                // Fill the background with white
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // Draw the QR Code image with padding
                ctx.drawImage(img, padding, padding);

                // Add additional text below the QR Code
                ctx.fillStyle = '#000000';
                ctx.font = `${fontSize}px ${fontFamily}`;
                ctx.textAlign = 'center';
                ctx.fillText(additionalText, canvas.width / 2, img.height + padding * 1.5 + fontSize);

                // Create a PNG data URL from the canvas
                const pngDataUrl = canvas.toDataURL('image/png');

                // Create a temporary link to trigger the download
                const downloadLink = document.createElement('a');
                downloadLink.href = pngDataUrl;
                downloadLink.download = `QR_Code_Event_${eventID}.png`;
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);

                // Clean up the object URL
                URL.revokeObjectURL(url);

                // แสดงข้อความแจ้งเตือนเมื่อดาวน์โหลดสำเร็จ
                Swal.fire({
                    icon: 'success',
                    title: 'ดาวน์โหลดสำเร็จ!',
                    text: 'QR Code ถูกบันทึกลงในเครื่องของคุณแล้ว',
                    showConfirmButton: false,
                    timer: 1500,
                });
            };

            img.onerror = (err) => {
                console.error('Error loading SVG for conversion:', err);
                Swal.fire({
                    icon: 'error',
                    title: 'เกิดข้อผิดพลาด',
                    text: 'ไม่สามารถแปลง QR Code เป็นรูปภาพได้',
                    showConfirmButton: false,
                    timer: 1500,
                });
                URL.revokeObjectURL(url);
            };

            // Set the image source to the SVG Blob URL
            img.src = url;
        } catch (error) {
            console.error('Error during QR Code download:', error);
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: 'ไม่สามารถดาวน์โหลด QR Code ได้',
                showConfirmButton: false,
                timer: 1500,
            });
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg p-6 relative">
                <h2 className="text-xl mb-4">QR Code กิจกรรม : {userDetails.activityName}</h2>
                <div className="flex justify-center">
                    <QRCodeSVG value={qrUrl} size={256} ref={svgRef} />
                </div>
                <div className="mt-4 flex justify-center gap-2">
                    <button
                        onClick={handleDownload}
                        className='btn text-white bg-[#FF9C00] hover:bg-yellow-600'
                    >
                        บันทึก
                    </button>
                    <button
                        onClick={onClose}
                        className='btn text-black border-black bg-white hover:bg-gray-400'
                    >
                        ปิด
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalQRCode;