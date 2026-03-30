import './ContactPersons.css';
import '../Layout.css';

function ContactPersons({ prevStep, nextStep }){

    return (
    
        <div className="stepper-container">
            <div className="stepper-content">
                <div className="stepper-left">
                    <div className="stepper-contact-person-container-left">
                        <div className="stepper-contact-person-fields">
                            <label>Full name of donor/loaner/vendor</label>
                            <input type="text"/>
                        </div>

                        <div className="stepper-contact-person-fields">
                            <label>Name of the receiver of the artifact</label>
                            <input type="text"/>
                        </div>

                        <div className="stepper-contact-person-fields">
                            <label>Recorded By</label>
                            <input type="text"/>
                        </div>
                    </div>
                </div>













                <div className="stepper-right">
                    <div className="stepper-contact-person-container-right">
                        <div className="stepper-contact-person-date-fields">
                            <label>Date of when the artifact was collected by the Donor/Loaner/Vendor</label>
                            <input type="date"/>
                        </div>

                        <div className="stepper-contact-person-date-fields">
                            <label>Date of when the artifact was Donated/Sold/Loaned to the Musuem</label>
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