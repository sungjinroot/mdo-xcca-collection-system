
function ArtifactData({ style, englishName, vernacularName, dateReceived }){
    
    return (
        <>
            <div className={style}>
                {englishName} 
            </div>

            <div className={style}>
                <i> 
                    {vernacularName} 
                </i>
            </div>
            
            
            <div className={style}>
                Collected on {dateReceived} 
            </div>

        </>
    )
    
}

export default ArtifactData;

