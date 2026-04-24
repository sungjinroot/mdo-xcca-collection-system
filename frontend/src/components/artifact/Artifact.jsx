import './Artifact.css';
import './ArtifactData';
import { useState } from 'react';
import ArtifactData from './ArtifactData';

import InspectArtifact from '../MODALS/InspectArtifact/InspectArtifact.jsx';

function Artifact(){

    //This is for modal
    const [show,setShow] = useState(false)

    return (
        <>
            <div className="card-container">
                <div className="card-img">
                    <img src="https://cdn.thecollector.com/wp-content/uploads/2023/03/aztec-skull-mask.jpg?width=1073&quality=100&dpr=2" onClick={() => setShow(true)}/>
                
                    <button className="delete-button">
                        <img src="src/assets/delete.png"/>
                    </button>


                </div>

                <div className="card-info">
                    <div className="basic-info" onClick={() => setShow(true)}>
            
                        <ArtifactData style={"artifact-display-data"} englishName={"Random Artifact"} vernacularName={"Ambot lang artifact"} dateReceived={"1945/12/12"} />
                    </div>

                    <div className="basic-functions">
                        <button className="card-functions"> Download </button>

                    
                        <select className="card-functions">
                            <option> Room 1</option>
                            <option> Room 2</option>
                            <option> Room 3</option>
                            <option> Room 4</option>
                            <option> Room 5</option>
                            <option> Room 6</option>
                            <option> Room 7</option>
                            <option> Room 8</option>
                        </select> 

                    </div>
                </div>
            </div>

            <InspectArtifact show={show} setShow={setShow}/>
        </>
    );
}

export default Artifact;
