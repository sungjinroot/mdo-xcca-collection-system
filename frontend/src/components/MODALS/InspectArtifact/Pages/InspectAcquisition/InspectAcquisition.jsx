import './InspectAcquisition.css';

function InspectAcquisition(props) {
    return (
        <div className="inspect-acquisition-container"> 

            <div className="inspect-acquisition-origins">

                <div className="inspect-acquisition-origins-card">
                    <label> Ethnic Group </label>
                    <input type="text" />
                </div>

                <div className="inspect-acquisition-origins-card">
                    <label> Place Of Origin </label>
                    <input type="text" />
                </div>

                <div className="inspect-acquisition-origins-card">
                    <label> Locality </label>
                    <input type="text" />
                </div>

            </div>

            <div className="inspect-acquisition-collection">

                <label>How artifact was collected</label>

                <div className="inspect-acquisition-collection-options">

                    <label className="inspect-options-card">
                        Donated
                        <input type="radio" name="acquisition-radio"  checked={props.collectionType === "Donated"} onChange={() => props.setCollectionType("Donated")}/>
                    </label>

                    <label className="inspect-options-card">
                        On Loan
                        <input type="radio" name="acquisition-radio" checked={props.collectionType === "On Loan"} onChange={() => props.setCollectionType("On Loan")}/>
                    </label>

                    <label className="inspect-options-card">
                        Found
                        <input type="radio" name="acquisition-radio" checked={props.collectionType === "Found"} onChange={() => props.setCollectionType("Found")}/>
                    </label>

                    <label className="inspect-options-card">
                        Excavated
                        <input type="radio" name="acquisition-radio" checked={props.collectionType === "Excavated"} onChange={() => props.setCollectionType("Excavated")}/>
                    </label>

                </div>

                <div className="inspect-acquisition-collection-options-special">

                    <div className="inspect-options-card-special">

                        <label className="inspect-options-card-special-found">
                            Purchased
                            <input type="radio" name="acquisition-radio" checked={props.collectionType === "Purchased"} onChange={() => props.setCollectionType("Purchased")}/>
                        </label>

                        <div className="inspect-options-card-special-price" style={{visibility: props.collectionType === "Purchased" ? "visible" : "hidden"}}>
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