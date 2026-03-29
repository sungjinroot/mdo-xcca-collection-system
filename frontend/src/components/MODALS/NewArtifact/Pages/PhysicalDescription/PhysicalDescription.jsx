import '../Layout.css';
import './PhysicalDescription.css'

function PhysicalDescription({ prevStep, nextStep }){
    return (
    
        <div className="stepper-container">
            <div className="stepper-content">
                <div className="stepper-left">
                    <div className="stepper-physical-description-container">
                        <h3>Dimensions (in cm)</h3>
                    
                        <div className="stepper-physical-description-fields">
                            <label> Diameter (for round artifact) </label>
                            <input type="number"/>
                        </div>

                        <div className="stepper-physical-description-fields">
                            <label> Height (for highest point) </label>
                            <input type="number"/>
                        </div>

                        <div className="stepper-physical-description-fields">
                            <label> Length (longest point) </label>
                            <input type="number"/>
                        </div>

                        <div className="stepper-physical-description-fields">
                            <label> Width (widest point) </label>
                            <input type="number"/>
                        </div>

                    </div>

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


export default PhysicalDescription;