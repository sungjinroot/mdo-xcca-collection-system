import { useState, useEffect, useRef, useCallback } from 'react';
import './InspectContacts.css';

const DEBOUNCE_DELAY = 500;

function InspectContacts(props) {
  const artifactID = props.currentArtifactData.artifacts.artifactID;

  const roleLabelMap = {
    "A": "donor",
    "B": "lender",
    "C": "archaeologist",
    "D": "finder",
    "E": "buyer"
  };
  const promptMap = {
    "A": "Date of when the artifact was donated",
    "B": "Date of when the artifact was loaned",
    "C": "Date of when the artifact was excavated",
    "D": "Date of when the artifact was found",
    "E": "Date of when the artifact was purchased"
  };

  const role = roleLabelMap[props.currentArtifactData.acquisition.collectionType];

  const [contactPersonFullName, setContactPersonFullName] = useState(props.currentArtifactData.contactpersons.contactPersonFullName);
  const [receiverFullName, setReceiverFullName] = useState(props.currentArtifactData.contactpersons.receiverFullName);
  const [recordedBy, setRecordedBy] = useState(props.currentArtifactData.contactpersons.recordedBy);
  const [dateCollectedByContactPerson, setDateCollectedByContactPerson] = useState(props.currentArtifactData.contactpersons.dateCollectedByContactPerson?.split('T')[0]);
  const [receivedByReceiverDate, setReceivedByReceiverDate] = useState(props.currentArtifactData.contactpersons.receivedByReceiverDate?.split('T')[0]);
  const [saveStatus, setSaveStatus] = useState("idle");

  const debounceTimer = useRef(null);
  const isFirstLoad = useRef(true);

  useEffect(() => {
    isFirstLoad.current = true;
    setSaveStatus("idle");

    setContactPersonFullName(props.currentArtifactData.contactpersons.contactPersonFullName);
    setReceiverFullName(props.currentArtifactData.contactpersons.receiverFullName);
    setRecordedBy(props.currentArtifactData.contactpersons.recordedBy);
    setDateCollectedByContactPerson(props.currentArtifactData.contactpersons.dateCollectedByContactPerson?.split('T')[0]);
    setReceivedByReceiverDate(props.currentArtifactData.contactpersons.receivedByReceiverDate?.split('T')[0]);

    setTimeout(() => { isFirstLoad.current = false; }, 100);
  }, [artifactID]);

  const debouncedSave = useCallback((updatedFields) => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    setSaveStatus("saving");

    debounceTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(`http://127.0.0.1:3000/api/v1/artifacts/${artifactID}/contactPersons`, {
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

  useEffect(() => { if (isFirstLoad.current) return; debouncedSave({ contactPersonFullName }); }, [contactPersonFullName]);
  useEffect(() => { if (isFirstLoad.current) return; debouncedSave({ receiverFullName }); }, [receiverFullName]);
  useEffect(() => { if (isFirstLoad.current) return; debouncedSave({ recordedBy }); }, [recordedBy]);
  useEffect(() => { if (isFirstLoad.current) return; debouncedSave({ dateCollectedByContactPerson }); }, [dateCollectedByContactPerson]);
  useEffect(() => { if (isFirstLoad.current) return; debouncedSave({ receivedByReceiverDate }); }, [receivedByReceiverDate]);

  useEffect(() => {
    return () => { if (debounceTimer.current) clearTimeout(debounceTimer.current); };
  }, []);

  return (
    <div className="inspect-contacts-container">



      <div className="inspect-contacts-box">
        <div className="inspect-contacts-row">
          <div className="inspect-contacts-fields">
            <label>Full name of the {role}</label>
            <input type="text" value={contactPersonFullName} onChange={(e) => setContactPersonFullName(e.target.value)} />
          </div>
          <div className="inspect-contacts-fields">
            <label>Full name of the receiver</label>
            <input type="text" value={receiverFullName} onChange={(e) => setReceiverFullName(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="inspect-contacts-box">
        <div className="inspect-contacts-fields">
          <label>Recorded By</label>
          <input type="text" value={recordedBy} onChange={(e) => setRecordedBy(e.target.value)} />
        </div>
      </div>

      <div className="inspect-contacts-box">
        <div className="inspect-contacts-row">
          <div className="inspect-contacts-fields">
            <label>{promptMap[props.currentArtifactData.acquisition.collectionType]}</label>
            <input type="date" value={dateCollectedByContactPerson} onChange={(e) => setDateCollectedByContactPerson(e.target.value)} />
          </div>
          <div className="inspect-contacts-fields">
            <label>Date of when the artifact was received</label>
            <input type="date" value={receivedByReceiverDate} onChange={(e) => setReceivedByReceiverDate(e.target.value)} />
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

export default InspectContacts;