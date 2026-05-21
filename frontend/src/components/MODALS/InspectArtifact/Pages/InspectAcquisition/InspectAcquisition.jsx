import { useState, useEffect, useRef, useCallback } from 'react';
import './InspectAcquisition.css';

const DEBOUNCE_DELAY = 500;

function InspectAcquisition(props) {
  const artifactID = props.currentArtifactData.artifacts.artifactID;

  const [ethnicGroup, setEthnicGroup] = useState(props.currentArtifactData.artifactprovenance.ethnicGroup);
  const [placeOfOrigin, setPlaceOfOrigin] = useState(props.currentArtifactData.artifactprovenance.placeOfOrigin);
  const [locality, setLocality] = useState(props.currentArtifactData.artifactprovenance.locality);
  const [price, setPrice] = useState(props.currentArtifactData.acquisition.price);
  const [saveStatus, setSaveStatus] = useState("idle");

  const debounceTimer = useRef(null);
  const isFirstLoad = useRef(true);

  useEffect(() => {
    isFirstLoad.current = true;
    setSaveStatus("idle");

    setEthnicGroup(props.currentArtifactData.artifactprovenance.ethnicGroup);
    setPlaceOfOrigin(props.currentArtifactData.artifactprovenance.placeOfOrigin);
    setLocality(props.currentArtifactData.artifactprovenance.locality);
    setPrice(props.currentArtifactData.acquisition.price);

    setTimeout(() => { isFirstLoad.current = false; }, 100);
  }, [artifactID]);

  useEffect(() => {
    if (isFirstLoad.current) return;
    if (props.currentArtifactData.acquisition.collectionType !== "E") {
      setPrice("");
    }
  }, [props.currentArtifactData.acquisition.collectionType]);

  const debouncedSaveProvenance = useCallback((updatedFields) => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    setSaveStatus("saving");

    debounceTimer.current = setTimeout(async () => {
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

        setSaveStatus("idle");
      } catch (err) {
        console.error('Save failed:', err);
        setSaveStatus("error");
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
    debouncedSaveProvenance({ price });
  }, [price]);

  useEffect(() => {
    return () => { if (debounceTimer.current) clearTimeout(debounceTimer.current); };
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
          <label className="inspect-options-card">
            Donated
            <input type="radio" name="acquisition-radio" checked={props.currentArtifactData.acquisition.collectionType === "A"} />
          </label>
          <label className="inspect-options-card">
            On Loan
            <input type="radio" name="acquisition-radio" checked={props.currentArtifactData.acquisition.collectionType === "B"} />
          </label>
          <label className="inspect-options-card">
            Excavated
            <input type="radio" name="acquisition-radio" checked={props.currentArtifactData.acquisition.collectionType === "C"} />
          </label>
          <label className="inspect-options-card">
            Found
            <input type="radio" name="acquisition-radio" checked={props.currentArtifactData.acquisition.collectionType === "D"} />
          </label>
        </div>
        
        <div className="inspect-acquisition-collection-options-special">
          <div className="inspect-options-card-special">
            
            <label className="inspect-options-card-special-found">
              Purchased
              <input type="radio" name="acquisition-radio" checked={props.currentArtifactData.acquisition.collectionType === "E"} />
            </label>

            <div className="inspect-options-card-special-price" style={{ visibility: props.currentArtifactData.acquisition.collectionType === "E" ? "visible" : "hidden" }}>
              <label>Price</label>
              <input type="text" value={price} onChange={(e) => handlePriceChange(e.target.value)}/>
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