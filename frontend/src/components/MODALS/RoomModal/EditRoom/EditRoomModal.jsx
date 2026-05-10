import { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import './EditRoomModal.css';
import Tooltip from '@mui/material/Tooltip';

function EditRoomModal({ showEdit, setShowEdit, roomId, setRoomId, roomIndex, setRoomIndex }) {

    const [title,setTitle] = useState("");
    const [roomName,setRoomName] = useState("");
    const [caption,setCaption] = useState("");

    function setRoomData(title,roomName,caption){
        setTitle(title);
        setRoomName(roomName);
        setCaption(caption);
    }

    //note to self - Set room data for POST
    useEffect(() => {
        if (!roomId) return;

        console.log("Updated roomId:", roomId);
        console.log("Updated room Index:", roomIndex);
        
        const fetchData = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:3000/api/v1/rooms/${roomId}`);
                const result = await response.json();
                console.log(result);
                setRoomData(result.title,result.roomname,result.caption);
            }

            catch (error) {
            console.error("Fetch error:", error);
        }
        };
        fetchData();
    },[roomId,roomIndex]);

    
    const handleDeleteRoom = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:3000/api/v1/rooms/${roomId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to delete room: ${response.status}`);
        }

        console.log(`Room ${roomId} deleted successfully`);

        setRoomIndex(null);
        setRoomId(null);

        setShowEdit(false);
        } catch (error) {
            console.error('Error deleting room:', error);
            alert("Replace this with a proper modal soon. Cannot delete room if it houses artifacts");
            setShowEdit(false);
        }
    };

  return (
    <Modal show={showEdit} onHide={() => setShowEdit(false)} aria-labelledby="example-custom-modal-styling-title">
      <Modal.Header closeButton style={{ backgroundColor: '#283971' }} className="d-flex align-items-center justify-content-between">
        <h3 style={{ 'color': 'white' }}> Modify Room </h3>
      </Modal.Header>

      <Modal.Body>
        <div className="room-modal-body">
          <div className="room-field">
            <label> Modify Title </label>
            <Tooltip title="Change To Edit" placement='left'>
              <input type="text" placeholder="edit text" value={title}/>
            </Tooltip>
          </div>
          <div className="room-field">
            <label> Modify Room Name </label>
            <Tooltip title="Change To Edit" placement='left'>
              <input type="text" placeholder="edit text" value={roomName}/>
            </Tooltip>
          </div>
          <div className="room-field">
            <label> Modify Caption </label>
            <Tooltip title="Change To Edit" placement='left'>
              <input type="text" placeholder="edit text" value={caption}/>
            </Tooltip>
          </div>
          <div className="room-field room-field-file">
            <div className="file-input-wrapper">
              <div className="file-input">
                <label> Modify Room Photo </label>
                <input type="file" />
              </div>
              <button className="submit-btn">
                Change Photo
              </button>
            </div>
          </div>
          <div className="room-delete-option">
            <label> Dont want this room anymore? </label>
            <div className="delete-room-button" onClick={handleDeleteRoom}>
              <center>
                Remove Room
              </center>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default EditRoomModal;