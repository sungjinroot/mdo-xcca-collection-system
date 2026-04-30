import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import './EditRoomModal.css';
import Tooltip from '@mui/material/Tooltip';


function EditRoomModal({ showEdit, setShowEdit }){

    return (
        <Modal show={showEdit} onHide={() => setShowEdit(false)} aria-labelledby="example-custom-modal-styling-title">
            <Modal.Header closeButton style={{ backgroundColor: '#283971' }} className="d-flex align-items-center justify-content-between">

                <h3 style={{'color': 'white'}}> Modify Room </h3>

                <div className="delete-room-button">
                    <center>
                        Remove Room
                    </center>
                </div>

                
            </Modal.Header>
            
            <Modal.Body>
                
                <div className="room-modal-body">
                    <div className="room-field">
                        <label> Modify Title </label>
                        <Tooltip title="Change To Edit" placement='left'>
                            <input type="text" placeholder="edit text"/>
                        </Tooltip>
                    </div>

                    <div className="room-field">
                        <label> Modify Room Location </label>
                        
                        <Tooltip title="Change To Edit" placement='left'>
                            <input type="text" placeholder="edit text"/>
                        </Tooltip>

                    </div>

                    <div className="room-field">
                        <label> Modify Caption </label>

                        <Tooltip title="Change To Edit" placement='left'>
                            <input type="text" placeholder="edit text"/>
                        </Tooltip>
                        
                    </div>

                    <div className="room-field room-field-file">
                        <div className="file-input-wrapper">
                            <div className="file-input">
                                <label> Modify Room Photo </label>
                                <input type="file"/>
                            </div>

                            <button className="submit-btn">
                                Change Photo 
                            </button>
                        </div>
                    </div>
                    


                </div>
            </Modal.Body>
        </Modal>

    )
}

export default EditRoomModal;