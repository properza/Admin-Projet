import './ImageU.css'
function ModalImage({ images, isOpen, onClose }) {
    if (!isOpen || !images || images.length === 0) return null;

    return (
        <div className="image-modal">
            <div className="image-modal-content">
                <div className={`grid ${images.length === '1' ? 'grid-cols-1' : 'grid-cols-2'} gap-2 overflow-auto h-[50vh]`}>
                    {images.map((image, index) => (
                        <img key={index} src={image} alt={`Image ${index + 1}`} className="image-item" />
                    ))}
                </div>
                <div className="flex justify-end mt-2 mb-[-0.5rem]">
                    <button onClick={onClose} className='border border-black text-black py-1 rounded-md px-2 hover:bg-gray-400'>
                        ปิด
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ModalImage;