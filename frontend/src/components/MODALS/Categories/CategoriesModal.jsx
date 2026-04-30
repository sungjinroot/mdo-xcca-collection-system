import Modal from 'react-bootstrap/Modal';
import Tooltip from '@mui/material/Tooltip';
import './CategoriesModal.css';
import { useState } from 'react';

function CategoriesModal({ showCategories, setShowCategories }){

    const [categories,setCategories] = useState(["First","Second","Third","Forth","Fifth","Sixth","Seventh","Eigth"]);
        
    return (
        <Modal show={showCategories} onHide={() => setShowCategories(false)} aria-labelledby="example-custom-modal-styling-title">
            <Modal.Header closeButton style={{ backgroundColor: '#283971' }} className="d-flex align-items-center">
                <h3 style={{'color': 'white'}}> Categories </h3>
            </Modal.Header>
            
            <Modal.Body> 

                <div className="categories-container">

                    <div className="categories-input-field">
                        <input type="text" className="categories-input-form"/>
                        <button className="categories-input-form"> New category </button>
                    </div>

                    <ol className="category-list">
                        {categories.map((category, index) => (
                            <Tooltip title="Tap To Edit" placement="left" PopperProps={{ modifiers: [{ name: 'offset', options: { offset: [0, 10] } }] }}>
                                <li key={index}>
                                    <input type="text" value="category"/>

                                    <div>
                                        <button> Delete </button>
                                    </div>
                                </li>
                            </Tooltip>
                        ))}
                    </ol>

                </div>

            </Modal.Body>
        </Modal>
  );
}

export default CategoriesModal;

