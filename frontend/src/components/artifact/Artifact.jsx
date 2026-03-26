import './Artifact.css';
import './ArtifactData';
import ArtifactData from './ArtifactData';

function Artifact(){

    return (
        <div className="card-container">
            <div className="card-img">
                <img src="https://asti.dost.gov.ph/wp-content/uploads/2020/12/2.jpg"/>
                

                <button className="delete-button">
                    <img src="src/assets/delete.png"/>
                </button>


            </div>

            <div className="card-info">
                <div className="basic-info">
            
                    <ArtifactData style={"artifact-display-data"} englishName={"Native Snare Drum"} vernacularName={"Tahoy"} dateReceived={"1945/12/12"} />
                </div>

                <div className="basic-functions">
                    <button className="card-functions"> Export </button>

                    
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
    );
}

export default Artifact;
