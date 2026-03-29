import Modal from 'react-bootstrap/Modal';
import { useState } from 'react';
import './ModalSizeHeight.css';
import './ModalSizeWidth.css';
import { StepLabel,Stepper,Step } from '@mui/material';

import BasicInformation from './Pages/BasicInformation/BasicInformation.jsx';
import Acquisition from './Pages/Acquisition/Acquisition.jsx';
import ContactPersons from './Pages/ContactPersons/ContactPersons.jsx';
import PhysicalDescription from './Pages/PhysicalDescription/PhysicalDescription.jsx';
import ImagesPage from './Pages/ImagesPage.jsx';

function RenderStep(current,prevStep,nextStep, setShow){

    switch (current){
        case 0: 
            return (         
                <BasicInformation nextStep={nextStep}/>
            )

        case 1:
            return (
                <Acquisition prevStep={prevStep} nextStep={nextStep}/>
            )

        case 2:
            return (
                <PhysicalDescription prevStep={prevStep} nextStep={nextStep}/>
            )
        
        case 3:
            return (
                <ContactPersons prevStep={prevStep} nextStep={nextStep}/>
            )
        
        case 4:
            return (
                <ImagesPage prevStep={prevStep} setShow={setShow}/>
            )
    }
}

function NewArtifact(props){

    const steps = ['Basic Information','Acquisition','Physical Description','Contact Persons','Images']

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

    //Data here

    
    return (
        <Modal show={props.show} onHide={() => props.setShow(false)} contentClassName="ModalSizeHeight" dialogClassName="ModalSizeWidth" aria-labelledby="example-custom-modal-styling-title" centered>
            <Modal.Header closeButton style={{ backgroundColor: '#283971' }} className="d-flex align-items-center">
                <img src="src/assets/logo.png"/>

                <h3 className="mx-auto text-white">New Artifact Entry</h3>
                
            
            </Modal.Header>
            
            <Modal.Body> 

                <Stepper activeStep={currentStep}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                
                {RenderStep(currentStep,prevStep,nextStep,props.setShow)}

            </Modal.Body>
        </Modal>
  );
}


export default NewArtifact;