import '../Layout.css';
import './BasicInformation.css';
import '../../NewArtifact.css';

function BasicInformation({ nextStep,artifactNames,setArtifactNames, artifactIdentifiers, setArtifactIdentifiers, categories }) {

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

    const isFormValid = artifactNames.englishName.trim() !== "" && artifactIdentifiers.accessionNo.trim() !== "" && artifactIdentifiers.catalogueNo !== "" && artifactIdentifiers.roomID !== "";

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
                                    <option value="A1"> A1 (Historical) </option>
                                    <option value="A2"> A2 (Heritage Heirloom) </option>
                                    <option value="A3"> A3 (Ethnological) </option>
                                    <option value="A4"> A4 (Archaelogical) </option>
                                    <option value="A5"> A5 (Artworks) </option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>




                <div className="stepper-right">
                    <div className="stepper-artifact-categories-container">
                        <h3> Categorize an artifact </h3>

                        {categories && categories.map((category) => (
                            <label key={category.categoryid} className="stepper-artifact-category-fields">
                                <input type="checkbox" name="categories" value={category.categoryid} />
                                <span>{category.categoryname}</span>
                            </label>
                        ))}
                        
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

            <div className={`stepper-navigation-single ${!isFormValid ? "disabled" : ""}`} onClick={() => {if (isFormValid) nextStep();}}>
                    Continue
            </div>
        </div>
    );
}

export default BasicInformation;