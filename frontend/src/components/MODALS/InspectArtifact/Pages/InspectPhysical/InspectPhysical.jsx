import './InspectPhysical.css';
import '../../../NewArtifact/Pages/PhysicalDescription/PhysicalDescription.css';
import { useState, useEffect } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

function InspectPhysical({ currentArtifactData }) {

    const [artifactCategories, setArtifactCategories] = useState([]);

    const artifactId = currentArtifactData.artifacts.artifactID;

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
                    <input type="number" value={currentArtifactData.dimensions.artifactDiameter} />
                </div>

                <div className="inspect-physical-lwh">
                    <div className="inspect-physical-top-lwh-fields">
                        <label> Length (cm) </label>
                        <input type="number" value={currentArtifactData.dimensions.artifactLength} />
                    </div>
                    <div className="inspect-physical-top-lwh-fields">
                        <label> Width (cm) </label>
                        <input type="number" value={currentArtifactData.dimensions.artifactWidth} />
                    </div>
                    <div className="inspect-physical-top-lwh-fields">
                        <label> Height (cm) </label>
                        <input type="number" value={currentArtifactData.dimensions.artifactHeight} />
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
        </div>
    );
}

export default InspectPhysical;