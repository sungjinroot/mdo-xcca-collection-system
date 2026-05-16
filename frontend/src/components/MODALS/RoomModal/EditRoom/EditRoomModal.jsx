import { useState, useEffect, useRef, useCallback } from 'react';
import Modal from 'react-bootstrap/Modal';
import './EditRoomModal.css';
import Tooltip from '@mui/material/Tooltip';

const DEBOUNCE_DELAY = 500;

function EditRoomModal({ showEdit, setShowEdit, roomId, setRoomId, roomIndex, setRoomIndex, setRooms }) {
  const [title, setTitle] = useState("");
  const [roomName, setRoomName] = useState("");
  const [caption, setCaption] = useState("");
  const [saveStatus, setSaveStatus] = useState("idle");

  const debounceTimer = useRef(null);
  const isFirstLoad = useRef(true);

  useEffect(() => {
    if (!roomId) return;
    isFirstLoad.current = true;
    setSaveStatus("idle");

    const fetchData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:3000/api/v1/rooms/${roomId}`);
        const result = await response.json();
        setTitle(result.title);
        setRoomName(result.roomname);
        setCaption(result.caption);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setTimeout(() => { isFirstLoad.current = false; }, 100);
      }
    };

    fetchData();
  }, [roomId, roomIndex]);

  const debouncedSave = useCallback((updatedFields) => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    setSaveStatus("saving");

    debounceTimer.current = setTimeout(async () => {
      try {
        const response = await fetch(`http://127.0.0.1:3000/api/v1/rooms/${roomId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedFields),
        });

        if (!response.ok) throw new Error(`PUT failed: ${response.status}`);

        const normalized = {};
        if ('roomName' in updatedFields) normalized.roomname = updatedFields.roomName;
        if ('title' in updatedFields) normalized.title = updatedFields.title;
        if ('caption' in updatedFields) normalized.caption = updatedFields.caption;

        setRooms(prev =>
          prev.map(r => r.roomid === roomId ? { ...r, ...normalized } : r)
        );

        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2000);
      } catch (error) {
        console.error("Save error:", error);
        setSaveStatus("error");
      }
    }, DEBOUNCE_DELAY);
  }, [roomId, setRooms]);

  useEffect(() => {
    if (isFirstLoad.current) return;
    debouncedSave({ title });
  }, [title]);

  useEffect(() => {
    if (isFirstLoad.current) return;
    debouncedSave({ roomName });
  }, [roomName]);

  useEffect(() => {
    if (isFirstLoad.current) return;
    debouncedSave({ caption });
  }, [caption]);

  useEffect(() => {
    return () => { if (debounceTimer.current) clearTimeout(debounceTimer.current); };
  }, []);

  const handleDeleteRoom = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:3000/api/v1/rooms/${roomId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.code || `Failed to delete room: ${response.status}`);
      }

      setRooms(prev => prev.filter(r => r.roomid !== roomId));
      setRoomIndex(null);
      setRoomId(null);
      setShowEdit(false);
    } catch (error) {
      console.error('Error deleting room:', error);
      alert("Replace this with a proper modal soon. Cannot delete room if it houses artifacts");
      setShowEdit(false);
    }
  };

  const statusLabel = {
    idle: null,
    saving: "Saving...",
    saved: "Saved",
    error: "Save failed",
  }[saveStatus];

  return (
    <Modal show={showEdit} onHide={() => setShowEdit(false)} aria-labelledby="example-custom-modal-styling-title">
      <Modal.Header closeButton style={{ backgroundColor: '#283971' }} className="d-flex align-items-center justify-content-between">
        <h3 style={{ color: 'white' }}>Modify Room</h3>
        {statusLabel && (
          <span style={{ color: saveStatus === "error" ? "#ff6b6b" : "#90ee90", fontSize: "0.85rem", marginLeft: "auto", marginRight: "0.75rem" }}>
            {statusLabel}
          </span>
        )}
      </Modal.Header>
      <Modal.Body>
        <div className="room-modal-body">
          <div className="room-field">
            <label>Modify Title</label>
            <Tooltip title="Type to edit" placement="left">
              <input type="text" placeholder="edit text" value={title} onChange={(e) => setTitle(e.target.value)} />
            </Tooltip>
          </div>

          <div className="room-field">
            <label>Modify Room Name</label>
            <Tooltip title="Type to edit" placement="left">
              <input type="text" placeholder="edit text" value={roomName} onChange={(e) => setRoomName(e.target.value)} />
            </Tooltip>
          </div>

          <div className="room-field">
            <label>Modify Caption</label>
            <Tooltip title="Type to edit" placement="left">
              <input type="text" placeholder="edit text" value={caption} onChange={(e) => setCaption(e.target.value)} />
            </Tooltip>
          </div>

          <div className="room-field room-field-file">
            <div className="file-input-wrapper">
              <div className="file-input">
                <label>Modify Room Photo</label>
                <input type="file" />
              </div>
              <button className="submit-btn">Change Photo</button>
            </div>
          </div>

          <div className="room-delete-option">
            <label>Don't want this room anymore?</label>
            <div className="delete-room-button" onClick={handleDeleteRoom}>
              <center>Remove Room</center>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default EditRoomModal;