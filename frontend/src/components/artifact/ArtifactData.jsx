
function ArtifactData({ style, englishName, vernacularName}){
    
    return (
        <>
            <div className={style}>
                <span> {englishName} </span> 
            </div>

            <div className={style}>
                <i> 
                    <span> {vernacularName} </span> 
                </i>
            </div>
        
        </>
    )
    
}

export default ArtifactData;

