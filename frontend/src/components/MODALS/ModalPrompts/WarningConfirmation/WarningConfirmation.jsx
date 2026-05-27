import Modal from 'react-bootstrap/Modal';
import './WarningConfirmation.css';

function WarningConfirmation(props) {
  const handleClose = () => props.setShowWarning(false);

  const handleConfirm = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:3000/api/v1/artifacts/${props.artifactId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        console.error("Failed to delete artifact");
        return;
      }

      handleClose();
      props.initiateArtifactSearch();
      if (props.onConfirm) props.onConfirm();

    } catch (error) {
      console.error("Error deleting artifact:", error);
    }
  };

  return (
    <Modal show={props.showWarning} onHide={handleClose} centered contentClassName="warning-confirmation-modal">
      <Modal.Header closeButton className="warning-confirmation-header">
      </Modal.Header>
      <Modal.Body className="warning-confirmation-body">
        <div className="warning-confirmation-icon">!</div>
        <h4>Confirm Deletion</h4>
        <p>
          Are you sure you want to delete this record?
          <span>This action cannot be undone.</span>
        </p>
        <div className="warning-confirmation-actions">
          <button onClick={handleClose} className="warning-confirmation-cancel">
            Cancel
          </button>
       
          <button onClick={handleConfirm} className="warning-confirmation-delete">
            Delete
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default WarningConfirmation;
