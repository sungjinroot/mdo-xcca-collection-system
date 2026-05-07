import { useState } from 'react';
import './NewRoomModal.css';
import Modal from 'react-bootstrap/Modal';

function NewRoomModal({ showAdd, setShowAdd }) {

    const [roomData, setRoomData] = useState({
        title: '',
        location: '',
        caption: '',
        photo: null
    });

    const [fileKey, setFileKey] = useState(Date.now());

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        setRoomData((prev) => ({
            ...prev,
            [name]: files ? files[0] : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log(roomData);

        setRoomData({
            title: '',
            location: '',
            caption: '',
            photo: null
        });

        setFileKey(Date.now());

        setShowAdd(false);
    };

    const isFormValid = roomData.title.trim() && roomData.location.trim() && roomData.caption.trim() && roomData.photo;

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
                        <label>Room Location</label>
                        <input type="text" name="location" value={roomData.location} onChange={handleChange}/>
                    </div>

                    <div className="room-field">
                        <label>Caption</label>
                        <input type="text" name="caption" value={roomData.caption} onChange={handleChange}/>
                    </div>

                    <div className="room-field room-field-file">
                        <div className="file-input-wrapper">

                            <div className="file-input">
                                <label>Room Photo</label>

                                <input key={fileKey} type="file" name="photo" onChange={handleChange}/>

                                <p className="selected-file" style={{ color: 'white' }}>
                                    {roomData.photo ? `Selected: ${roomData.photo.name}` : 'No file selected yet'}
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