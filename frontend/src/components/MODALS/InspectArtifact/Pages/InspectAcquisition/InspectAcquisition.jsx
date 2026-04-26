import './InspectAcquisition.css';

function InspectAcquisition() {
    return (
        <div className="inspect-acquisition-container"> 
            <div className="inspect-acquisition-origins">
                <div className="inspect-acquisition-origins-card">
                    <label> Provenance </label>
                    <input type="text"/>
                </div>

                <div className="inspect-acquisition-origins-card">
                    <label> Place Of Origin </label>
                    <input type="text"/>
                </div>

                <div className="inspect-acquisition-origins-card">
                    <label> Locality </label>
                    <input type="text"/>
                </div>
            </div>

            <div className="inspect-acquisition-collection">
                <label> How artifact was collected </label>
                <div className="inspect-acquisition-collection-options">

                    <div className="inspect-options-card">
                        <label> Donated </label>
                        <input type="checkbox"/>
                    </div>

                    <div className="inspect-options-card">
                        <label> On Loan </label>
                        <input type="checkbox"/>
                    </div>

                    <div className="inspect-options-card">
                        <label> Found </label>
                        <input type="checkbox"/>
                    </div>

                    <div className="inspect-options-card">
                        <label> Excavated </label>
                        <input type="checkbox"/>
                    </div>
                </div>

                <div className="inspect-acquisition-collection-options-special">
                    <div className="inspect-options-card-special">
                        <div className="inspect-options-card-special-found">
                            <label> Found </label>
                            <input type="checkbox"/>
                        </div>
                        
                        <div className="inspect-options-card-special-price">
                            <label> Price </label>
                            <input type="number"/>
                        </div>
                    </div>
                </div>

                
            </div>
               

        </div>
    );
}

export default InspectAcquisition;