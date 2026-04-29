import Modal from 'react-bootstrap/Modal';

function WarningConfirmation(props){

    const handleClose = () => props.setShowWarning(false);

    const handleConfirm = () => {
        props.onConfirm();
        handleClose();
    };

    return (
        <Modal 
            show={props.showWarning} 
            onHide={handleClose} 
            centered
        >
            <Modal.Header 
                closeButton 
                style={{ 
                    backgroundColor: '#283971',
                    borderBottom: 'none',
                    padding: '12px 16px'
                }}
            >
                <img 
                    src="src/assets/logo.png" 
                    alt="logo" 
                    style={{ height: '28px' }}
                />
            </Modal.Header>
            
            <Modal.Body 
                style={{ 
                    textAlign: 'center',
                    padding: '30px 25px'
                }}
            >
                

                <h4 style={{ marginBottom: '10px', fontWeight: '600' }}>
                    Confirm Deletion
                </h4>

                <p style={{ color: '#6c757d', marginBottom: '25px' }}>
                    Are you sure you want to delete this record? <br />
                    This action cannot be undone.
                </p>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                    <button 
                        onClick={handleClose}
                        style={{
                            padding: '10px 18px',
                            borderRadius: '6px',
                            border: '1px solid #ccc',
                            backgroundColor: '#f8f9fa',
                            cursor: 'pointer',
                            fontWeight: '500',
                            transition: '0.2s'
                        }}
                        onMouseOver={e => e.target.style.backgroundColor = '#e9ecef'}
                        onMouseOut={e => e.target.style.backgroundColor = '#f8f9fa'}
                    >
                        Cancel
                    </button>

                    <button 
                        onClick={handleConfirm}
                        style={{
                            padding: '10px 18px',
                            borderRadius: '6px',
                            border: 'none',
                            backgroundColor: '#dc3545',
                            color: '#fff',
                            cursor: 'pointer',
                            fontWeight: '500',
                            boxShadow: '0 2px 6px rgba(220,53,69,0.3)',
                            transition: '0.2s'
                        }}
                        onMouseOver={e => e.target.style.backgroundColor = '#bb2d3b'}
                        onMouseOut={e => e.target.style.backgroundColor = '#dc3545'}
                    >
                        Delete
                    </button>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default WarningConfirmation;