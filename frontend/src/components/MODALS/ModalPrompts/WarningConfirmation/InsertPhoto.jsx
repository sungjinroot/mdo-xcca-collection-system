import Modal from 'react-bootstrap/Modal';

function InsertPhoto({ showImageInsert, setShowImageInsert }) {
  const handleClose = () => setShowImageInsert(false);

  return (
    <Modal show={showImageInsert} onHide={handleClose} centered>
      <Modal.Header closeButton style={{ backgroundColor: '#283971', borderBottom: 'none', padding: '12px 16px', color: 'white' }}>
        Upload New Photo
      </Modal.Header>
      <Modal.Body style={{ textAlign: 'center', padding: '30px 25px' }}>
        test
      </Modal.Body>
    </Modal>
  );
}

export default InsertPhoto;