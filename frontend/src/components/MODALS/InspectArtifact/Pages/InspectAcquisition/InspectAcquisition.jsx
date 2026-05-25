import { useState, useEffect, useRef, useCallback } from 'react';
import './InspectAcquisition.css';

const DEBOUNCE_DELAY = 500;

function InspectAcquisition(props) {
  const artifactID = props.currentArtifactData.artifacts.artifactID;

  const [ethnicGroup, setEthnicGroup] = useState(props.currentArtifactData.artifactprovenance.ethnicGroup);
  const [placeOfOrigin, setPlaceOfOrigin] = useState(props.currentArtifactData.artifactprovenance.placeOfOrigin);
  const [locality, setLocality] = useState(props.currentArtifactData.artifactprovenance.locality);
  const [collectionType, setCollectionType] = useState(props.currentArtifactData.acquisition.collectionType);
  const [price, setPrice] = useState(props.currentArtifactData.acquisition.price);

  const [provenanceSaveStatus, setProvenanceSaveStatus] = useState("idle");
  const [acquisitionSaveStatus, setAcquisitionSaveStatus] = useState("idle");

  const provenanceTimer = useRef(null);
  const acquisitionTimer = useRef(null);
  const isFirstLoad = useRef(true);

  useEffect(() => {
    isFirstLoad.current = true;
    setProvenanceSaveStatus("idle");
    setAcquisitionSaveStatus("idle");

    setEthnicGroup(props.currentArtifactData.artifactprovenance.ethnicGroup);
    setPlaceOfOrigin(props.currentArtifactData.artifactprovenance.placeOfOrigin);
    setLocality(props.currentArtifactData.artifactprovenance.locality);
    setCollectionType(props.currentArtifactData.acquisition.collectionType);
    setPrice(props.currentArtifactData.acquisition.price);

    setTimeout(() => { isFirstLoad.current = false; }, 100);
  }, [artifactID]);

  const debouncedSaveProvenance = useCallback((updatedFields) => {
    if (provenanceTimer.current) clearTimeout(provenanceTimer.current);
    setProvenanceSaveStatus("saving");

    provenanceTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(`http://127.0.0.1:3000/api/v1/artifacts/${artifactID}/artifactProvenance`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedFields),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || `PUT failed: ${res.status}`);
        }

        setProvenanceSaveStatus("idle");
      } catch (err) {
        console.error('Provenance save failed:', err);
        setProvenanceSaveStatus("error");
      }
    }, DEBOUNCE_DELAY);
  }, [artifactID]);

  const debouncedSaveAcquisition = useCallback((updatedFields) => {
    if (acquisitionTimer.current) clearTimeout(acquisitionTimer.current);
    setAcquisitionSaveStatus("saving");

    acquisitionTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(`http://127.0.0.1:3000/api/v1/artifacts/${artifactID}/acquisition`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedFields),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || `PUT failed: ${res.status}`);
        }

        setAcquisitionSaveStatus("idle");
      } catch (err) {
        console.error('Acquisition save failed:', err);
        setAcquisitionSaveStatus("error");
      }
    }, DEBOUNCE_DELAY);
  }, [artifactID]);

  useEffect(() => {
    if (isFirstLoad.current) return;
    debouncedSaveProvenance({ ethnicGroup });
  }, [ethnicGroup]);

  useEffect(() => {
    if (isFirstLoad.current) return;
    debouncedSaveProvenance({ placeOfOrigin });
  }, [placeOfOrigin]);

  useEffect(() => {
    if (isFirstLoad.current) return;
    debouncedSaveProvenance({ locality });
  }, [locality]);

  useEffect(() => {
    if (isFirstLoad.current) return;
    if (collectionType !== "E") {
      debouncedSaveAcquisition({ collectionType, price: null });
    } else {
      debouncedSaveAcquisition({ collectionType });
    }
  }, [collectionType]);

  useEffect(() => {
    if (isFirstLoad.current) return;
    if (collectionType !== "E") return;
    debouncedSaveAcquisition({ price });
  }, [price]);

  useEffect(() => {
    return () => {
      if (provenanceTimer.current) clearTimeout(provenanceTimer.current);
      if (acquisitionTimer.current) clearTimeout(acquisitionTimer.current);
    };
  }, []);

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

  const handleCollectionTypeChange = (type) => {
    setCollectionType(type);
  };

  const saveStatus =
    provenanceSaveStatus === "saving" || acquisitionSaveStatus === "saving"
      ? "saving"
      : provenanceSaveStatus === "error" || acquisitionSaveStatus === "error"
      ? "error"
      : "idle";

  return (
    <div className="inspect-acquisition-container">

      <div className="inspect-acquisition-origins">
        <div className="inspect-acquisition-origins-card">
          <label>Ethnic Group</label>
          <input type="text" value={ethnicGroup} onChange={(e) => setEthnicGroup(e.target.value)} />
        </div>
        <div className="inspect-acquisition-origins-card">
          <label>Place Of Origin</label>
          <input type="text" value={placeOfOrigin} onChange={(e) => setPlaceOfOrigin(e.target.value)} />
        </div>
        <div className="inspect-acquisition-origins-card">
          <label>Locality</label>
          <input type="text" value={locality} onChange={(e) => setLocality(e.target.value)} />
        </div>
      </div>

      <div className="inspect-acquisition-collection">
        <label>How artifact was collected</label>
        <div className="inspect-acquisition-collection-options">
          {[
            { label: "Donated",   value: "A" },
            { label: "On Loan",   value: "B" },
            { label: "Excavated", value: "C" },
            { label: "Found",     value: "D" },
          ].map(({ label, value }) => (
            <label className="inspect-options-card" key={value}>
              {label}
              <input type="radio" name="acquisition-radio" checked={collectionType === value} onChange={() => handleCollectionTypeChange(value)}/>
            </label>
          ))}
        </div>

        <div className="inspect-acquisition-collection-options-special">
          <div className="inspect-options-card-special">
            <label className="inspect-options-card-special-found">
              Purchased
              <input type="radio" name="acquisition-radio" checked={collectionType === "E"} onChange={() => handleCollectionTypeChange("E")}/>
            </label>

            <div className="inspect-options-card-special-price" style={{ visibility: collectionType === "E" ? "visible" : "hidden" }}>
              <label>Price</label>
              <input type="text" value={price ?? ""} onChange={(e) => handlePriceChange(e.target.value)}/>
            </div>
          </div>
        </div>
      </div>

      {saveStatus === "saving" && (
        <div style={{ textAlign: 'right', fontSize: '0.85rem', color: '#aaaaaa', marginBottom: '0.5rem' }}>
          Saving...
        </div>
      )}

      {saveStatus === "error" && (
        <div style={{ textAlign: 'right', fontSize: '0.85rem', color: '#ff6b6b', marginBottom: '0.5rem' }}>
          Save failed
        </div>
      )}

    </div>
  );
}

export default InspectAcquisition;