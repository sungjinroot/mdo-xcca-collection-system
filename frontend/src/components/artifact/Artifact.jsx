import './Artifact.css';
import './ArtifactData';
import ArtifactData from './ArtifactData';

function Artifact(){

    return (
        <div className="card-container">
            <div className="card-img">
                <img src="https://preview.redd.it/did-we-ever-got-an-oficial-info-about-what-are-the-ender-v0-l4t73uiund2f1.jpeg?auto=webp&s=7974bd7b5006d96a3bb28bef0e1067fed135ba7c"/>
                

                <button className="delete-button">
                    <img src="src/assets/delete.png"/>
                </button>


            </div>

            <div className="card-info">
                <div className="basic-info">
            
                    <ArtifactData style={"artifact-display-data"} englishName={"Shrek Buddha"} vernacularName={"Shrek na buddha"} dateReceived={"1945/12/12"} />
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
