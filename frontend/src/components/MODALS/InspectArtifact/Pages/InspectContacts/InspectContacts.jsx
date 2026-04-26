import './InspectContacts.css';

function InspectContacts() {
    return (
        <div className="inspect-contacts-container">

            <div className="inspect-contacts-box">
                <div className="inspect-contacts-row">
                    <div className="inspect-contacts-fields">
                        <label>Full name of the donor</label>
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
                        <label>Date when the artifact was given to the musuem </label>
                        <input type="date" />
                    </div>

                    <div className="inspect-contacts-fields">
                        <label>Date when the artifact was received by the receipient</label>
                        <input type="date" />
                    </div>
                </div>
            </div>

        </div>
    );
}

export default InspectContacts;