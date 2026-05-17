import './Assistants.css';

function Assistants({ userid, username, canAdd, onDelete }) {
  const handleDelete = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:3000/api/v1/users/${userid}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onDelete(userid);
      } else {
        const data = await response.json();
        console.error(data.error || 'Failed to delete user.');
      }
    } catch (err) {
      console.error('Network error. Please try again.');
    }
  };

  return (
    <div className="assistants-container">
      <div className="assistant-header">
        <label>
          {canAdd ? 'Assistant' : 'Guest'}
        </label>
        <img src="src/assets/delete.png" alt="delete" onClick={handleDelete} style={{ cursor: 'pointer' }} />
      </div>
      <div className="assistant-creds">
        <h3>
          {username}
        </h3>
      </div>
    </div>
  );
}

export default Assistants;