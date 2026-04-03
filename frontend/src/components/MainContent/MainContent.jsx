import Options from "../options/Options.jsx";
import Artifact from "../artifact/Artifact.jsx";
import './Main.css';


function MainContent(){

    return (
    <>

        <div className="main-content">
            <Options/>
            <div className="gnome-container"> 
                
               
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
                    </div>
               
                
            </div> 


        </div>
        
        
        </>
    )
}

export default MainContent;

