import Modal from 'react-bootstrap/Modal';
import { useState } from 'react';
import './ModalSizeHeight.css';
import './ModalSizeWidth.css';
import './NewArtifact.css';
import { StepLabel, Stepper, Step } from '@mui/material';

import BasicInformation from './Pages/BasicInformation/BasicInformation.jsx';
import Acquisition from './Pages/Acquisition/Acquisition.jsx';
import ContactPersons from './Pages/ContactPersons/ContactPersons.jsx';
import PhysicalDescription from './Pages/PhysicalDescription/PhysicalDescription.jsx';
import ImagesPage from './Pages/ImagesPage/ImagesPage.jsx';

function NewArtifact(props) {

    const steps = ['Basic Information','Provenance','Physical Description','Contact Persons','Images'];

    const [currentStep, setCurrentStep] = useState(0);

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    // Data
    const [artifactNames, setArtifactNames] = useState({
        englishName: '',
        vernacularName: ''
    });

    const [artifactIdentifiers, setArtifactIdentifiers] = useState({
        accessionNo: '',
        catalogueNo: '',
        roomID: null,
        storageLocation: ''
    });

    const [artifactCategories, setArtifactCategories] = useState([]);

    const [artifactProvenance, setArtifactProvenance] = useState({
        ethnicGroup: '',
        placeOfOrigin: '',
        locality: '',
    });

    const [collectionType, setCollectionType] = useState("");
    const [price, setPrice] = useState(0);

    const [artifactMeasurements, setArtifactMeasurements] = useState({
        diameter: "",
        height: "",
        length: "",
        width: ""
    });

    const [artifactDescriptions,setArtifactDescriptions] = useState({
        'details': '',
        'function': '',
        'conditionUponReceipt': '',
        'specialRemarks': ''
    });

    const [artifactContacts, setArtifactContacts] = useState({
        contactPersonFullName: '',
        dateCollectedByContactPerson: '',
        receiverFullName: '',
        receivedByReceiverDate: '',
        recordedBy: ''
    });

    return (
        <Modal show={props.show} onHide={() => props.setShow(false)} contentClassName="ModalSizeHeight" dialogClassName="ModalSizeWidth" aria-labelledby="example-custom-modal-styling-title">
            <Modal.Header closeButton style={{ backgroundColor: '#283971' }} className="d-flex align-items-center">
                <div className="mdo-header">
                    <h3>Museo De Oro</h3>
                </div>
            </Modal.Header>
            
            <Modal.Body> 

                <Stepper activeStep={currentStep}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                {currentStep === 0 && (
                    <BasicInformation nextStep={nextStep} artifactNames={artifactNames} setArtifactNames={setArtifactNames} artifactIdentifiers={artifactIdentifiers} setArtifactIdentifiers={setArtifactIdentifiers}/>
                )}

                {currentStep === 1 && (
                    <Acquisition prevStep={prevStep} nextStep={nextStep} collectionType={collectionType} setCollectionType={setCollectionType} artifactProvenance={artifactProvenance} setArtifactProvenance={setArtifactProvenance}/>
                )}

                {currentStep === 2 && (
                    <PhysicalDescription prevStep={prevStep} nextStep={nextStep} artifactMeasurements={artifactMeasurements} setArtifactMeasurements={setArtifactMeasurements} artifactDescriptions={artifactDescriptions} setArtifactDescriptions={setArtifactDescriptions}/>
                )}

                {currentStep === 3 && (
                    <ContactPersons prevStep={prevStep} nextStep={nextStep} collectionType={collectionType} artifactContacts={artifactContacts} setArtifactContacts={setArtifactContacts}/>
                )}

                {currentStep === 4 && (
                    <ImagesPage prevStep={prevStep} setShow={props.setShow}/>
                )}

            </Modal.Body>
        </Modal>
    );
}

export default NewArtifact;