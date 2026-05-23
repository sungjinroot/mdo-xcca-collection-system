import { useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import InsertPhoto from '../../ModalPrompts/WarningConfirmation/InsertPhoto.jsx';
import './PrimaryView.css';

function ArtifactCarousel({ pictures, setPictures, currentArtifactData, setShow, refreshThumbnails }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showImageInsert, setShowImageInsert] = useState(false);

  const currentPictureId = pictures[activeIndex]?.pictureid;
  const artifactID = currentArtifactData.artifacts.artifactID;

  const refreshPictures = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:3000/api/v1/thumbnail/${artifactID}`);
      const result = await response.json();
      const pics = Array.isArray(result) ? result : [];
      setPictures(pics);
      setActiveIndex((prev) => Math.min(prev, (pics.length || 1) - 1));
      
      if (refreshThumbnails) await refreshThumbnails();
    } catch (error) {
      console.error('Error refreshing pictures:', error);
      setPictures([]);
    }
  };

  const handleRemovePhoto = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:3000/api/v1/images/${artifactID}/${currentPictureId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete image');
      await refreshPictures();
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  function handleInsert() {
    setShowImageInsert(true);
  }

  if (!pictures || pictures.length === 0) {
    return (
      <>
        <div className="artifact-carousel d-flex flex-column align-items-center justify-content-center" style={{ height: '400px', background: '#f0f0f0', borderRadius: '8px' }}>
          <p className="text-muted">No photos available</p>
          <button className="empty-photos" onClick={() => setShowImageInsert(true)}>
            Insert Photo
          </button>
        </div>
        <InsertPhoto showImageInsert={showImageInsert} setShowImageInsert={setShowImageInsert} artifactId={artifactID} onUploadSuccess={refreshPictures}/>
      </>
    );
  }

  return (
    <>
      <Carousel interval={null} indicators={false} className="artifact-carousel" activeIndex={activeIndex} onSelect={(selectedIndex) => setActiveIndex(selectedIndex)}>
        {pictures.map((picture) => (
          <Carousel.Item key={picture.pictureid}>
            <img className="d-block w-100 pan-image-view" src={picture.picturefilepath} alt={picture.anglename} style={{ height: '100%', width: '100%', objectFit: 'contain' }} />
            <button className="images-options-left images-options" onClick={handleRemovePhoto}>
              Remove Photo
            </button>
            <button className="images-options-right images-options" onClick={handleInsert}>
              Insert Photo
            </button>
            <Carousel.Caption>
              <h1 style={{ color: 'white' }}>
                <span className="highlight">{picture.anglename}</span>
              </h1>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>

      <InsertPhoto showImageInsert={showImageInsert} setShowImageInsert={setShowImageInsert} artifactId={artifactID} onUploadSuccess={refreshPictures}/>
    </>
  );
}

export default ArtifactCarousel;