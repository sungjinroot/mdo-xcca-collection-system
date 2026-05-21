import { useState, useEffect, useRef, useCallback } from 'react';
import './PrimaryInfo.css';

const DEBOUNCE_DELAY = 500;

const catalogues = [
  { value: 'A1', label: 'A1 (Historical)' },
  { value: 'A2', label: 'A2 (Heritage Heirloom)' },
  { value: 'A3', label: 'A3 (Ethnological)' },
  { value: 'A4', label: 'A4 (Archaeological)' },
  { value: 'A5', label: 'A5 (Artworks)' },
];

function PrimaryInfo({ currentArtifactData }) {
  const artifactID = currentArtifactData.artifacts.artifactID;

  const [accessionNo, setAccessionNo] = useState(currentArtifactData.artifacts.accessionNo);
  const [catalogueNo, setCatalogueNo] = useState(currentArtifactData.artifacts.catalogueNo);
  const [storageLocation, setStorageLocation] = useState(currentArtifactData.artifacts.storageLocation);
  const [englishName, setEnglishName] = useState(currentArtifactData.artifactnames.englishName);
  const [vernacularName, setVernacularName] = useState(currentArtifactData.artifactnames.vernacularName);
  const [saveStatus, setSaveStatus] = useState("idle");

  const debounceTimer = useRef(null);
  const isFirstLoad   = useRef(true);

  useEffect(() => {
    isFirstLoad.current = true;
    setSaveStatus("idle");

    setAccessionNo(currentArtifactData.artifacts.accessionNo);
    setCatalogueNo(currentArtifactData.artifacts.catalogueNo);
    setStorageLocation(currentArtifactData.artifacts.storageLocation);
    setEnglishName(currentArtifactData.artifactnames.englishName);
    setVernacularName(currentArtifactData.artifactnames.vernacularName);

    setTimeout(() => { isFirstLoad.current = false; }, 100);
  }, [artifactID]);

  const debouncedSaveDetails = useCallback((updatedFields) => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    setSaveStatus("saving");

    debounceTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(`http://127.0.0.1:3000/api/v1/artifacts/${artifactID}/artifactDetails`, {
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

  const debouncedSaveNames = useCallback((updatedFields) => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    setSaveStatus("saving");

    debounceTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(`http://127.0.0.1:3000/api/v1/artifacts/${artifactID}/artifactNames`, {
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
    debouncedSaveDetails({ accessionNo });
  }, [accessionNo]);

  useEffect(() => {
    if (isFirstLoad.current) return;
    debouncedSaveDetails({ catalogueNo });
  }, [catalogueNo]);

  useEffect(() => {
    if (isFirstLoad.current) return;
    debouncedSaveDetails({ storageLocation });
  }, [storageLocation]);

  useEffect(() => {
    if (isFirstLoad.current) return;
    debouncedSaveNames({ englishName });
  }, [englishName]);

  useEffect(() => {
    if (isFirstLoad.current) return;
    debouncedSaveNames({ vernacularName });
  }, [vernacularName]);

  useEffect(() => {
    return () => { if (debounceTimer.current) clearTimeout(debounceTimer.current); };
  }, []);

  return (
    <div className="artifact-info-bottom">

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

      <div className="artifact-info-first-line">
        <div className="artifact-info-first-identifier">
          <div className="artifact-info-identifier-fields">
            <label>Accession Number</label>
            <input type="text" value={accessionNo} onChange={(e) => setAccessionNo(e.target.value)} />
          </div>
          <div className="artifact-info-identifier-fields">
            <label>Catalogue Number</label>
            <select value={catalogueNo} onChange={(e) => setCatalogueNo(e.target.value)}>
              <option value="">Select...</option>
              {catalogues.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="artifact-info-first-line">
        <div className="artifact-info-first-identifier">
          <div className="artifact-info-identifier-fields">
            <label>English Name</label>
            <input type="text" value={englishName} onChange={(e) => setEnglishName(e.target.value)} />
          </div>
          <div className="artifact-info-identifier-fields">
            <label>Vernacular Name</label>
            <input type="text" value={vernacularName} onChange={(e) => setVernacularName(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="artifact-info-first-line">
        <div className="artifact-info-first-identifier">
          <div className="artifact-info-identifier-fields">
            <label>Storage Location</label>
            <input type="text" value={storageLocation} onChange={(e) => setStorageLocation(e.target.value)} />
          </div>
        </div>
      </div>

    </div>
  );
}

export default PrimaryInfo;