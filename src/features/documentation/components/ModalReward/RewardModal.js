import React from "react"

function RewardModal({
  isOpen,
  onClose,
  isEditMode,
  formData,
  setFormData,
  onSubmit
}) {
  if (!isOpen) return null
  console.log(formData);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "file") {
      setFormData((prev) => ({
        ...prev,
        [name]: Array.from(e.target.files)
      }));
    } else if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  
  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit()
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
            <label className="label">คะแนนที่ใช้แลก (points_required)</label>
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
            <label className="label">จำนวนของรางวัล (amount)</label>
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
            <label className="label">เพิ่มรูปของรางวัล (rewardUrl)</label>
            {/* <img src={formData.images} className="w-[150px] h-[150px]" alt="" /> */}
            <input
              type="file"
              name="images"
              className="input input-bordered w-full"
              onChange={handleChange}
              multiple
              required
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
              <label>อนุญาตให้แลก (can_redeem)</label>
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
    </div>
  )
}

export default RewardModal
