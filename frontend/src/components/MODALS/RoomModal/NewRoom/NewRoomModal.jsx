import './NewRoomModal.css';
import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';

function NewRoomModal({ showAdd, setShowAdd }){

    return (
        <Modal show={showAdd} onHide={() => setShowAdd(false)} aria-labelledby="example-custom-modal-styling-title">
            <Modal.Header closeButton style={{ backgroundColor: '#283971' }} className="d-flex align-items-center">
                <h3 style={{'color': 'white'}}> New Room </h3>
            </Modal.Header>
            
            <Modal.Body>
                <div className="room-modal-body">

                    <div className="room-field">
                        <label> Title </label>
                        <input type="text"/>
                    </div>

                    <div className="room-field">
                        <label> Room Location </label>
                        <input type="text"/>
                    </div>

                    <div className="room-field">
                        <label> Caption </label>
                        <input type="text"/>
                    </div>

                    <div className="room-field room-field-file">
                        <div className="file-input-wrapper">
                            <div className="file-input">
                                <label> Room Photo </label>
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

export default NewRoomModal;