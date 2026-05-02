import './Artifact.css';
import './ArtifactData';
import { useState } from 'react';
import ArtifactData from './ArtifactData';

import InspectArtifact from '../MODALS/InspectArtifact/InspectArtifact.jsx';
import WarningConfirmation from '../MODALS/ModalPrompts/WarningConfirmation/WarningConfirmation.jsx';

function Artifact(){

    //This is for modal
    const [show,setShow] = useState(false)

    const [showWarning,setShowWarning] = useState(false);

    return (
        <>
            <div className="card-container">
                <div className="card-img">
                    <img src="https://lh3.googleusercontent.com/ci/AL18g_QK-2o3ih9I38PPhCO9vCrtqPTRg_6DZ4_SZf7CP8F9whJxeicBzaBPU3M3qcc9mH3QuSK09hqT=s1200" onClick={() => setShow(true)}/>
                    <div className="thumbnail-chooser">
                        <select>
                            <option> Front </option>
                            <option> Back </option>
                            <option> Left </option>
                            <option> Right </option>
                        </select>
                    </div>
                    

                    <button className="delete-button" onClick={() => setShowWarning(true)}>
                        <img src="src/assets/delete.png"/>
                    </button>


                </div>

                <div className="card-info">
                    <div className="basic-info" onClick={() => setShow(true)}>
            
                        <ArtifactData style={"artifact-display-data"} englishName={"Uranium Ore"} vernacularName={"Uranium nga bato"}/>
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

            <WarningConfirmation showWarning={showWarning} setShowWarning={setShowWarning}/>
        </>
    );
}

export default Artifact;
