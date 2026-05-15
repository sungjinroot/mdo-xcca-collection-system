import './Artifact.css';
import './ArtifactData';
import { useState, useEffect } from 'react';
import ArtifactData from './ArtifactData';
import InspectArtifact from '../MODALS/InspectArtifact/InspectArtifact.jsx';
import WarningConfirmation from '../MODALS/ModalPrompts/WarningConfirmation/WarningConfirmation.jsx';

function Artifact({ artifactId, englishName, rooms, vernacularName, initiateArtifactSearch, currentRoomId, currentRoomName }) {
  const [show, setShow] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [currentPicture, setCurrentPicture] = useState(null);
  const [pictures, setPictures] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentRoom, setCurrentRoom] = useState({
    roomId: currentRoomId,
    currentRoomName: currentRoomName
  });

  const [currentArtifactData,setCurrentArtifactData] = useState(null); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:3000/api/v1/thumbnail/${artifactId}`);
        const result = await response.json();
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

  const handleRoomChange = async (e) => {
    const selectedRoomId = e.target.value;
    const selectedRoom = rooms.find(room => room.roomid === parseInt(selectedRoomId));
    if (!selectedRoom) return;

    try {
      const response = await fetch(`http://127.0.0.1:3000/api/v1/changeroom/${artifactId}/${selectedRoomId}`, {
        method: "PUT",
      });
      if (response.ok) {
        setCurrentRoom({
          roomId: selectedRoom.roomid,
          currentRoomName: selectedRoom.roomname
        });
        initiateArtifactSearch();
      } else {
        console.error("Failed to update room");
      }
    } catch (error) {
      console.error("Error updating room:", error);
    }
  };

  if (loading) {
    return <div className="card-container">Loading...</div>;
  }

  //Todo later. when editing via debounce... call this api again

  const getSpecificData = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:3000/api/v1/artifacts/${artifactId}`);
      const result = await response.json();
      setCurrentArtifactData(result);
      setShow(true);                
    } catch (error) {
      console.error("Failed to fetch artifact data:", error);
    }
  };

  return (
    <>
      <div className="card-container">
        <div className="card-img">
          <img src={currentPicture} onClick={() => getSpecificData()} />
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
          <div className="basic-info" onClick={() => getSpecificData()}>
            <ArtifactData style={"artifact-display-data"} englishName={englishName} vernacularName={vernacularName} />
          </div>
          <div className="basic-functions">
            <button className="card-functions">Download</button>

            
            <select className="card-functions" value={currentRoom.roomId} onChange={handleRoomChange}>
              <option value={currentRoom.roomId}>
                {currentRoom.currentRoomName}
              </option>

              {rooms.filter(room => room.roomid !== currentRoom.roomId).map((room) => (
                <option key={room.roomid} value={room.roomid}>
                  {room.roomname}
                </option>
              ))}
            </select>

          </div>
        </div>
      </div>

      <InspectArtifact show={show} setShow={setShow} currentArtifactData={currentArtifactData}/>
      <WarningConfirmation showWarning={showWarning} setShowWarning={setShowWarning} artifactId={artifactId} initiateArtifactSearch={initiateArtifactSearch} />
    </>
  );
}

export default Artifact;