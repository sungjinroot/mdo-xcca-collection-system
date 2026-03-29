import '../Layout.css';

function ContactPersons({ prevStep, nextStep }){

    return (
    
        <div className="stepper-container">
            <div className="stepper-content">
                <div className="stepper-left">
                    Left Box
                </div>













                <div className="stepper-right">
                    {/* content for right box */}
                    Right Box
                </div>
            </div>

            <div className="stepper-navigation-multi">
                <div className="stepper-navigation-left" onClick={() => prevStep()}> Previous </div> 
                <div className="stepper-navigation-right" onClick={() => nextStep()}> Continue </div> 
            </div>
        </div>
    
    )
}


export default ContactPersons;