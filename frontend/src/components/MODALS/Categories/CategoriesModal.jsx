import Modal from 'react-bootstrap/Modal';
import Tooltip from '@mui/material/Tooltip';
import './CategoriesModal.css';
import { useState } from 'react';

function CategoriesModal({ showCategories, setShowCategories, categories, setCategories }) {
  const [categoryInput, setCategoryInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddCategory = async () => {
    const trimmed = categoryInput.trim();
    if (!trimmed) return;

    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:3000/api/v1/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryName: trimmed }),
      });

      if (!response.ok) throw new Error("Failed to add category");

      const newCategory = await response.json();
      setCategories((prev) => [...prev, newCategory]);
      setCategoryInput("");
    } catch (err) {
      console.error("Error adding category:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleAddCategory();
  };

  return (
    <Modal show={showCategories} onHide={() => setShowCategories(false)} aria-labelledby="example-custom-modal-styling-title">
      <Modal.Header closeButton style={{ backgroundColor: '#283971' }} className="d-flex align-items-center">
        <h3 style={{ color: 'white' }}>Categories</h3>
      </Modal.Header>
      <Modal.Body>
        <div className="categories-container">
          <div className="categories-input-field">
            <input type="text" className="categories-input-form" value={categoryInput} onChange={(e) => setCategoryInput(e.target.value)} onKeyDown={handleKeyDown} placeholder="New category name..." disabled={loading}/>
            
            <button className="categories-input-form" onClick={handleAddCategory} disabled={loading || !categoryInput.trim()}>
              {loading ? "Adding..." : "New category"}
            </button>
          </div>
          <ol className="category-list">
            {categories && categories.map((category) => (
              <Tooltip key={category.categoryid} title="Tap To Edit" placement="left" PopperProps={{ modifiers: [{ name: 'offset', options: { offset: [0, 10] } }] }}>
                <li>
                  <input type="text" value={category.categoryname} onChange={() => {}} />
                  <div>
                    <button>Delete</button>
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