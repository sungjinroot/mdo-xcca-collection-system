import './ContactPersons.css';
import '../Layout.css';
import '../../NewArtifact.css';

function ContactPersons({ prevStep, nextStep, collectionType }){

    const roleLabelMap = {
        "Donated": "donor",
        "On Loan": "lender",
        "Found": "finder",
        "Excavated": "archaeologist",
        "Purchased": "buyer"
    };

    const promptMap = {
        "Donated": "donated",
        "On Loan": "loaned",
        "Found": "turned over",
        "Excavated": "turned over",
        "Purchased": "sold"
    };

    const role = roleLabelMap[collectionType];

    return (
    
        <div className="stepper-container">
            <div className="stepper-content">
                <div className="stepper-left">
                    <div className="stepper-contact-person-container-left">
                        <div className="stepper-contact-person-fields">
                            <label>
                                Full name of the {role} <span className="required">*</span> 
                            </label>
                            <input type="text"/>
                        </div>

                        <div className="stepper-contact-person-fields">
                            <label>
                                Full name of the receiver <span className="required">*</span> 
                            </label>
                            <input type="text"/>
                        </div>

                        <div className="stepper-contact-person-fields">
                            <label>
                                Recorded By <span className="required">*</span> 
                            </label>
                            <input type="text"/>
                        </div>
                    </div>
                </div>













                <div className="stepper-right">
                    <div className="stepper-contact-person-container-right">
                        <div className="stepper-contact-person-date-fields">
                            <label>
                                Date of when the artifact was collected by the {role} <span className="required">*</span> 
                            </label>
                            <input type="date"/>
                        </div>

                        <div className="stepper-contact-person-date-fields">
                            <label>
                                Date of when the artifact was {promptMap[collectionType]} to the Musuem <span className="required">*</span> 
                            </label>
                            <input type="date"/>
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


export default ContactPersons;