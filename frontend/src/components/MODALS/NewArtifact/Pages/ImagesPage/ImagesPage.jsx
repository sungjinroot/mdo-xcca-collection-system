import '../Layout.css';
import './ImagesPage.css';
import PreviewImage from './PreviewImage/PreviewImage.jsx';
import { useState } from 'react';

function ImagesPage({prevStep, setShow}){

    const [images, setImages] = useState([]);

    function autoUpload(e){
        const files = Array.from(e.target.files);

        const imageUrls = files.map(file => ({
            file,
            url: URL.createObjectURL(file),
            pictureName: ""
        }));

        setImages(prev => [...prev, ...imageUrls]);
    }

    function removeImage(indexToRemove) {
        setImages(prev => {
            const updated = [...prev];
            URL.revokeObjectURL(updated[indexToRemove].url);
            return updated.filter((_, index) => index !== indexToRemove);
        });
    }

    function updatePictureName(index, newName) {
        setImages(prev => {
            const updated = [...prev];
            updated[index].pictureName = newName;
            return updated;
        });
    }

    return (
    
        <div className="stepper-container">
            <div className="stepper-content">
                <div className="stepper-left">
                    <div className="stepper-upload">
                        <label htmlFor="imageUpload" className="image-upload-label">
                            <div className="upload-box">
                                Click or Drag & Drop to Upload
                            </div>
                            <input type="file" id="imageUpload" accept="image/*" className="image-upload-input" multiple onChange={autoUpload}/>
                        </label>
                    </div>
                </div>





                <div className="stepper-right">
                    <div className="uploaded-images-preview-grid">
                        {images.map((img, index) => (
                            <PreviewImage
                            key={index}
                            src={img.url}
                            pictureName={img.pictureName}
                            onRemove={() => removeImage(index)}
                            onPictureNameChange={(value) => updatePictureName(index, value)}
                        />
                        ))}
                    </div>
                </div>
            </div>

            <div className="stepper-navigation-multi">
                <div className="stepper-navigation-left" onClick={() => prevStep()}> Previous </div> 
                <div className="stepper-navigation-right" onClick={() => (alert("5"))}> Submit </div> 
            </div>
        </div>
    
    )
}


export default ImagesPage;