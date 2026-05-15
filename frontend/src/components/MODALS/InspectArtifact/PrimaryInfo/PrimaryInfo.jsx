import './PrimaryInfo.css';

function PrimaryInfo({ currentArtifactData }){
    return (
        <div className="artifact-info-bottom">
           <div className="artifact-info-first-line">
                <div className="artifact-info-first-identifier">
                    <div className="artifact-info-identifier-fields">
                        <label> Accession Number </label>
                        <input type="text" value={currentArtifactData.artifacts.accessionNo}/>
                    </div>    

                    <div className="artifact-info-identifier-fields">
                        <label> Catalogue Number </label>
                        <select>
                            <option> 1 </option>
                            <option> 2 </option>
                            <option> 3 </option>
                        </select>
                    </div> 
                </div>
           </div>

           <div className="artifact-info-first-line">
                <div className="artifact-info-first-identifier">
                    <div className="artifact-info-identifier-fields">
                        <label> English Name </label>
                        <input type="text" value={currentArtifactData.artifactnames.englishName}/>
                    </div>    

                    <div className="artifact-info-identifier-fields">
                        <label> Vernacular Name </label>
                        <input type="text" value={currentArtifactData.artifactnames.vernacularName}/>
                    </div> 
                </div>
           </div>

           <div className="artifact-info-first-line">
                <div className="artifact-info-first-identifier">
                    <div className="artifact-info-identifier-fields">
                        <label> Storage Location </label>
                        <input type="text" value={currentArtifactData.artifacts.storageLocation}/>
                    </div>    
                </div>
           </div>
        </div>
    )
}

export default PrimaryInfo;
