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

            <Accordion>
                <AccordionSummary>
                    Special remarks
                </AccordionSummary>

                <AccordionDetails>
                    <textarea>
                        
                    </textarea>
                </AccordionDetails>
            </Accordion>

            <Accordion>
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


            <Accordion>
                <AccordionSummary>
                    Details
                </AccordionSummary>

                <AccordionDetails>
                    <textarea>
                        
                    </textarea>
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary>
                    Function
                </AccordionSummary>

                <AccordionDetails>
                    <textarea>
                            
                    </textarea>
                </AccordionDetails>
            </Accordion>


            <Accordion>
                <AccordionSummary>
                    Condition of the artifact upon receipt
                </AccordionSummary>

                <AccordionDetails>
                    <textarea>
                            
                    </textarea>
                </AccordionDetails>
            </Accordion>
            

            


        </div>
    )
}

export default InspectPhysical;