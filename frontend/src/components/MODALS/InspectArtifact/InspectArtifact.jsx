import Modal from 'react-bootstrap/Modal';

import { useState } from 'react';

function InspectArtifact(props){


    return (
        <Modal show={props.show} onHide={() => props.setShow(false)} contentClassName="ModalSizeHeight" dialogClassName="ModalSizeWidth" aria-labelledby="example-custom-modal-styling-title" centered>
            <Modal.Header closeButton style={{ backgroundColor: '#283971' }} className="d-flex align-items-center">
                <img src="src/assets/logo.png"/>
                
            
            </Modal.Header>
            
            <Modal.Body> 
                <div className="artifact-info-container">
                    <div className="artifact-info-left">
                        LEFT
                    </div>

                    <div className="artifact-info-right">
                        RIGHT
                    </div>
                </div>

            </Modal.Body>
        </Modal>
    )
}

export default InspectArtifact;