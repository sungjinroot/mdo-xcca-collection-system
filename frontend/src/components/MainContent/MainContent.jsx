import Options from "../options/Options.jsx";
import Artifact from "../artifact/Artifact.jsx";
import './Main.css';


function MainContent({ categories, rooms, artifacts, initiateArtifactSearch, role }){


    
    return (
    <>

        <div className="main-content">

            {role !== "guest" && (
                <Options categories={categories} rooms={rooms} initiateArtifactSearch={initiateArtifactSearch} role={role}/>
            )}
            <div className="gnome-container"> 
                    <div className="artifacts-grid"> 
                        {artifacts.map((artifact) => (
                            <Artifact key={artifact.artifactid} rooms={rooms} currentRoomId={artifact.roomid} currentRoomName={artifact.roomname} artifactId={artifact.artifactid} englishName={artifact.englishname} vernacularName={artifact.vernacularname} initiateArtifactSearch={initiateArtifactSearch} role={role}/>
                        ))}                  
                    </div>
               
                
            </div> 


        </div>
        
        
        </>
    )
}

export default MainContent;

