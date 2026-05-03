import '../Layout.css';
import './BasicInformation.css';
import '../../NewArtifact.css';
import CategoryInput from './CategoryInput/CategoryInput.jsx';

function BasicInformation({ nextStep,artifactNames,setArtifactNames, artifactIdentifiers, setArtifactIdentifiers }) {

    const handleArtifactNameChange = (e) => {
        const { name, value } = e.target;

        setArtifactNames(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleArtifactIdentifierChange = (e) => {
        const { name, value } = e.target;

        setArtifactIdentifiers(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="stepper-container">
            <div className="stepper-content">
                <div className="stepper-left">
                 
                    <div className="stepper-artifact-names-container"> 
                        <div className="stepper-artifact-names-fields">
                            <label> 
                                English Name for Artifact <span className="required">*</span>
                            </label>
                            <input type="text" name="englishName" value={artifactNames.englishName} onChange={handleArtifactNameChange}/>
                        </div>

                        <div className="stepper-artifact-names-fields">
                            <label> Vernacular Name for Artifact </label>
                            <input name="vernacularName" type="text" value={artifactNames.vernacularName} onChange={handleArtifactNameChange}/>
                        </div>
                    </div>

                    <div className="stepper-artifact-identifiers-container">
                        <div className="stepper-artifact-identifier-fields">
                            
                            <div className="stepper-identififier-labels">
                                <label> 
                                    Accession Number <span className="required">*</span>
                                </label>
                                
                                <label> 
                                    Catalogue Number <span className="required">*</span>
                                </label>
                            </div>

                            <div className="stepper-artifact-identifier-form"> 
                                <input type="text" className="identifier-form-size" name="accessionNo" value={artifactIdentifiers.accessionNo} onChange={handleArtifactIdentifierChange}/>
                                <select className="identifier-form-size" name="catalogueNo" value={artifactIdentifiers.catalogueNo} onChange={handleArtifactIdentifierChange}>
                                    <option value="">Tap to select</option>
                                    <option> A1 </option>
                                    <option> A2 </option>
                                    <option> A3 </option>
                                    <option> A4 </option>
                                    <option> A5 </option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>




                <div className="stepper-right">
                    <div className="stepper-artifact-categories-container">
                        <h3> Categorize an artifact </h3>

                        <CategoryInput/>
                        <CategoryInput/>
                        <CategoryInput/>
                        <CategoryInput/>
                        <CategoryInput/>
                        
                    </div> 

                    <div className="stepper-artifact-identifiers-container">
                        <div className="stepper-artifact-identifier-fields">
                            
                            <div className="stepper-identififier-labels">
                                <label> 
                                    Storage Location 
                                </label>

                                <label> 
                                    Room <span className="required">*</span> 
                                </label>
                            </div>

                            <div className="stepper-artifact-identifier-form"> 
                                <input type="text" className="identifier-form-size" name="storageLocation" value={artifactIdentifiers.storageLocation} onChange={handleArtifactIdentifierChange}/>
                                <select className="identifier-form-size" name="roomID" value={artifactIdentifiers.roomID || ""} onChange={handleArtifactIdentifierChange}>
                                    <option value="">Tap To Select Room</option>
                                    <option value="1">Room 1</option>
                                    <option value="2">Room 2</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    

                    

                </div>
            </div>

            <div className="stepper-navigation-single" onClick={() => nextStep()}>
                Continue 
            </div>
        </div>
    );
}

export default BasicInformation;