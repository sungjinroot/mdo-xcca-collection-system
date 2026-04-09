import './InspectPhysical.css';
import '../../../NewArtifact/Pages/PhysicalDescription/PhysicalDescription.css';

function InspectPhysical(){
    
    return (
        <div className="inspect-physical-container">
            <div className="inspect-physical-dimensions">
                <div className="inspect-physical-top-fields">
                    <label> Diameter (for round artifact) </label>
                    <input type="number"/>
                </div>

                
                <div className="inspect-physical-lwh">
                    <div className="inspect-physical-top-lwh-fields">
                        <label> Length (cm) </label>
                        <input type="number"/>
                    </div>

                    <div className="inspect-physical-top-lwh-fields">
                        <label> Width (cm) </label>
                        <input type="number"/>

                    </div>

                    <div className="inspect-physical-top-lwh-fields">
                        <label> Height (cm) </label>
                        <input type="number"/>
                    </div>
                </div>
                
            </div>

            <div className="stepper-physical-description-paragraph-container">
                <label> Special Remarks </label>
                <textarea>
                        
                </textarea>
            </div>

            <div className="stepper-physical-description-paragraph-container">
                <label> Details </label>
                <textarea>
                        
                </textarea>
                
            </div>

            <div className="stepper-physical-description-paragraph-container">
                <label> Function </label>
                <textarea>
                            
                </textarea>
            </div>

            <div className="stepper-physical-description-paragraph-container">
                <label> Condition of the artifact upon receipt </label>
                <textarea>
                            
                </textarea>
            </div>

        </div>
    )
}

export default InspectPhysical;