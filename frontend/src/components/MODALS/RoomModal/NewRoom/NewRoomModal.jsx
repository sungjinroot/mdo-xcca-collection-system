import { useState } from 'react';
import './NewRoomModal.css';
import Modal from 'react-bootstrap/Modal';

function NewRoomModal({ showAdd, setShowAdd }) {

    const [roomData, setRoomData] = useState({
        title: '',
        roomName: '',
        caption: '',
        roomPictureURL: null
    });

    const isFormValid = roomData.title.trim() && roomData.roomName.trim() && roomData.caption.trim() && roomData.roomPictureURL;

    const [fileKey, setFileKey] = useState(Date.now());

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        setRoomData((prev) => ({
            ...prev,
            [name]: files ? files[0] : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            const formData = new FormData();
            formData.append('roomPicture', roomData.roomPictureURL);

            const uploadResponse = await fetch('http://127.0.0.1:3000/api/v1/upload/room',{
                method: 'POST', 
                body: formData
            });

            const uploadData = await uploadResponse.json();

            console.log(uploadData)

            const payload = {
                title: roomData.title,
                roomName: roomData.roomName,
                caption: roomData.caption,
                roomPictureURL: 'http://127.0.0.1:3000' + uploadData.filename.replace('/app', '')
            };

            console.log(payload)

            const response = await fetch('http://127.0.0.1:3000/api/v1/rooms', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            console.log(data);

            setRoomData({
                title: '',
                roomName: '',
                caption: '',
                roomPictureURL: null
            });

            setFileKey(Date.now());
            setShowAdd(false);

        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Modal show={showAdd} onHide={() => setShowAdd(false)} aria-labelledby="example-custom-modal-styling-title">
            <Modal.Header closeButton style={{ backgroundColor: '#283971' }} className="d-flex align-items-center">
                <h3 style={{ color: 'white' }}>New Room</h3>
            </Modal.Header>

            <Modal.Body>
                <form className="room-modal-body" onSubmit={handleSubmit}>

                    <div className="room-field">
                        <label>Title</label>
                        <input type="text" name="title" value={roomData.title} onChange={handleChange}/>
                    </div>

                    <div className="room-field">
                        <label>Room Name</label>
                        <input type="text" name="roomName" value={roomData.roomName} onChange={handleChange}/>
                    </div>

                    <div className="room-field">
                        <label>Caption</label>
                        <input type="text" name="caption" value={roomData.caption} onChange={handleChange}/>
                    </div>

                    <div className="room-field room-field-file">
                        <div className="file-input-wrapper">

                            <div className="file-input">
                                <label>Room Photo</label>

                                <input key={fileKey} type="file" name="roomPictureURL" onChange={handleChange}/>

                                <p className="selected-file" style={{ color: 'white' }}>
                                    {roomData.roomPictureURL ? `Selected: ${roomData.roomPictureURL.name}` : 'No file selected yet'}
                                </p>
                            </div>

                            <button type="submit" className={`submit-btn ${!isFormValid ? 'disabled-btn' : ''}`} disabled={!isFormValid}>
                                Submit
                            </button>

                        </div>
                    </div>

                </form>
            </Modal.Body>
        </Modal>
    );
}

export default NewRoomModal;