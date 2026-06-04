import './InspectPhysical.css';
import '../../../NewArtifact/Pages/PhysicalDescription/PhysicalDescription.css';
import { useState, useEffect, useRef, useCallback } from 'react';
import InspectPhysicalDescription from './InspectPhysicalDescription.jsx';

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

                setSaveStatus("success");
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

            {/*Description here*/}

            <InspectPhysicalDescription currentArtifactData={currentArtifactData} artifactCategories={artifactCategories} categorize={categorize}/>

            {saveStatus === "saving" && (
                <div style={{ textAlign: 'right', fontSize: '0.85rem', color: '#aaaaaa', marginBottom: '0.5rem' }}>
                    Saving...
                </div>
            )}
            {saveStatus === "success" && (
                <div style={{ textAlign: 'right', fontSize: '0.85rem', color: '#283971', marginBottom: '0.5rem' }}>
                    Edited successfully! Please exit and re-enter to fully reflect these changes.
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