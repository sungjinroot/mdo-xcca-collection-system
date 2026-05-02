import './PreviewImage.css';

function PreviewImage({ src, onRemove, pictureName, onPictureNameChange }) {
    return (
        <div className="preview-image-card">
            <img src={src} className="preview-image" alt="preview" />

            <div className="preview-image-remove">
                <button onClick={onRemove}> Remove </button>
            </div>
            
            <input type="text" placeholder="Input Image Angle" value={pictureName} onChange={(e) => onPictureNameChange(e.target.value)}/>
        </div>
    );
}

export default PreviewImage;

