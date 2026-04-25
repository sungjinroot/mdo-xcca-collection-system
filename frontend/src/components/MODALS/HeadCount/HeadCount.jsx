import Modal from 'react-bootstrap/Modal';


function HeadCount(props){

    return (
        <Modal show={props.showHeadCount} onHide={() => props.setShowHeadCount(false)} aria-labelledby="example-custom-modal-styling-title">
            <Modal.Header closeButton style={{ backgroundColor: '#283971' }} className="d-flex align-items-center">
                <img src="src/assets/logo.png"/>
                            
            </Modal.Header>
            
            <Modal.Body> 
                
               
            </Modal.Body>
        </Modal>
  );
}


export default HeadCount;