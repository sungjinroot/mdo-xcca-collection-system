import { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Assistants from './Assistants/Assistants.jsx';
import './AssistantsModalHeight.css';
import './AssistantsModalWidth.css';
import './AssistantsModal.css';

function AssistantsModal({ showAssistants, setShowAssistants }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAssistant, setIsAssistant] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://127.0.0.1:3000/api/v1/users');
        const data = await response.json();
        if (!response.ok) {
          setError(data.error || 'Failed to fetch users.');
        } else {
          setUsers(data);
        }
      } catch (err) {
        setError('Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const clearMessageAfterDelay = () => {
    setTimeout(() => {
      setError('');
      setSuccess('');
    }, 5000);
  };

  const handleCreateUser = async () => {
    setError('');
    setSuccess('');

    if (!username || !password) {
      setError('Username and password are required.');
      clearMessageAfterDelay();
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:3000/api/v1/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password,
          canAdd: isAssistant,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to create user.');
        clearMessageAfterDelay();
      } else {
        setSuccess(`User "${data.user.username}" created successfully!`);
        setUsers(prev => [...prev, data.user]);
        setUsername('');
        setPassword('');
        setIsAssistant(false);
        clearMessageAfterDelay();
      }
    } catch (err) {
      setError('Network error. Please try again.');
      clearMessageAfterDelay();
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = (userid) => {
    setUsers(prev => prev.filter(user => user.userid !== userid));
  };

  return (
    <Modal show={showAssistants} onHide={() => setShowAssistants(false)} aria-labelledby="example-custom-modal-styling-title" contentClassName="AssistantsModalHeight" dialogClassName="AssistantsModalWidth" centered>
      <Modal.Header closeButton style={{ backgroundColor: '#283971' }} className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-3">
          <h3 style={{ color: 'white', margin: 0 }}> Users </h3>
          {error && <p style={{ color: '#ff6b6b', margin: 0, fontSize: '0.85rem' }}>{error}</p>}
          {success && <p style={{ color: 'white', margin: 0, fontSize: '0.85rem' }}>{success}</p>}
        </div>
      </Modal.Header>
      <Modal.Body className="p-0">

        <div className="assistants-grid">
          <div className="add-assistants">
            <label> Create User </label>
            <div className="new-assistant-form">
              <input type="text" placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} />
              <input type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
              <div className="assistant-priv">
                <label> Is Assistant? </label>
                <input type="checkbox" checked={isAssistant} onChange={(e) => setIsAssistant(e.target.checked)} />
                <button onClick={handleCreateUser} disabled={loading}>
                  {loading ? 'Creating...' : 'New User'}
                </button>
              </div>
            </div>
          </div>

          {users.map(user => (
            <Assistants key={user.userid} userid={user.userid} username={user.username} canAdd={user.canadd} onDelete={handleDeleteUser}/>
          ))}

        </div>
      </Modal.Body>
    </Modal>
  );
}

export default AssistantsModal;