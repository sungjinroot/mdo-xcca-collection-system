import './InspectContacts.css';

function InspectContacts(props) {

    const roleLabelMap = {
        "Donated": "donor",
        "On Loan": "lender",
        "Found": "finder",
        "Excavated": "archaeologist",
        "Purchased": "buyer"
    };

    const promptMap = {
        "Donated": "Date of when the artifact was donated",
        "On Loan": "Date of when the artifact was loaned",
        "Found": "Date of when the artifact was found",
        "Excavated": "Date of when the artifact was excavated",
        "Purchased": "Date of when the artifact was purchased"
    };

    const role = roleLabelMap[props.collectionType];



    return (
        <div className="inspect-contacts-container">

            <div className="inspect-contacts-box">
                <div className="inspect-contacts-row">
                    <div className="inspect-contacts-fields">
                        <label>Full name of the {role}</label>
                        <input type="text" />
                    </div>

                    <div className="inspect-contacts-fields">
                        <label>Full name of the receiver</label>
                        <input type="text" />
                    </div>
                </div>
            </div>

            <div className="inspect-contacts-box">
                <div className="inspect-contacts-fields">
                    <label>Recorded By</label>
                    <input type="text" />
                </div>
            </div>

            <div className="inspect-contacts-box">
                <div className="inspect-contacts-row">
                    <div className="inspect-contacts-fields">
                        <label>{promptMap[props.collectionType]}</label>
                        <input type="date" />
                    </div>

                    <div className="inspect-contacts-fields">
                        <label>Date of when the artifact was received</label>
                        <input type="date" />
                    </div>
                </div>
            </div>

        </div>
    );
}

export default InspectContacts;