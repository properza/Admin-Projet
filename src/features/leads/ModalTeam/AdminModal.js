import React from 'react'

function AdminModal({
    isOpen,
    onClose,
    isEditMode,
    formData,
    setFormData,
    onSubmit
}) {

    // หาก Modal ปิดอยู่ ไม่ต้อง render
    if (!isOpen) return null

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit();  // เรียกฟังก์ชัน onSubmit ที่รับมาจาก props
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white p-4 rounded-md w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">
                    {isEditMode ? 'แก้ไขผู้ดูแล' : 'เพิ่มผู้ดูแล'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                        <label className="label grid">
                            ชื่อผู้ใช้
                            <input
                                type="text"
                                name="username"
                                className="input input-bordered w-full"
                                value={formData.username || ''}
                                onChange={handleChange}
                                required
                            />
                        </label>

                        <label className="label grid">
                            รหัสผ่าน
                            <input
                                type="password"
                                name="password"
                                className="input input-bordered w-full"
                                value={formData.password || ''}
                                onChange={handleChange}
                                required={!isEditMode} 
                                /* ถ้าเป็นการแก้ไข จะไม่บังคับใส่ password */
                            />
                        </label>

                        <label className="label grid">
                            ชื่อ
                            <input
                                type="text"
                                name="firstname"
                                className="input input-bordered w-full"
                                value={formData.firstname || ''}
                                onChange={handleChange}
                            />
                        </label>

                        <label className="label grid">
                            นามสกุล
                            <input
                                type="text"
                                name="lastname"
                                className="input input-bordered w-full"
                                value={formData.lastname || ''}
                                onChange={handleChange}
                            />
                        </label>

                        {/* 
                          ตัวอย่าง: เลือก role เฉพาะกรณี Add New 
                          ถ้าต้องการให้แก้ไขได้ด้วย ก็สามารถเอาเงื่อนไขออกได้ 
                        */}
                        {
                            !isEditMode && (<div className="">
                                <label className="label grid w-full">
                                    สิทธิ์ผู้ดูแล</label>
                                    <select
                                        name="role"
                                        className="input input-bordered w-full text-center"
                                        onChange={handleChange}
                                        value={formData.role || ''}
                                        required
                                    >
                                        <option value="" disabled>-- เลือกสิทธิ์ --</option>
                                        <option value="normal">ทั่วไป</option>
                                        <option value="special">กยศ.</option>
                                    </select>
                                    </div>
                                
                            )
                        }
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                        <button
                            type="button"
                            className="btn btn-ghost border-gray-300"
                            onClick={onClose}
                        >
                            ยกเลิก
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                        >
                            บันทึก
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AdminModal
