import '../Layout.css';
import './Acquisition.css';
import '../../NewArtifact.css';
import { useEffect } from 'react';

function Acquisition({ nextStep, prevStep, collectionType ,setCollectionType, artifactProvenance, setArtifactProvenance, price, setPrice }) {

    useEffect(() => {
        if (collectionType !== "Purchased") {
            setPrice("");
        }
    }, [collectionType]);

    const handleProvenanceChange = (field, value) => {
        setArtifactProvenance(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handlePriceChange = (value) => {
        if (value === "") {
            setPrice(value);
            return;
        }

        const regex = /^\d*\.?\d*$/;

        if (regex.test(value)) {
            setPrice(value);
        }
    };

    const isValid = () => {
        if (!collectionType) return false;

        if (collectionType === "Purchased") {
            const strictRegex = /^\d+(\.\d+)?$/;
            return strictRegex.test(price);
        }
        return true;
    };

    return (
        <div className="stepper-container">
            <div className="stepper-content">

                <div className="stepper-left">
                    <div className="stepper-acquisition-provenance-container">
                        <h3>Provenance</h3>

                        <div className="stepper-acquisition-provenance-fields">
                            <label>Ethnic Group</label>
                            <input type="text" value={artifactProvenance.ethnicGroup} onChange={(e) => handleProvenanceChange('ethnicGroup', e.target.value)}/>
                        </div>

                        <div className="stepper-acquisition-provenance-fields">
                            <label>Place Of Origin</label>
                            <input type="text" value={artifactProvenance.placeOfOrigin} onChange={(e) => handleProvenanceChange('placeOfOrigin', e.target.value)}/>
                        </div>

                        <div className="stepper-acquisition-provenance-fields">
                            <label>Locality</label>
                            <input type="text" value={artifactProvenance.locality} onChange={(e) => handleProvenanceChange('locality', e.target.value)}/>
                        </div>
                    </div>
                </div>

                <div className="stepper-right">

                    <div className="stepper-acquisition-collection-means-container-usual">
                        <h3>
                            How artifact was collected <span className="required">*</span>
                        </h3>

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
                            <span className="required">*</span>
                            <input type="text" placeholder="Price..." value={price} onChange={(e) => handlePriceChange(e.target.value)}/>
                        </div>

                    </div>

                </div>
            </div>

            <div className="stepper-navigation-multi">
                <div className="stepper-navigation-left" onClick={() => prevStep()}>
                    Previous
                </div>

                <div className={`stepper-navigation-right ${!isValid() ? "disabled" : ""}`} onClick={() => {if (isValid()) nextStep();}}>
                    Continue
                </div>
            </div>
        </div>
    );
}

export default Acquisition;