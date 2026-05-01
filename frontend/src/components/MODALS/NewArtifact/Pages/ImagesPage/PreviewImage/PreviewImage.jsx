import './PreviewImage.css';

function PreviewImage({ src }) {
    return (
        <div className="preview-image-card">
            <img src={src} alt="preview" />
            
            <input type="text" placeholder="Input Image Angle" />
        </div>
    );
}

export default PreviewImage;

