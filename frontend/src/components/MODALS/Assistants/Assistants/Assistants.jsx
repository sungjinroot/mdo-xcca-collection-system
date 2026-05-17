import './Assistants.css';

function Assistants({ username, canAdd }) {

    return (
        <div className="assistants-container">
            <div className="assistant-header">
                <label>
                    {canAdd ? 'Assistant' : 'Guest'}
                </label>

                <img src="src/assets/delete.png" alt="delete" />
                
            </div>

            <div className="assistant-creds">
                <h1>
                    {username}
                </h1>
            </div>
        </div>
    );
}

export default Assistants;