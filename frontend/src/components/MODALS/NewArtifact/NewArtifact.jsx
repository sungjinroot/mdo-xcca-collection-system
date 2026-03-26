import Modal from 'react-bootstrap/Modal';
import { useState } from 'react';
import './ModalSizeHeight.css';
import './ModalSizeWidth.css';
import { StepLabel,Stepper,Step } from '@mui/material';


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

    
    return (
        <Modal show={props.show} onHide={() => props.setShow(false)} contentClassName="ModalSizeHeight" dialogClassName="ModalSizeWidth" aria-labelledby="example-custom-modal-styling-title">
            <Modal.Header closeButton style={{ backgroundColor: '#283971' }} className="d-flex align-items-center">
                <img src="src/assets/logo.png"/>

                <h3 className="mx-auto text-white">New Artifact</h3>
                
            
            </Modal.Header>
            
            <Modal.Body> 

                <Stepper activeStep={currentStep}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                <button onClick={() => prevStep()}>
                    Prev
                </button>

                <button onClick={() => nextStep()}>
                    Next
                </button>

                
              

            </Modal.Body>
        </Modal>
  );
}

export default NewArtifact;