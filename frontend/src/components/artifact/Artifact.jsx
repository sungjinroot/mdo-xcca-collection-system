import './Artifact.css';
import './ArtifactData';
import ArtifactData from './ArtifactData';

function Artifact(){

    return (
        <div className="card-container">
            <div className="card-img">
                <img src="https://preview.redd.it/could-it-be-possible-to-replicate-the-omnitrix-in-real-life-v0-p6psffthgxsc1.jpeg?auto=webp&s=993078905b87843f6d799ab2ecef9a53ca40d47b"/>
                

                <button className="delete-button">
                    <img src="src/assets/delete.png"/>
                </button>


            </div>

            <div className="card-info">
                <div className="basic-info">
            
                    <ArtifactData style={"artifact-display-data"} englishName={"Omnitrix"} vernacularName={"Omni nga matrix"} dateReceived={"1945/12/12"} />
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
    );
}

export default Artifact;
