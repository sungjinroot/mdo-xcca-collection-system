import './InspectAcquisition.css';

function InspectAcquisition() {
    return (
        <div className="inspect-acquisition-container"> 
            
            <div className="inspect-acquisition-top">
                
                <label>Provenance</label>

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
                <div className="inspect-aquisition-collection">
                    test
                </div>
            </div>

        </div>
    );
}

export default InspectAcquisition;