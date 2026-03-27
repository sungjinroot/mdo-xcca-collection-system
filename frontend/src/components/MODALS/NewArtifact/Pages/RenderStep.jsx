import BasicInformation from "./BasicInformation.jsx";
import Acquisition from "./Acquisition.jsx";
import PhysicalDescription from "./PhysicalDescription.jsx";
import ContactPersons from "./ContactPersons.jsx";
import ImagesPage from "./ImagesPage.jsx";

function RenderStep({ current,prevStep,nextStep, setShow }){

    //Keep centralized form here

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

export default RenderStep;