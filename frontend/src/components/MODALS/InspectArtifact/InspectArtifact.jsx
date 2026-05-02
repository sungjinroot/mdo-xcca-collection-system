import Modal from 'react-bootstrap/Modal';
import './InspectArtifact.css';
import { Tabs, Tab } from "@mui/material";

import { useState } from 'react';

import InspectAcquisition from './Pages/InspectAcquisition/InspectAcquisition.jsx';
import InspectContacts from './Pages/InspectContacts/InspectContacts.jsx';
import InspectPhysical from './Pages/InspectPhysical/InspectPhysical.jsx';

import PrimaryView from './PrimaryView/PrimaryView.jsx';
import PrimaryInfo from './PrimaryInfo/PrimaryInfo.jsx';

function renderTab(current,collectionType,setCollectionType, priceVisible, setPriceVisible){
    switch (current){
        case 0: 
            return (
                <InspectPhysical/>
            )
            
        case 1:
            return (
                <InspectContacts collectionType={collectionType}/>
            )
        
        case 2:
            return (
                <InspectAcquisition collectionType={collectionType} setCollectionType={setCollectionType}/>
            )
    }
}


function InspectArtifact(props){

    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const [collectionType, setCollectionType] = useState("");

    return (
        <Modal show={props.show} onHide={() => props.setShow(false)} dialogClassName='ModalSizeWidth' contentClassName='ModalSizeHeight'  aria-labelledby="example-custom-modal-styling-title" centered>
            <Modal.Header closeButton style={{ backgroundColor: '#283971' }} className="d-flex align-items-center">

                <div className="mdo-header">
                    <h3> Museo De Oro </h3>
                </div>                 
            
            </Modal.Header>
            
            <Modal.Body> 
                <div className="artifact-info-container">
                    <div className="artifact-info-left">
                        <PrimaryView/>
                        <PrimaryInfo/>
                    </div>

                    <div className="artifact-info-right">

                        <div className="tab-options">
                            <Tabs value={value} onChange={handleChange}>
                                <Tab label="Physical"  value={0} />
                                <Tab label="Contacts" value={1} />
                                <Tab label="Provenance" value={2} />
                            </Tabs>
                        </div>

                        {renderTab(value,collectionType,setCollectionType)}

                    </div>
                    
                </div>



            </Modal.Body>
        </Modal>
    )
}

export default InspectArtifact;