import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import './InspectPhysical.css';
import '../../../NewArtifact/Pages/PhysicalDescription/PhysicalDescription.css';
import { useState, useEffect, useRef, useCallback } from 'react';

const DEBOUNCE_DELAY = 500;

function InspectPhysicalDescription({ currentArtifactData, artifactCategories, categorize }) {

    const artifactId = currentArtifactData.artifacts.artifactID;
    const debounceTimer = useRef(null);
    const isFirstLoad = useRef(true);

    const [description, setDescription] = useState({
        specialRemarks: currentArtifactData.physicaldescription.specialRemarks ?? '',
        artifactDetails: currentArtifactData.physicaldescription.artifactDetails ?? '',
        artifactFunction: currentArtifactData.physicaldescription.artifactFunction ?? '',
        conditionUponReceipt: currentArtifactData.physicaldescription.conditionUponReceipt ?? '',
    });

    const [saveStatus, setSaveStatus] = useState({
        specialRemarks: 'idle',
        artifactDetails: 'idle',
        artifactFunction: 'idle',
        conditionUponReceipt: 'idle',
    });

    useEffect(() => {
        isFirstLoad.current = true;

        setDescription({
            specialRemarks: currentArtifactData.physicaldescription.specialRemarks ?? '',
            artifactDetails: currentArtifactData.physicaldescription.artifactDetails ?? '',
            artifactFunction: currentArtifactData.physicaldescription.artifactFunction ?? '',
            conditionUponReceipt: currentArtifactData.physicaldescription.conditionUponReceipt ?? '',
        });

        setSaveStatus({
            specialRemarks: 'idle',
            artifactDetails: 'idle',
            artifactFunction: 'idle',
            conditionUponReceipt: 'idle',
        });

        setTimeout(() => { isFirstLoad.current = false; }, 100);
    }, [artifactId]);

    const debouncedSaveDescription = useCallback((field, updatedFields) => {
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        setSaveStatus(prev => ({ ...prev, [field]: 'saving' }));

        debounceTimer.current = setTimeout(async () => {
            try {
                const res = await fetch(`http://127.0.0.1:3000/api/v1/artifacts/${artifactId}/physicalDescription`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedFields),
                });

                if (!res.ok) {
                    const err = await res.json();
                    throw new Error(err.error || `PUT failed: ${res.status}`);
                }

                setSaveStatus(prev => ({ ...prev, [field]: 'success' }));
            } catch (err) {
                console.error('Save failed:', err);
                setSaveStatus(prev => ({ ...prev, [field]: 'error' }));
            }
        }, DEBOUNCE_DELAY);
    }, [artifactId]);

    const handleDescriptionChange = (field, value) => {
        setDescription(prev => ({ ...prev, [field]: value }));
    };

    useEffect(() => {
        if (isFirstLoad.current) return;
        debouncedSaveDescription('specialRemarks', { specialRemarks: description.specialRemarks });
    }, [description.specialRemarks]);

    useEffect(() => {
        if (isFirstLoad.current) return;
        debouncedSaveDescription('artifactDetails', { artifactDetails: description.artifactDetails });
    }, [description.artifactDetails]);

    useEffect(() => {
        if (isFirstLoad.current) return;
        debouncedSaveDescription('artifactFunction', { artifactFunction: description.artifactFunction });
    }, [description.artifactFunction]);

    useEffect(() => {
        if (isFirstLoad.current) return;
        debouncedSaveDescription('conditionUponReceipt', { conditionUponReceipt: description.conditionUponReceipt });
    }, [description.conditionUponReceipt]);

    useEffect(() => {
        return () => { if (debounceTimer.current) clearTimeout(debounceTimer.current); };
    }, []);

    const SaveIndicator = ({ field }) => {
        if (saveStatus[field] === 'saving') return (
            <span style={{ marginLeft: '0.75rem', fontSize: '0.8rem', color: '#aaaaaa', fontWeight: 'normal' }}>
                Saving...
            </span>
        );
        if (saveStatus[field] === 'success') return (
            <span style={{ marginLeft: '0.75rem', fontSize: '0.8rem', color: '#ffffff', fontWeight: 'normal' }}>
                Edited successfully! Please exit and re-enter to fully reflect these changes.
            </span>
        );
        if (saveStatus[field] === 'error') return (
            <span style={{ marginLeft: '0.75rem', fontSize: '0.8rem', color: '#ff6b6b', fontWeight: 'normal' }}>
                Save failed
            </span>
        );
        return null;
    };

    return (
        <div className="accordion-container">
            <Accordion sx={{ color: 'white', backgroundColor: '#283971', boxShadow: '0 2px 6px rgba(0,0,0,0.25), 0 8px 20px rgba(0,0,0,0.18)', transition: 'transform 0.2s ease, box-shadow 0.2s ease', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 6px 12px rgba(0,0,0,0.30), 0 14px 30px rgba(0,0,0,0.25)' } }}>
                <AccordionSummary>
                    <span>Special remarks</span>
                    <SaveIndicator field="specialRemarks" />
                </AccordionSummary>
                <AccordionDetails>
                    <div className="accordion-text">
                        <textarea value={description.specialRemarks} onChange={(e) => handleDescriptionChange('specialRemarks', e.target.value)} />
                    </div>
                </AccordionDetails>
            </Accordion>

            <Accordion sx={{ color: 'white', backgroundColor: '#283971', boxShadow: '0 2px 6px rgba(0,0,0,0.25), 0 8px 20px rgba(0,0,0,0.18)', transition: 'transform 0.2s ease, box-shadow 0.2s ease', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 6px 12px rgba(0,0,0,0.30), 0 14px 30px rgba(0,0,0,0.25)' } }}>
                <AccordionSummary>Artifact Categorization</AccordionSummary>
                <AccordionDetails>
                    <div className="inspect-physical-description-categories-container">
                        <label>Categorization</label>
                        <div className="inspect-physical-categories-grid">
                            {artifactCategories.map(category => (
                                <div className="inspect-physical-category-item" key={category.categoryid}>
                                    <input type="checkbox" id={`cat-${category.categoryid}`} checked={category.artifactid !== null} onChange={() => categorize(category.categoryid, category.artifactid)} />
                                    <label htmlFor={`cat-${category.categoryid}`}>
                                        {category.categoryname}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </AccordionDetails>
            </Accordion>

            <Accordion sx={{ color: 'white', backgroundColor: '#283971', boxShadow: '0 2px 6px rgba(0,0,0,0.25), 0 8px 20px rgba(0,0,0,0.18)', transition: 'transform 0.2s ease, box-shadow 0.2s ease', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 6px 12px rgba(0,0,0,0.30), 0 14px 30px rgba(0,0,0,0.25)' } }}>
                <AccordionSummary>
                    <span>Details</span>
                    <SaveIndicator field="artifactDetails" />
                </AccordionSummary>
                <AccordionDetails>
                    <div className="accordion-text">
                        <textarea value={description.artifactDetails} onChange={(e) => handleDescriptionChange('artifactDetails', e.target.value)} />
                    </div>
                </AccordionDetails>
            </Accordion>

            <Accordion sx={{ color: 'white', backgroundColor: '#283971', boxShadow: '0 2px 6px rgba(0,0,0,0.25), 0 8px 20px rgba(0,0,0,0.18)', transition: 'transform 0.2s ease, box-shadow 0.2s ease', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 6px 12px rgba(0,0,0,0.30), 0 14px 30px rgba(0,0,0,0.25)' } }}>
                <AccordionSummary>
                    <span>Function</span>
                    <SaveIndicator field="artifactFunction" />
                </AccordionSummary>
                <AccordionDetails>
                    <div className="accordion-text">
                        <textarea value={description.artifactFunction} onChange={(e) => handleDescriptionChange('artifactFunction', e.target.value)} />
                    </div>
                </AccordionDetails>
            </Accordion>

            <Accordion sx={{ color: 'white', backgroundColor: '#283971', boxShadow: '0 2px 6px rgba(0,0,0,0.25), 0 8px 20px rgba(0,0,0,0.18)', transition: 'transform 0.2s ease, box-shadow 0.2s ease', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 6px 12px rgba(0,0,0,0.30), 0 14px 30px rgba(0,0,0,0.25)' } }}>
                <AccordionSummary>
                    <span>Condition of the artifact upon receipt</span>
                    <SaveIndicator field="conditionUponReceipt" />
                </AccordionSummary>
                <AccordionDetails>
                    <div className="accordion-text">
                        <textarea value={description.conditionUponReceipt} onChange={(e) => handleDescriptionChange('conditionUponReceipt', e.target.value)} />
                    </div>
                </AccordionDetails>
            </Accordion>
        </div>
    );
}

export default InspectPhysicalDescription;