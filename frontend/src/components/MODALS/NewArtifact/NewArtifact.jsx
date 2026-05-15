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

    const resetStep = () => {
        setCurrentStep(0);
    }

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
        roomID: '',
        storageLocation: ''
    });

    const [artifactCategories, setArtifactCategories] = useState([]);

    const [artifactProvenance, setArtifactProvenance] = useState({
        ethnicGroup: '',
        placeOfOrigin: '',
        locality: '',
    });

    const [collectionType, setCollectionType] = useState('');
    const [price, setPrice] = useState('');

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

    function resetAllForm() {
        setArtifactNames({ englishName: '', vernacularName: '' });
        setArtifactIdentifiers({ accessionNo: '', catalogueNo: '', roomID: '', storageLocation: '' });
        setArtifactCategories([]);
        setArtifactProvenance({ ethnicGroup: '', placeOfOrigin: '', locality: '' });
        setCollectionType('');
        setPrice('');
        setArtifactMeasurements({ diameter: '', height: '', length: '', width: '' });
        setArtifactDescriptions({ details: '', function: '', conditionUponReceipt: '', specialRemarks: '' });
        setArtifactContacts({
            contactPersonFullName: '',
            dateCollectedByContactPerson: '',
            receiverFullName: '',
            receivedByReceiverDate: '',
            recordedBy: ''
        });
    }

    async function submitArtifact() {
        try {
            const payload = {
                accessionNo: artifactIdentifiers.accessionNo,
                catalogueNo: artifactIdentifiers.catalogueNo,
                roomID: artifactIdentifiers.roomID,
                categories: artifactCategories,
                storageLocation: artifactIdentifiers.storageLocation,

                englishName: artifactNames.englishName,
                vernacularName: artifactNames.vernacularName,

                ethnicGroup: artifactProvenance.ethnicGroup,
                locality: artifactProvenance.locality,
                placeOfOrigin: artifactProvenance.placeOfOrigin,

                contactPersonFullName: artifactContacts.contactPersonFullName,
                dateCollectedByContactPerson: artifactContacts.dateCollectedByContactPerson,
                receiverFullName: artifactContacts.receiverFullName,
                receivedByReceiverDate: artifactContacts.receivedByReceiverDate,
                recordedBy: artifactContacts.recordedBy,

                artifactDetails: artifactDescriptions.details,
                artifactFunction: artifactDescriptions.function,
                conditionUponReceipt: artifactDescriptions.conditionUponReceipt,
                specialRemarks: artifactDescriptions.specialRemarks,

                collectionType: collectionType,

                artifactDiameter: artifactMeasurements.diameter ? Number(artifactMeasurements.diameter) : null,
                artifactLength: artifactMeasurements.length,
                artifactWidth: artifactMeasurements.width,
                artifactHeight: artifactMeasurements.height,

                // include price only if needed by backend
                price: price ? Number(price) : null
            };

            const response = await fetch("http://127.0.0.1:3000/api/v1/artifacts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                resetStep();
                alert("Duplicate Accession Number");
                return null; 
            }

            const data = await response.json();
            
            resetAllForm();
            resetStep();


            return data.artifactID;

            

            //return artifactId here

        } catch (error) {
            console.error("Error submitting artifact:", error.message);
        }
    }

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
                    <BasicInformation nextStep={nextStep} artifactNames={artifactNames} setArtifactNames={setArtifactNames} artifactIdentifiers={artifactIdentifiers} setArtifactIdentifiers={setArtifactIdentifiers} artifactCategories={artifactCategories} setArtifactCategories={setArtifactCategories} categories={props.categories} rooms={props.rooms}/>                )}

                {currentStep === 1 && (
                    <Acquisition prevStep={prevStep} nextStep={nextStep} collectionType={collectionType} setCollectionType={setCollectionType} artifactProvenance={artifactProvenance} setArtifactProvenance={setArtifactProvenance} price={price} setPrice={setPrice}/>
                )}

                {currentStep === 2 && (
                    <PhysicalDescription prevStep={prevStep} nextStep={nextStep} artifactMeasurements={artifactMeasurements} setArtifactMeasurements={setArtifactMeasurements} artifactDescriptions={artifactDescriptions} setArtifactDescriptions={setArtifactDescriptions}/>
                )}

                {currentStep === 3 && (
                    <ContactPersons prevStep={prevStep} nextStep={nextStep} collectionType={collectionType} artifactContacts={artifactContacts} setArtifactContacts={setArtifactContacts}/>
                )}

                {currentStep === 4 && (
                    <ImagesPage prevStep={prevStep} setShow={props.setShow} submitArtifact={submitArtifact} resetAllForm={resetAllForm} resetStep={resetStep} initiateArtifactSearch={props.initiateArtifactSearch}/>
                )}

            </Modal.Body>
        </Modal>
    );
}

export default NewArtifact;