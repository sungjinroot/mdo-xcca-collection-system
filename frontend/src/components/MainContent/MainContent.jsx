import Options from "../options/Options.jsx";
import Artifact from "../artifact/Artifact.jsx";
import './Main.css';


function MainContent(){

    return (
    <>

        <div className="main-content">
            <Options/>
            <div className="gnome-container"> 
                
                
                <div className="move-left move"> 
                    <span aria-hidden="true" className="carousel-control-prev-icon move-icon"></span>
                </div> 
                

                <div className="artifacts-grid"> 
                    <Artifact/> 
                    <Artifact/> 
                    <Artifact/> 
                    <Artifact/> 
                    <Artifact/> 
                    <Artifact/> 
                    <Artifact/>
                    <Artifact/>
                    <Artifact/>
                    <Artifact/>
                    <Artifact/>
                    <Artifact/>
                    <Artifact/>
                    <Artifact/>
                    <Artifact/>
                    <Artifact/>
                    <Artifact/>
                    <Artifact/>
                    <Artifact/>
                    <Artifact/>
                    <Artifact/>
                    <Artifact/>
                    <Artifact/>
                    <Artifact/>
                    <Artifact/>
                    <Artifact/>

                </div>
                
                
                <div className="move-right move"> 
                    <span aria-hidden="true" className="carousel-control-next-icon move-icon"></span> 
                </div>
                
                
            </div> 
      
        </div>
        
        
        </>
    )
}

export default MainContent;

