import { useState } from 'react';
import './ImageU.css';

function ModalImage({ images, isOpen, onClose }) {
  // State สำหรับเก็บรูปที่ถูกเลือกให้ขยาย
  const [enlargedImage, setEnlargedImage] = useState(null);

  // ถ้า Modal ยังไม่เปิด หรือไม่มีรูป ก็ไม่ต้องแสดงอะไร
  if (!isOpen || !images || images.length === 0) return null;

  // ฟังก์ชันเวลาคลิกที่รูป เพื่อเก็บรูปไว้ใน enlargedImage
  const handleImageClick = (image) => {
    setEnlargedImage(image);
  };

  // ปิดการขยายรูป
  const handleCloseEnlarged = () => {
    setEnlargedImage(null);
  };

  return (
    <div className="image-modal">
      <div className="image-modal-content">
        {/* ส่วนแสดงรูปเล็ก ๆ เป็น Grid */}
        <div className={`grid ${images.length === '1' ? 'grid-cols-1' : 'grid-cols-2'} gap-2 overflow-auto h-[50vh]`}>
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Image ${index + 1}`}
              className="image-item"
              onClick={() => handleImageClick(image)} // เมื่อคลิกจะเรียก handleImageClick
              loading="lazy"
            />
          ))}
        </div>

        {/* ปุ่มปิด Modal หลัก */}
        <div className="flex justify-end mt-2 mb-[-0.5rem]">
          <button
            onClick={onClose}
            className="border border-black text-black py-1 rounded-md px-2 hover:bg-gray-400"
          >
            ปิด
          </button>
        </div>

        {/* ถ้า enlargedImage มีค่าหมายความว่ามีรูปถูกคลิก => แสดงรูปขยาย */}
        {enlargedImage && (
          <div className="enlarged-image-modal" onClick={handleCloseEnlarged}>
            <div className="enlarged-image-modal-content">
              <img src={enlargedImage} alt="Enlarged" className="enlarged-image" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ModalImage;
