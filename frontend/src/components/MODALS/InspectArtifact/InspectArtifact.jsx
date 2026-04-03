import Modal from 'react-bootstrap/Modal';
import { useState } from 'react';

function InspectArtifact(props){


    return (
        <Modal show={props.show} onHide={() => props.setShow(false)} contentClassName="ModalSizeHeight" dialogClassName="ModalSizeWidth" aria-labelledby="example-custom-modal-styling-title" centered>
            <Modal.Header closeButton style={{ backgroundColor: '#283971' }} className="d-flex align-items-center">
                <img src="src/assets/logo.png"/>
                
            
            </Modal.Header>
            
            <Modal.Body> 

                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Architecto similique reprehenderit sed corrupti, culpa est totam nostrum delectus molestiae quis omnis minima ipsam, maiores ex repudiandae porro dolorum? Officiis, voluptates.

            </Modal.Body>
        </Modal>
    )
}

export default InspectArtifact;