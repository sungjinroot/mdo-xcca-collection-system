import './AddArtifact.css'

function AddArtifact(){

    return (
        <div className="add-artifact-container">
            <div className="add-artifact-img-container">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9idG8QYSEGoLQSHRCOBopLopos_RvteNVxw&s"/>
            </div>

            <div className="artifact-stat-data">
                <div className="stat-data-row"> 
                    Head Count
                </div>
                
                <div className="stat-data-row"> 
                    Artifacts: 103  
                </div>
                
                <div className="stat-data-row"> 
                    Rooms: 103  
                </div>
            </div>
        </div>
    );
}

export default AddArtifact;