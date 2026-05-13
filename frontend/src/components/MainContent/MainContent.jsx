import Options from "../options/Options.jsx";
import Artifact from "../artifact/Artifact.jsx";
import './Main.css';


function MainContent({ categories, rooms, artifacts }){

    console.log("I AM HERE");
    console.log(artifacts);

    return (
    <>

        <div className="main-content">
            <Options categories={categories} rooms={rooms}/>
            <div className="gnome-container"> 
                    <div className="artifacts-grid"> 
                        {artifacts.map((artifact) => (
                            <Artifact key={artifact.artifactid} artifactId={artifact.artifactId} englishName={artifact.englishname} vernacularName={artifact.vernacularname}/>
                        ))}                  
                    </div>
               
                
            </div> 


        </div>
        
        
        </>
    )
}

export default MainContent;

