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





                <div className="stepper-right">
                    <div className="stepper-acquisition-collection-means-container-usual">
                        <h3> How artifact was collected </h3>

                        <div className="stepper-acquisition-collection-means-fields">
                            <div className="stepper-acquisition-collection-means-forms">
                                <input type="radio" name="collection"/>
                                <label> Donated </label>
                            </div>

                            <div className="stepper-acquisition-collection-means-forms">
                                <input type="radio" name="collection"/>
                                <label> Excavated </label>
                            </div>

                        </div>

                        <div className="stepper-acquisition-collection-means-fields">
                            
                            <div className="stepper-acquisition-collection-means-forms">

                                <input type="radio" name="collection"/>
                                <label> On Loan </label>
                            </div>

                            <div className="stepper-acquisition-collection-means-forms">

                                <input type="radio" name="collection"/>
                                <label> Found </label>
                            </div>

                        </div>

                    </div>

                    <div className="stepper-acquisition-collection-means-container-special">
                        <div className="stepper-acquisition-purchased-option">
                            <label> Purchased </label>
                            <input type="radio" name="collection"/>
                        </div>
                        

                        <div className="stepper-acquisition-price-input">
                            <input type="number" placeholder='Price...'/>
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