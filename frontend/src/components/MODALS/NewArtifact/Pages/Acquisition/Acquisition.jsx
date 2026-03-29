import '../Layout.css';
import './Acquisition.css';

function Acquisition({ nextStep,prevStep }){
    
    
    
    return (
        <div className="stepper-container">
            <div className="stepper-content">
                <div className="stepper-left">
                    <div className="stepper-acquisition-provenance-container">
                        <h3> Provenance </h3> 

                        <div className="stepper-acquisition-provenance-fields">
                            <label> Ethnic Group </label>
                            <input type="text"/>
                        </div>

                        <div className="stepper-acquisition-provenance-fields">
                            <label> Place Of Origin </label>
                            <input type="text"/>
                        </div>

                        <div className="stepper-acquisition-provenance-fields">
                            <label> Locality </label>
                            <input type="text"/>
                        </div>
                    </div>
                </div>





                <div className="stepper-right custom-padding">
                    <div className="acquisition-header">
                        <h3> Collection Means </h3>
                    </div>  

                    <div className="acquisition-form-options">
                        <div className="acquisition-radio-form">
                            <input type="radio" name="acquisition"/>
                            <label> Donated </label>
                        </div>

                        <div className="acquisition-radio-form">
                            <input type="radio" name="acquisition"/>
                            <label> Excavated </label>
                        </div>

                        <div className="acquisition-radio-form">
                            <input type="radio" name="acquisition"/>
                            <label> On Loan </label>
                        </div>

                        <div className="acquisition-radio-form">
                            <input type="radio" name="acquisition"/>
                            <label> Found </label>
                        </div>

                        <div className="acquisition-form-options-special">
                            <input type="radio" name="acquisition"/>
                            <label> Bought </label>
                            <input type="number" className="price-field"/>
                        </div>
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


export default Acquisition;