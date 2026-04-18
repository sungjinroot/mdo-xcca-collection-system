import Modal from 'react-bootstrap/Modal';
import './CategoriesModal.css';
import { useState } from 'react';

function CategoriesModal({ showCategories, setShowCategories }){

    const [categories,setCategories] = useState(["First","Second","Third","Forth","Fifth","Sixth","Seventh","Eigth"]);
        
    return (
        <Modal show={showCategories} onHide={() => setShowCategories(false)} aria-labelledby="example-custom-modal-styling-title">
            <Modal.Header closeButton style={{ backgroundColor: '#283971' }} className="d-flex align-items-center">
                <img src="src/assets/logo.png"/>

            </Modal.Header>
            
            <Modal.Body> 

                <div className="categories-container">
                    <div className="categories-input-field">
                        <input type="text" className="categories-input-form"/>
                        <button className="categories-input-form"> New category </button>
                    </div>

                    <ol className="category-list">
                        {categories.map((category, index) => (
                            <li key={index}>
                                <input type="text" value="category"/>
                                <button> Delete </button>
                            </li>
                        ))}
                    </ol>

                </div>

            </Modal.Body>
        </Modal>
  );
}

export default CategoriesModal;

