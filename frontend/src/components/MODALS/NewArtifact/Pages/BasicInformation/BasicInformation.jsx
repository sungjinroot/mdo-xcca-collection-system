import '../Layout.css';
import './BasicInformation.css';
import CategoryInput from './CategoryInput/CategoryInput.jsx';

function BasicInformation({ nextStep }) {
    return (
        <div className="stepper-container">
            <div className="stepper-content">
                <div className="stepper-left">
                 
                    <div className="stepper-artifact-names-container"> 
                        <div className="stepper-artifact-names-fields">
                            <label> English Name for Artifact </label>
                            <input type="text"/>
                        </div>

                        <div className="stepper-artifact-names-fields">
                            <label> Vernacular Name for Artifact </label>
                            <input type="text"/>
                        </div>
                    </div>

                    <div className="stepper-artifact-identifiers-container">
                        <div className="stepper-artifact-identifier-fields">
                            
                            <div className="stepper-identififier-labels">
                                <label> Accession Number </label>
                                <label> Catalogue Number</label>
                            </div>

                            <div className="stepper-artifact-identifier-form"> 
                                <input type="text" className="identifier-form-size"/>
                                <select className="identifier-form-size">
                                    <option> No Catalogue</option>
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
                                <label> Storage Location </label>
                                <label> Room </label>
                            </div>

                            <div className="stepper-artifact-identifier-form"> 
                                <input type="text" className="identifier-form-size"/>
                                <select className="identifier-form-size">
                                    <option> No Room </option>
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