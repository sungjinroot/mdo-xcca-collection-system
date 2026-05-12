import './ContactPersons.css';
import '../Layout.css';
import '../../NewArtifact.css';

function ContactPersons({ prevStep, nextStep, collectionType,artifactContacts,setArtifactContacts }){

    const roleLabelMap = {
        "A": "donor",
        "B": "lender",
        "C": "archaeologist",
        "D": "finder",
        "E": "buyer"
    };

    const promptMap = {
        "A": "donated",
        "B": "loaned",
        "C": "turned over",
        "D": "turned over",
        "E": "sold"
    };

    const role = roleLabelMap[collectionType];

    const handleContactsChange = (e) => {
        const { name, value } = e.target;
        setArtifactContacts({
            ...artifactContacts,
            [name]: value
        });
    };

    const isFormValid = artifactContacts.contactPersonFullName?.trim() && artifactContacts.receiverFullName?.trim() && artifactContacts.recordedBy?.trim() && artifactContacts.dateCollectedByContactPerson && artifactContacts.receivedByReceiverDate;

    return (
    
        <div className="stepper-container">
            <div className="stepper-content">
                <div className="stepper-left">
                    <div className="stepper-contact-person-container-left">
                        <div className="stepper-contact-person-fields">
                            <label>
                                Full name of the {role} <span className="required">*</span> 
                            </label>
                            <input type="text" name="contactPersonFullName" value={artifactContacts.contactPersonFullName} onChange={handleContactsChange}/>
                        </div>

                        <div className="stepper-contact-person-fields">
                            <label>
                                Full name of the receiver <span className="required">*</span> 
                            </label>
                            <input type="text" name="receiverFullName" value={artifactContacts.receiverFullName} onChange={handleContactsChange}/>
                        </div>

                        <div className="stepper-contact-person-fields">
                            <label>
                                Recorded By <span className="required">*</span> 
                            </label>
                            <input type="text" name="recordedBy" value={artifactContacts.recordedBy} onChange={handleContactsChange} />
                        </div>
                    </div>
                </div>













                <div className="stepper-right">
                    <div className="stepper-contact-person-container-right">
                        <div className="stepper-contact-person-date-fields">
                            <label>
                                Date of when the artifact was collected by the {role} <span className="required">*</span> 
                            </label>
                            <input type="date" name="dateCollectedByContactPerson" value={artifactContacts.dateCollectedByContactPerson} onChange={handleContactsChange}/>
                        </div>

                        <div className="stepper-contact-person-date-fields">
                            <label>
                                Date of when the artifact was {promptMap[collectionType]} to the musuem <span className="required">*</span> 
                            </label>
                            <input type="date" name="receivedByReceiverDate" value={artifactContacts.receivedByReceiverDate} onChange={handleContactsChange} />
                        </div>
                    </div>


                </div>
            </div>

            <div className="stepper-navigation-multi">
                <div className="stepper-navigation-left" onClick={() => prevStep()}> Previous </div> 
                <div className={`stepper-navigation-right ${!isFormValid ? 'disabled' : ''}`} onClick={() => {if (isFormValid) nextStep();}}>
                    Continue
                </div>
            </div>
        </div>
    
    )
}


export default ContactPersons;