import React, { useState, useEffect } from "react"

function RewardModal({
  isOpen,
  onClose,
  isEditMode,
  formData,
  setFormData,
  onSubmit
}) {
  const [previewImage, setPreviewImage] = useState(null)
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)

  useEffect(() => {
    // ตั้งค่า previewImage เมื่อ formData.images เปลี่ยน
    if (formData.images) {
      // ถ้า formData.images เป็นไฟล์
      if (formData.images instanceof File) {
        setPreviewImage(URL.createObjectURL(formData.images)) // สร้าง URL สำหรับไฟล์
      } else {
        setPreviewImage(formData.images) // ถ้าเป็น string (URL)
      }
    }
  }, [formData.images])

  if (!isOpen) return null
  console.log(formData);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      const file = files[0]
      if (file) {
        // เมื่อเลือกไฟล์ใหม่, แทนที่ไฟล์เดิม
        setPreviewImage(URL.createObjectURL(file))
        setFormData((prev) => ({
          ...prev,
          [name]: file // เก็บไฟล์ใหม่
        }))
      }
    } else if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit()
  }

  const handleImageClick = () => {
    setIsImageModalOpen(true)  // เปิด Modal ขยายภาพ
  }

  const closeImageModal = () => {
    setIsImageModalOpen(false)  // ปิด Modal ขยายภาพ
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white p-4 rounded-md w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {isEditMode ? "แก้ไขของรางวัล" : "เพิ่มของรางวัล"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">ชื่อของรางวัล</label>
            <input
              type="text"
              name="reward_name"
              className="input input-bordered w-full"
              value={formData.reward_name || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="label">คะแนนที่ใช้แลก</label>
            <input
              type="number"
              name="points_required"
              className="input input-bordered w-full"
              value={formData.points_required || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="label">จำนวนของรางวัล </label>
            <input
              type="number"
              name="amount"
              className="input input-bordered w-full"
              value={formData.amount || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="label">เพิ่มรูปของรางวัล</label>
            {previewImage && (
              <div className="mt-2">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-[100px] h-[100px] object-cover cursor-pointer"
                  onClick={handleImageClick} // คลิกที่รูปเพื่อเปิด Modal ขยาย
                />
              </div>
            )}
            <input
              type="file"
              name="images"
              className="input w-full"
              onChange={handleChange}
              accept="image/*"
              required={!formData.images} // บังคับเลือกไฟล์ถ้ายังไม่มี
            />
          </div>

          {isEditMode && (
            <div className="flex items-center space-x-2 mt-2">
              <input
                type="checkbox"
                name="can_redeem"
                checked={formData.can_redeem}
                onChange={handleChange}
              />
              <label>อนุญาตให้แลก</label>
            </div>
          )}

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              className="btn btn-ghost border-gray-300"
              onClick={onClose}
            >
              ยกเลิก
            </button>
            <button type="submit" className="btn btn-primary">
              บันทึก
            </button>
          </div>
        </form>
      </div>

      {/* Modal สำหรับขยายรูปภาพ */}
      {isImageModalOpen && (
        <div onClick={closeImageModal} className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-white p-4 rounded-md max-w-xl w-full">
            <img
              src={previewImage}
              alt="Expanded Preview"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default RewardModal
