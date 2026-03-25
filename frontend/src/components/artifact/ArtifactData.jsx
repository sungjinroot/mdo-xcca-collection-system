
function ArtifactData(props){
    
    if (props.italic){
        return (
            <div className={props.style}>
                <i> {props.artifactData} </i> 
            </div>
        )
    }

    else{

        return (
            <div className={props.style}>
                {props.artifactData}  
            </div>
        )
    }   
}

export default ArtifactData;