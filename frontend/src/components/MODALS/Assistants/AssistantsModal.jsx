import Modal from 'react-bootstrap/Modal';
import Assistants from './Assistants/Assistants.jsx';
import './AssistantsModalHeight.css';
import './AssistantsModalWidth.css';
import './AssistantsModal.css';

function AssistantsModal({showAssistants, setShowAssistants}){

    return (
        <Modal show={showAssistants} onHide={() => setShowAssistants(false)} aria-labelledby="example-custom-modal-styling-title" contentClassName="AssistantsModalHeight" dialogClassName="AssistantsModalWidth" centered>
            <Modal.Header closeButton style={{ backgroundColor: '#283971' }} className="d-flex align-items-center">
                <h3 style={{'color': 'white'}}> Assistants </h3>
            </Modal.Header>
            
            <Modal.Body className="p-0">
                <div className="assistants-grid">
                    <div className="add-assistants">
                        <label> Create User </label>

                        <div className="new-assistant-form">
                            <input type="text" placeholder='Username'/>
                            <input type="text" placeholder='Password'/>
                            <div className="assistant-priv">
                                <label> Is Assistant? </label>
                                <input type="checkbox"/>
                                <button> New User </button>
                            </div>
                        </div>
                    </div>

                    <Assistants/>
                    <Assistants/>
                    <Assistants/>
                    <Assistants/>
                    <Assistants/>
                    <Assistants/>
                    <Assistants/>
                    <Assistants/>
                    <Assistants/>
                    <Assistants/>
                    <Assistants/>


                </div>
            </Modal.Body>
        </Modal>

    )
}

export default AssistantsModal;