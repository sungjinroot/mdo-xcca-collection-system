import './InspectContacts.css';

function InspectContacts(props) {

    const roleLabelMap = {
        "A": "donor",
        "B": "lender",
        "C": "archaeologist",
        "D": "finder",
        "E": "buyer"
    };

    const promptMap = {
        "A": "Date of when the artifact was donated",
        "B": "Date of when the artifact was loaned",
        "C": "Date of when the artifact was excavated",
        "D": "Date of when the artifact was found",
        "E": "Date of when the artifact was purchased"
    };

    const role = roleLabelMap[props.currentArtifactData.acquisition.collectionType];



    return (
        <div className="inspect-contacts-container">

            <div className="inspect-contacts-box">
                <div className="inspect-contacts-row">
                    <div className="inspect-contacts-fields">
                        <label>Full name of the {role}</label>
                        <input type="text" value={props.currentArtifactData.contactpersons.contactPersonFullName}/>
                    </div>

                    <div className="inspect-contacts-fields">
                        <label>Full name of the receiver</label>
                        <input type="text" value={props.currentArtifactData.contactpersons.receiverFullName}/>
                    </div>
                </div>
            </div>

            <div className="inspect-contacts-box">
                <div className="inspect-contacts-fields">
                    <label>Recorded By</label>
                    <input type="text" value={props.currentArtifactData.contactpersons.recordedBy}/>
                </div>
            </div>

            <div className="inspect-contacts-box">
                <div className="inspect-contacts-row">
                    <div className="inspect-contacts-fields">
                        <label>{promptMap[props.currentArtifactData.acquisition.collectionType]}</label>
                        <input type="date" value={props.currentArtifactData.contactpersons.dateCollectedByContactPerson?.split('T')[0]}/>
                    </div>

                    <div className="inspect-contacts-fields">
                        <label>Date of when the artifact was received</label>
                        <input type="date" value={props.currentArtifactData.contactpersons.receivedByReceiverDate?.split('T')[0]}/>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default InspectContacts;