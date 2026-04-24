import Modal from 'react-bootstrap/Modal';
import './AssistantsModalHeight.css';
import './AssistantsModalWidth.css';
import './AssistantsModal.css';

function AssistantsModal({showAssistants, setShowAssistants}){

    return (
        <Modal show={showAssistants} onHide={() => setShowAssistants(false)} aria-labelledby="example-custom-modal-styling-title" contentClassName="AssistantsModalHeight" dialogClassName="AssistantsModalWidth" centered>
            <Modal.Header closeButton style={{ backgroundColor: '#283971' }} className="d-flex align-items-center">
                <img src="src/assets/logo.png"/>
            </Modal.Header>
            
            <Modal.Body className="p-0">
                <div className="assistants-grid">
                    <div className="add-assistants">
                        <label> New Assistant </label>

                        <div className="new-assistant-form">
                            <input type="text" placeholder='Username'/>
                            <input type="text" placeholder='Password'/>
                            <div className="assistant-priv">
                                <label> Can Encode? </label>
                                <input type="checkbox"/>
                                <button> Create Assistant </button>
                            </div>
                        </div>
                    </div>

                    <div> second </div>
                </div>
            </Modal.Body>
        </Modal>

    )
}

export default AssistantsModal;