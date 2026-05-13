import './Assistants.css';

function Assistants(){

    return (
        <div className="assistants-container">
            <div className="assistant-header">
                <label> Assistant </label>

                <img src="src/assets/delete.png"/>
            </div>

            <div className="assistant-creds">
                
                <h4> newuser </h4>

                <h4> newpassword </h4>
            </div>

            
        </div>
    )
}

export default Assistants;