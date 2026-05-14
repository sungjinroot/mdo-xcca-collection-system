import './Artifact.css';
import './ArtifactData';
import { useState, useEffect } from 'react';
import ArtifactData from './ArtifactData';
import InspectArtifact from '../MODALS/InspectArtifact/InspectArtifact.jsx';
import WarningConfirmation from '../MODALS/ModalPrompts/WarningConfirmation/WarningConfirmation.jsx';

function Artifact({ artifactId, englishName, vernacularName, initiateArtifactSearch }) {
  const [show, setShow] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [currentPicture, setCurrentPicture] = useState(null);
  const [pictures, setPictures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:3000/api/v1/thumbnail/${artifactId}`);
        const result = await response.json();
        console.log(result);
        if (result && result.length > 0) {
          setPictures(result);
          setCurrentPicture(result[0].picturefilepath);
        }
      } catch (error) {
        console.error("Failed to fetch thumbnails:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleThumbnailChange = async (e) => {
    const selectedPicture = pictures.find(p => p.picturefilepath === e.target.value);
    if (!selectedPicture) return;

    setCurrentPicture(selectedPicture.picturefilepath);

    try {
      const response = await fetch(`http://127.0.0.1:3000/api/v1/thumbnail/${artifactId}/${selectedPicture.pictureid}`, {
        method: "PUT",
      });

      if (!response.ok) {
        console.error("Failed to update profile picture");
      }
    } catch (error) {
      console.error("Error updating profile picture:", error);
    }
  };

  if (loading) {
    return <div className="card-container">Loading...</div>;
  }

  return (
    <>
      <div className="card-container">
        <div className="card-img">
          <img src={currentPicture} onClick={() => setShow(true)} />
          <div className="thumbnail-chooser">
            
            
            <select onChange={handleThumbnailChange}>
              {pictures.map((picture) => (
                <option key={picture.pictureid} value={picture.picturefilepath}>
                  {picture.anglename}
                </option>
              ))}
            </select>


          </div>
          <button className="delete-button" onClick={() => setShowWarning(true)}>
            <img src="src/assets/delete.png" />
          </button>
        </div>
        <div className="card-info">
          <div className="basic-info" onClick={() => setShow(true)}>
            <ArtifactData style={"artifact-display-data"} englishName={englishName} vernacularName={vernacularName} />
          </div>
          
          <div className="basic-functions">
            <button className="card-functions">Download</button>
            <select className="card-functions">
              <option>Room 1</option>
              <option>Room 2</option>
              <option>Room 3</option>
              <option>Room 4</option>
              <option>Room 5</option>
              <option>Room 6</option>
              <option>Room 7</option>
              <option>Room 8</option>
            </select>
          </div>
        </div>
      </div>


      <InspectArtifact show={show} setShow={setShow} />
      <WarningConfirmation showWarning={showWarning} setShowWarning={setShowWarning} artifactId={artifactId} initiateArtifactSearch={initiateArtifactSearch}/>
    </>
  );
}

export default Artifact;