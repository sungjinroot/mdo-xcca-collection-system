import './Artifact.css';
import './ArtifactData';
import { useState, useEffect } from 'react';
import ArtifactData from './ArtifactData';

import InspectArtifact from '../MODALS/InspectArtifact/InspectArtifact.jsx';
import WarningConfirmation from '../MODALS/ModalPrompts/WarningConfirmation/WarningConfirmation.jsx';

function Artifact({ artifactId, englishName, vernacularName }){

    //This is for modal
    const [show,setShow] = useState(false)

    const [showWarning,setShowWarning] = useState(false);

    const [currentPicture,setCurrentPicture] = useState("");
    const [pictures,setPictures] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`http://127.0.0.1:3000/api/v1/thumbnail/${artifactId}`);
            const result = await response.json();
            setPictures(result);
            setCurrentPicture(result[0].picturefilepath);
            console.log(result);

        };
        fetchData();

        console.log(pictures)
    },[]);




    return (
        <>
            <div className="card-container">
                <div className="card-img">
                    <img src={currentPicture} onClick={() => setShow(true)}/>
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
            
                        <ArtifactData style={"artifact-display-data"} englishName={englishName} vernacularName={vernacularName}/>
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

            <WarningConfirmation showWarning={showWarning} setShowWarning={setShowWarning} artifactId={artifactId}/>
        </>
    );
}

export default Artifact;
