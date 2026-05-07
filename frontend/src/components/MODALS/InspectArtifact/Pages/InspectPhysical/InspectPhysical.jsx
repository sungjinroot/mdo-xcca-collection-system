import './InspectPhysical.css';
import '../../../NewArtifact/Pages/PhysicalDescription/PhysicalDescription.css';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

function InspectPhysical(){
    
    return (
        <div className="inspect-physical-container">
            <div className="inspect-physical-dimensions">
                <div className="inspect-physical-top-fields">
                    <label> Diameter (for round artifact) </label>
                    <input type="number"/>
                </div>

                
                <div className="inspect-physical-lwh">
                    <div className="inspect-physical-top-lwh-fields">
                        <label> Length (cm) </label>
                        <input type="number"/>
                    </div>

                    <div className="inspect-physical-top-lwh-fields">
                        <label> Width (cm) </label>
                        <input type="number"/>

                    </div>

                    <div className="inspect-physical-top-lwh-fields">
                        <label> Height (cm) </label>
                        <input type="number"/>
                    </div>
                </div>
                
            </div>

            <div className="accordion-container">

                <Accordion sx={{ color: 'white', backgroundColor: '#283971', boxShadow: '0 2px 6px rgba(0,0,0,0.25), 0 8px 20px rgba(0,0,0,0.18)', transition: 'transform 0.2s ease, box-shadow 0.2s ease', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 6px 12px rgba(0,0,0,0.30), 0 14px 30px rgba(0,0,0,0.25)' } }}>
                    <AccordionSummary>
                        Special remarks
                    </AccordionSummary>

                    <AccordionDetails>
                        <div className="accordion-text">
                            <textarea>
                                
                            </textarea>
                        </div>
                    </AccordionDetails>
                </Accordion>

                <Accordion sx={{ color: 'white', backgroundColor: '#283971', boxShadow: '0 2px 6px rgba(0,0,0,0.25), 0 8px 20px rgba(0,0,0,0.18)', transition: 'transform 0.2s ease, box-shadow 0.2s ease', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 6px 12px rgba(0,0,0,0.30), 0 14px 30px rgba(0,0,0,0.25)' } }}>
                    <AccordionSummary>
                        Artifact Categorization
                    </AccordionSummary>

                    <AccordionDetails>
                        <div className="inspect-physical-description-categories-container">
                            <label> Categorization </label>
                
                            <div className="inspect-physical-categories-grid">
                                <div className="inspect-physical-category-item">
                                    <input type="checkbox"/>
                                    <label htmlFor="cat1">First</label>
                                </div>

                                <div className="inspect-physical-category-item">
                                    <input type="checkbox"/>
                                    <label htmlFor="cat2">Second</label>
                                </div>

                                <div className="inspect-physical-category-item">
                                    <input type="checkbox" id="cat3" />
                                    <label htmlFor="cat3">Third</label>
                            </div>
                        </div>
                    </div>

                    </AccordionDetails>
                </Accordion>


                <Accordion sx={{ color: 'white', backgroundColor: '#283971', boxShadow: '0 2px 6px rgba(0,0,0,0.25), 0 8px 20px rgba(0,0,0,0.18)', transition: 'transform 0.2s ease, box-shadow 0.2s ease', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 6px 12px rgba(0,0,0,0.30), 0 14px 30px rgba(0,0,0,0.25)' } }}>
                    <AccordionSummary>
                        Details
                    </AccordionSummary>

                    <AccordionDetails>
                        <div className="accordion-text">
                            <textarea>
                                
                            </textarea>
                        </div>
                    </AccordionDetails>
                </Accordion>

                <Accordion sx={{ color: 'white', backgroundColor: '#283971', boxShadow: '0 2px 6px rgba(0,0,0,0.25), 0 8px 20px rgba(0,0,0,0.18)', transition: 'transform 0.2s ease, box-shadow 0.2s ease', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 6px 12px rgba(0,0,0,0.30), 0 14px 30px rgba(0,0,0,0.25)' } }}>
                    <AccordionSummary>
                        Function
                    </AccordionSummary>

                    <AccordionDetails>
                        <div className="accordion-text">
                            <textarea>
                                
                            </textarea>
                        </div>
                    </AccordionDetails>
                </Accordion>


                <Accordion sx={{ color: 'white', backgroundColor: '#283971', boxShadow: '0 2px 6px rgba(0,0,0,0.25), 0 8px 20px rgba(0,0,0,0.18)', transition: 'transform 0.2s ease, box-shadow 0.2s ease', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 6px 12px rgba(0,0,0,0.30), 0 14px 30px rgba(0,0,0,0.25)' } }}>
                    <AccordionSummary>
                        Condition of the artifact upon receipt
                    </AccordionSummary>

                    <AccordionDetails>
                        <div className="accordion-text">
                            <textarea>
                                
                            </textarea>
                        </div>
                    </AccordionDetails>
                </Accordion>
            
            </div>

            


        </div>
    )
}

export default InspectPhysical;