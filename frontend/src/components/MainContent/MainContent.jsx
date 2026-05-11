import Options from "../options/Options.jsx";
import Artifact from "../artifact/Artifact.jsx";
import './Main.css';


function MainContent({ categories, rooms }){

    return (
    <>

        <div className="main-content">
            <Options categories={categories} rooms={rooms}/>
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

