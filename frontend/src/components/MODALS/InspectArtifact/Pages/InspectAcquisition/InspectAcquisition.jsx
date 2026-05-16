import './InspectAcquisition.css';

function InspectAcquisition(props) {
    return (
        <div className="inspect-acquisition-container"> 

            <div className="inspect-acquisition-origins">

                <div className="inspect-acquisition-origins-card">
                    <label> Ethnic Group </label>
                    <input type="text" value={props.currentArtifactData.artifactprovenance.ethnicGroup}/>
                </div>

                <div className="inspect-acquisition-origins-card">
                    <label> Place Of Origin </label>
                    <input type="text" value={props.currentArtifactData.artifactprovenance.placeOfOrigin}/>
                </div>

                <div className="inspect-acquisition-origins-card">
                    <label> Locality </label>
                    <input type="text" value={props.currentArtifactData.artifactprovenance.locality}/>
                </div>

            </div>

            <div className="inspect-acquisition-collection">

                <label>How artifact was collected</label>

                <div className="inspect-acquisition-collection-options">

                    <label className="inspect-options-card">
                        Donated
                        <input type="radio" name="acquisition-radio"  checked={props.currentArtifactData.acquisition.collectionType === "A"}/>
                    </label>

                    <label className="inspect-options-card">
                        On Loan
                        <input type="radio" name="acquisition-radio" checked={props.currentArtifactData.acquisition.collectionType === "B"}/>
                    </label>

                    <label className="inspect-options-card">
                        Excavated
                        <input type="radio" name="acquisition-radio" checked={props.currentArtifactData.acquisition.collectionType === "C"}/>
                    </label>

                    <label className="inspect-options-card">
                        Found
                        <input type="radio" name="acquisition-radio" checked={props.currentArtifactData.acquisition.collectionType === "D"}/>
                    </label>



                </div>

                <div className="inspect-acquisition-collection-options-special">

                    <div className="inspect-options-card-special">

                        <label className="inspect-options-card-special-found">
                            Purchased
                            <input type="radio" name="acquisition-radio" checked={props.currentArtifactData.acquisition.collectionType === "E"}/>
                        </label>

                        <div className="inspect-options-card-special-price" style={{visibility: props.collectionType === "E" ? "visible" : "hidden"}}>
                            <label>Price</label>
                            <input type="number" />
                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default InspectAcquisition;