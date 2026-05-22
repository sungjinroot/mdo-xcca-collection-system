import './InspectPhysical.css';
import '../../../NewArtifact/Pages/PhysicalDescription/PhysicalDescription.css';
import { useState, useEffect, useRef, useCallback } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

const DEBOUNCE_DELAY = 500;

function InspectPhysical({ currentArtifactData }) {

    const [artifactCategories, setArtifactCategories] = useState([]);
    const [dimensions, setDimensions] = useState({
        artifactDiameter: currentArtifactData.dimensions.artifactDiameter ?? '',
        artifactLength: currentArtifactData.dimensions.artifactLength,
        artifactWidth: currentArtifactData.dimensions.artifactWidth,
        artifactHeight: currentArtifactData.dimensions.artifactHeight,
    });
    const [saveStatus, setSaveStatus] = useState("idle");

    const artifactId = currentArtifactData.artifacts.artifactID;
    const debounceTimer = useRef(null);
    const isFirstLoad = useRef(true);

    useEffect(() => {
        isFirstLoad.current = true;
        setSaveStatus("idle");

        setDimensions({
            artifactDiameter: currentArtifactData.dimensions.artifactDiameter ?? '',
            artifactLength: currentArtifactData.dimensions.artifactLength,
            artifactWidth: currentArtifactData.dimensions.artifactWidth,
            artifactHeight: currentArtifactData.dimensions.artifactHeight,
        });

        setTimeout(() => { isFirstLoad.current = false; }, 100);
    }, [artifactId]);

    const debouncedSaveDimensions = useCallback((updatedFields) => {
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        setSaveStatus("saving");

        debounceTimer.current = setTimeout(async () => {
            try {
                const res = await fetch(`http://127.0.0.1:3000/api/v1/artifacts/${artifactId}/dimensions`, {
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
    }, [artifactId]);

    const handleMeasurementChange = (field, value) => {
        const regex = /^\d*\.?\d*$/;
        if (value === "" || regex.test(value)) {
            setDimensions(prev => ({
                ...prev,
                [field]: value
            }));
        }
    };

    useEffect(() => {
        if (isFirstLoad.current) return;
        debouncedSaveDimensions({ artifactDiameter: dimensions.artifactDiameter || null });
    }, [dimensions.artifactDiameter]);

    useEffect(() => {
        if (isFirstLoad.current || !dimensions.artifactLength) return;
        debouncedSaveDimensions({ artifactLength: dimensions.artifactLength });
    }, [dimensions.artifactLength]);

    useEffect(() => {
        if (isFirstLoad.current || !dimensions.artifactWidth) return;
        debouncedSaveDimensions({ artifactWidth: dimensions.artifactWidth });
    }, [dimensions.artifactWidth]);

    useEffect(() => {
        if (isFirstLoad.current || !dimensions.artifactHeight) return;
        debouncedSaveDimensions({ artifactHeight: dimensions.artifactHeight });
    }, [dimensions.artifactHeight]);

    useEffect(() => {
        return () => { if (debounceTimer.current) clearTimeout(debounceTimer.current); };
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await fetch(`http://127.0.0.1:3000/api/v1/artifact/categories/${artifactId}`);
            const data = await res.json();
            setArtifactCategories(data);
        } catch (err) {
            console.error('Failed to fetch categories:', err);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, [artifactId]);

    const categorize = async (categoryId, artifactid) => {
        const isChecked = artifactid !== null;
        const method = isChecked ? 'DELETE' : 'POST';

        try {
            const res = await fetch('http://127.0.0.1:3000/api/v1/artifact/categories', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ categoryId, artifactId }),
            });

            if (!res.ok) {
                const err = await res.json();
                console.error('Failed to update category:', err);
                return;
            }

            await fetchCategories();
        } catch (err) {
            console.error('Network error:', err);
        }
    };

    return (
        <div className="inspect-physical-container">

            <div className="inspect-physical-dimensions">
                <div className="inspect-physical-top-fields">
                    <label> Diameter (for round artifact) </label>
                    <input type="text" value={dimensions.artifactDiameter} onChange={(e) => handleMeasurementChange('artifactDiameter', e.target.value)} />
                </div>

                <div className="inspect-physical-lwh">
                    <div className="inspect-physical-top-lwh-fields">
                        <label> Length (cm) </label>
                        <input type="text" value={dimensions.artifactLength} onChange={(e) => handleMeasurementChange('artifactLength', e.target.value)} />
                    </div>
                    <div className="inspect-physical-top-lwh-fields">
                        <label> Width (cm) </label>
                        <input type="text" value={dimensions.artifactWidth} onChange={(e) => handleMeasurementChange('artifactWidth', e.target.value)} />
                    </div>
                    <div className="inspect-physical-top-lwh-fields">
                        <label> Height (cm) </label>
                        <input type="text" value={dimensions.artifactHeight} onChange={(e) => handleMeasurementChange('artifactHeight', e.target.value)} />
                    </div>
                </div>
            </div>



            <div className="accordion-container">
                <Accordion sx={{ color: 'white', backgroundColor: '#283971', boxShadow: '0 2px 6px rgba(0,0,0,0.25), 0 8px 20px rgba(0,0,0,0.18)', transition: 'transform 0.2s ease, box-shadow 0.2s ease', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 6px 12px rgba(0,0,0,0.30), 0 14px 30px rgba(0,0,0,0.25)' } }}>
                    <AccordionSummary>Special remarks</AccordionSummary>
                    <AccordionDetails>
                        <div className="accordion-text">
                            <textarea>{currentArtifactData.physicaldescription.specialRemarks}</textarea>
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
                                        <input type="checkbox" id={`cat-${category.categoryid}`} checked={category.artifactid !== null} onChange={() => categorize(category.categoryid, category.artifactid)}/>
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
                    <AccordionSummary>Details</AccordionSummary>
                    <AccordionDetails>
                        <div className="accordion-text">
                            <textarea>{currentArtifactData.physicaldescription.artifactDetails}</textarea>
                        </div>
                    </AccordionDetails>
                </Accordion>

                <Accordion sx={{ color: 'white', backgroundColor: '#283971', boxShadow: '0 2px 6px rgba(0,0,0,0.25), 0 8px 20px rgba(0,0,0,0.18)', transition: 'transform 0.2s ease, box-shadow 0.2s ease', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 6px 12px rgba(0,0,0,0.30), 0 14px 30px rgba(0,0,0,0.25)' } }}>
                    <AccordionSummary>Function</AccordionSummary>
                    <AccordionDetails>
                        <div className="accordion-text">
                            <textarea>{currentArtifactData.physicaldescription.artifactFunction}</textarea>
                        </div>
                    </AccordionDetails>
                </Accordion>

                <Accordion sx={{ color: 'white', backgroundColor: '#283971', boxShadow: '0 2px 6px rgba(0,0,0,0.25), 0 8px 20px rgba(0,0,0,0.18)', transition: 'transform 0.2s ease, box-shadow 0.2s ease', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 6px 12px rgba(0,0,0,0.30), 0 14px 30px rgba(0,0,0,0.25)' } }}>
                    <AccordionSummary>Condition of the artifact upon receipt</AccordionSummary>
                    <AccordionDetails>
                        <div className="accordion-text">
                            <textarea>{currentArtifactData.physicaldescription.conditionUponReceipt}</textarea>
                        </div>
                    </AccordionDetails>
                </Accordion>
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

export default InspectPhysical;