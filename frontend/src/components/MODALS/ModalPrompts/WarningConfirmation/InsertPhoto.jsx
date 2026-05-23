import Modal from 'react-bootstrap/Modal';
import PreviewImage from '../../NewArtifact/Pages/ImagesPage/PreviewImage/PreviewImage';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useState } from 'react';

function InsertPhoto({ showImageInsert, setShowImageInsert, artifactId, onUploadSuccess }) {
  const [images, setImages] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const allNamed = images.length > 0 && images.every(img => img.pictureName.trim() !== "");

  const handleClose = () => {
    setImages([]);
    setShowImageInsert(false);
  };

  function autoUpload(e) {
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

  async function handleSubmission() {
    if (images.length === 0) return;

    const formData = new FormData();
    formData.append("artifactId", artifactId);
    images.forEach((img) => {
      formData.append("photos", img.file);
      formData.append("pictureNames", img.pictureName);
    });

    try {
      const response = await fetch("http://127.0.0.1:3000/api/v1/upload/artifact", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!result.success) {
        console.error("Image upload failed");
        return;
      }

      console.log("Uploaded files:", result.files);
      setOpenSnackbar(true);
      onUploadSuccess?.();
      handleClose();

    } catch (err) {
      console.error("Error uploading images:", err);
    }
  }

  function handleCloseSnackbar(event, reason) {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
  }

  return (
    <>
      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert onClose={handleCloseSnackbar} severity="success" variant="filled" sx={{ width: '100%' }}>
          Photos uploaded successfully
        </Alert>
      </Snackbar>

      <Modal show={showImageInsert} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton style={{ backgroundColor: '#283971', borderBottom: 'none', padding: '12px 16px', color: 'white' }}>
          Upload New Photo
        </Modal.Header>

        <Modal.Body style={{ padding: '24px' }}>
          <div className="stepper-upload" style={{ height: '150px', marginBottom: '20px' }}>
            <label htmlFor="modalImageUpload" className="image-upload-label">
              <div className="upload-box">
                Click or Drag & Drop to Upload
              </div>

              <input type="file" id="modalImageUpload" accept="image/*" className="image-upload-input" multiple onChange={autoUpload}/>

            </label>
          </div>

          {images.length > 0 && (
            <div className="uploaded-images-preview-grid" style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {images.map((img, index) => (
                <PreviewImage key={index} src={img.url} pictureName={img.pictureName} onRemove={() => removeImage(index)} onPictureNameChange={(value) => updatePictureName(index, value)}/>
              ))}
            </div>
          )}
        </Modal.Body>

        <Modal.Footer style={{ borderTop: 'none', justifyContent: 'space-between' }}>
          <div className={`stepper-navigation-right ${!allNamed ? 'disabled' : ''}`} onClick={() => allNamed && handleSubmission()} style={{ color: 'white', opacity: allNamed ? 1 : 0.4, cursor: allNamed ? 'pointer' : 'not-allowed' }}>
            Submit
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default InsertPhoto;