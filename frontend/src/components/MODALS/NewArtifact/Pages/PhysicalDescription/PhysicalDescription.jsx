import '../Layout.css';
import './PhysicalDescription.css'
import '../../NewArtifact.css';


function PhysicalDescription({ prevStep, nextStep, artifactMeasurements, setArtifactMeasurements, artifactDescriptions, setArtifactDescriptions }){

    const handleMeasurementChange = (field, value) => {
        const regex = /^\d*\.?\d*$/; 

        if (value === "" || regex.test(value)) {
            setArtifactMeasurements(prev => ({
                ...prev,
                [field]: value
            }));
        }
    };

    const handleDescriptionChange = (field, value) => {
        setArtifactDescriptions(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
    
        <div className="stepper-container">
            <div className="stepper-content">
                <div className="stepper-left">
                    <div className="stepper-physical-description-container">
                        <h3>
                            Dimensions (highest point) <span className="required">*</span> 
                        </h3>
                    
                        <div className="stepper-physical-description-fields">
                            <label> Diameter (for round artifact) </label>
                            <input type="text" value={artifactMeasurements.diameter} onChange={(e) => handleMeasurementChange('diameter', e.target.value)}/>
                        </div>

                        <div className="stepper-physical-description-sizes">
                            <div className="stepper-physical-description-fields">
                                <label> Height (cm) </label>
                                <input type="text" value={artifactMeasurements.height} onChange={(e) => handleMeasurementChange('height', e.target.value)}/>
                            </div>

                            <div className="stepper-physical-description-fields">
                                <label> Length (cm) </label>
                                <input type="text" value={artifactMeasurements.length} onChange={(e) => handleMeasurementChange('length', e.target.value)}/>
                            </div>

                            <div className="stepper-physical-description-fields">
                                <label> Width (cm) </label>
                                <input type="text" value={artifactMeasurements.width} onChange={(e) => handleMeasurementChange('width', e.target.value)}/>
                            </div>
                        </div>

                    </div>
                    
                    <div className="stepper-physical-description-paragraph-container">
                        <label> Special Remarks </label>
                        <textarea value={artifactDescriptions.specialRemarks} onChange={(e) => handleDescriptionChange('specialRemarks', e.target.value)}>
                        
                        </textarea>
                    </div>

                </div>













                <div className="stepper-right">
                    <div className="stepper-physical-description-paragraph-container">
                        <label> Details </label>
                        <textarea value={artifactDescriptions.details} onChange={(e) => handleDescriptionChange('details', e.target.value)}>
                        
                        </textarea>
                    </div>

                    <div className="stepper-physical-description-paragraph-container">
                        <label> Function </label>
                        <textarea value={artifactDescriptions.function} onChange={(e) => handleDescriptionChange('function', e.target.value)}>
                            
                        </textarea>
                    </div>

                    <div className="stepper-physical-description-paragraph-container">
                        <label> Condition of the artifact upon receipt </label>
                        <textarea value={artifactDescriptions.conditionUponReceipt} onChange={(e) => handleDescriptionChange('conditionUponReceipt', e.target.value)}>
                            
                        </textarea>
                    </div>




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