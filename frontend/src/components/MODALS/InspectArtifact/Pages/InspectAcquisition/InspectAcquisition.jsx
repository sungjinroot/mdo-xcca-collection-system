import './InspectAcquisition.css';

function InspectAcquisition() {
    return (
        <div className="inspect-acquisition-container"> 
            
            <div className="inspect-acquisition-top">
                
                <div className="inspect-acquisition-provenance">

                    <div className="inspect-acquisition-provenance-contents">
                        <label>Provenance</label>
                        <p>Component</p>
                    </div>

                    <div className="inspect-acquisition-provenance-contents">
                        <label>Place Of Origin</label>
                        <p>Component</p>
                    </div>

                    <div className="inspect-acquisition-provenance-contents">
                        <label>Locality</label>
                        <p>Component</p>
                    </div>

                </div>
            </div>

            <div className="inspect-acquisition-bottom">
                
                <div className="inspect-acquisition-collection">
                    <div className="inspect-acquisition-collection-options">
                        <div className="acquisition-option">
                            <label> Donated </label>
                            <input type="radio" name="acquisition-radio"/>
                        </div>

                        <div className="acquisition-option">
                            <label> On Loan </label>
                            <input type="radio" name="acquisition-radio"/>
                        </div>

                        <div className="acquisition-option">
                            <label> Found </label>
                            <input type="radio" name="acquisition-radio"/>

                        </div>

                        <div className="acquisition-option">
                            <label> Excavated </label>
                            <input type="radio" name="acquisition-radio"/>
                        </div>
                    </div>

                    <div className="inspect-acquisition-collection-options-special">
                        <div className="acquisition-option">
                            <label> Purchased </label>
                            <input type="radio" name="acquisition-radio"/>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default InspectAcquisition;