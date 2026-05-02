import '../Layout.css';
import './Acquisition.css';

function Acquisition({ nextStep, prevStep, collectionType ,setCollectionType }) {

    return (
        <div className="stepper-container">
            <div className="stepper-content">

                <div className="stepper-left">
                    <div className="stepper-acquisition-provenance-container">
                        <h3>Provenance</h3>

                        <div className="stepper-acquisition-provenance-fields">
                            <label>Ethnic Group</label>
                            <input type="text" />
                        </div>

                        <div className="stepper-acquisition-provenance-fields">
                            <label>Place Of Origin</label>
                            <input type="text" />
                        </div>

                        <div className="stepper-acquisition-provenance-fields">
                            <label>Locality</label>
                            <input type="text" />
                        </div>
                    </div>
                </div>

                <div className="stepper-right">

                    <div className="stepper-acquisition-collection-means-container-usual">
                        <h3>How artifact was collected</h3>

                        <div className="stepper-acquisition-collection-means-fields">

                            <div className="stepper-acquisition-collection-means-forms">
                                <label className="radio-card">
                                    <span>Donated</span>
                                    <input type="radio" name="collection" value="Donated" checked={collectionType === "Donated"} onChange={(e) => setCollectionType(e.target.value)}/>

                                </label>
                            </div>

                            <div className="stepper-acquisition-collection-means-forms">
                                <label className="radio-card">
                                    <span>Excavated</span>
                                    <input type="radio" name="collection" value="Excavated" checked={collectionType === "Excavated"} onChange={(e) => setCollectionType(e.target.value)}/>
                                </label>
                            </div>

                        </div>

                        <div className="stepper-acquisition-collection-means-fields">

                            <div className="stepper-acquisition-collection-means-forms">
                                <label className="radio-card">
                                    <span>On Loan</span>
                                    <input type="radio" name="collection" value="On Loan" checked={collectionType === "On Loan"} onChange={(e) => setCollectionType(e.target.value)}/>
                                </label>
                            </div>

                            <div className="stepper-acquisition-collection-means-forms">
                                <label className="radio-card">
                                    <span>Found</span>
                                    <input type="radio" name="collection" value="Found" checked={collectionType === "Found"} onChange={(e) => setCollectionType(e.target.value)}/>
                                </label>
                            </div>

                        </div>
                    </div>

                    <div className="stepper-acquisition-collection-means-container-special">

                        <div className="stepper-acquisition-purchased-option">
                            <label className="radio-card">
                                <span>Purchased</span>
                                <input type="radio" name="collection" value="Purchased" checked={collectionType === "Purchased"} onChange={(e) => setCollectionType(e.target.value)}/>
                            </label>
                        </div>

                        <div className="stepper-acquisition-price-input" style={{visibility: collectionType === "Purchased" ? "visible" : "hidden"}}>
                            <input type="number" placeholder="Price..." />
                        </div>

                    </div>

                </div>
            </div>

            <div className="stepper-navigation-multi">
                <div
                    className="stepper-navigation-left"
                    onClick={() => prevStep()}
                >
                    Previous
                </div>

                <div
                    className="stepper-navigation-right"
                    onClick={() => nextStep()}
                >
                    Continue
                </div>
            </div>
        </div>
    );
}

export default Acquisition;