import Modal from 'react-bootstrap/Modal';
import './InspectArtifact.css';
import { Tabs, Tab } from "@mui/material";

import { useState } from 'react';
import InspectContainer from './Pages/InspectContainer.jsx';

function renderTab(current){
    switch (current){
        case 0: 
            return (
                <InspectContainer>
                    First
                </InspectContainer>
            )
            
        case 1:
            return (
                <InspectContainer>
                    Second
                </InspectContainer>
            )
        
        case 2:
            return (
                <InspectContainer>
                    Third
                </InspectContainer>
            )

        case 3:
            return (
                <InspectContainer>
                    Fourth
                </InspectContainer>
            )
    }
}


function InspectArtifact(props){

    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };


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

                        <div className="tab-options">
                            <Tabs value={value} onChange={handleChange}>
                                <Tab label="Physical"  value={0} />
                                <Tab label="Contacts" value={1} />
                                <Tab label="Acquisition" value={2} />
                                <Tab label="Categories" value={3} />
                            </Tabs>
                        </div>

                        {renderTab(value)}

                    </div>
                    
                </div>



            </Modal.Body>
        </Modal>
    )
}

export default InspectArtifact;