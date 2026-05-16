import Options from "../options/Options.jsx";
import Artifact from "../artifact/Artifact.jsx";
import './Main.css';


function MainContent({ categories, rooms, artifacts, initiateArtifactSearch }){

    console.log("I AM HERE");
    console.log(artifacts);

    return (
    <>

        <div className="main-content">
            <Options categories={categories} rooms={rooms} initiateArtifactSearch={initiateArtifactSearch}/>
            <div className="gnome-container"> 
                    <div className="artifacts-grid"> 
                        {artifacts.map((artifact) => (
                            <Artifact key={artifact.artifactid} rooms={rooms} currentRoomId={artifact.roomid} currentRoomName={artifact.roomname} artifactId={artifact.artifactid} englishName={artifact.englishname} vernacularName={artifact.vernacularname} initiateArtifactSearch={initiateArtifactSearch}/>
                        ))}                  
                    </div>
               
                
            </div> 


        </div>
        
        
        </>
    )
}

export default MainContent;

