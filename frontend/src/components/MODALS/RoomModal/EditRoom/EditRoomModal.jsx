import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import './EditRoomModal.css';

function EditRoomModal({ showEdit, setShowEdit }){

    return (
        <Modal show={showEdit} onHide={() => setShowEdit(false)} aria-labelledby="example-custom-modal-styling-title">
            <Modal.Header closeButton style={{ backgroundColor: '#283971' }} className="d-flex align-items-center justify-content-between">
                <img src="src/assets/logo.png"/>
            </Modal.Header>
            
            <Modal.Body>
                <div className="room-modal-body">
                    <div className="room-field">
                        <label> Modify Title </label>
                        <input type="text" placeholder="edit text"/>
                    </div>

                    <div className="room-field">
                        <label> Modify Room Location </label>
                        <input type="text" placeholder="edit text"/>
                    </div>

                    <div className="room-field">
                        <label> Modify Caption </label>
                        <input type="text" placeholder="edit text"/>
                    </div>

                    <div className="room-field room-field-file">
                        <div className="file-input-wrapper">
                            <div className="file-input">
                                <label> Modify Room Photo </label>
                                <input type="file"/>
                            </div>

                            <button className="submit-btn">
                                Submit
                            </button>
                        </div>
                    </div>

                </div>
            </Modal.Body>
        </Modal>

    )
}

export default EditRoomModal;