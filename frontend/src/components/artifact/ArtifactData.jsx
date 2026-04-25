
function ArtifactData({ style, englishName, vernacularName, dateReceived }){
    
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
            
            
            <div className={style}>
                <span> Collected on {dateReceived} </span> 
            </div>

        </>
    )
    
}

export default ArtifactData;

