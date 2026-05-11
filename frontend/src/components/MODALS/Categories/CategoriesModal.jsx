import Modal from 'react-bootstrap/Modal';
import Tooltip from '@mui/material/Tooltip';
import './CategoriesModal.css';
import { useState, useRef, useCallback } from 'react';

function CategoryItem({ category, onNameChange, onDelete, deletingId, savingId }) {
  const inputRef = useRef(null);

  return (
    <Tooltip title="Tap To Edit" placement="left" PopperProps={{ modifiers: [{ name: 'offset', options: { offset: [0, 10] } }] }}>
      <li>
        <input
          ref={inputRef}
          type="text"
          value={category.categoryname}
          onChange={(e) => onNameChange(category.categoryid, e.target.value, inputRef)}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {savingId === category.categoryid && (
            <span style={{ fontSize: '0.75rem', color: '#888' }}>Saving...</span>
          )}
          <button onClick={() => onDelete(category.categoryid)} disabled={deletingId === category.categoryid}>
            {deletingId === category.categoryid ? "Deleting..." : "Delete"}
          </button>
        </div>
      </li>
    </Tooltip>
  );
}

function CategoriesModal({ showCategories, setShowCategories, categories, setCategories }) {
  const [categoryInput, setCategoryInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [savingId, setSavingId] = useState(null);
  const debounceTimers = useRef({});

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

  const handleDeleteCategory = async (categoryId) => {
    if (debounceTimers.current[categoryId]) {
      clearTimeout(debounceTimers.current[categoryId]);
      delete debounceTimers.current[categoryId];
    }
    setDeletingId(categoryId);
    try {
      const response = await fetch(`http://127.0.0.1:3000/api/v1/categories/${categoryId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete category");
      setCategories((prev) => prev.filter((cat) => cat.categoryid !== categoryId));
    } catch (err) {
      console.error("Error deleting category:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const updateCategoryOnServer = useCallback(async (categoryId, newName) => {
    setSavingId(categoryId);
    try {
      const response = await fetch(`http://127.0.0.1:3000/api/v1/categories/${categoryId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryName: newName }),
      });
      if (!response.ok) throw new Error("Failed to update category");
    } catch (err) {
      console.error("Error updating category:", err);
    } finally {
      setSavingId((prev) => (prev === categoryId ? null : prev));
    }
  }, []);

  const handleCategoryNameChange = (categoryId, newName, inputRef) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.categoryid === categoryId ? { ...cat, categoryname: newName } : cat
      )
    );

    if (debounceTimers.current[categoryId]) {
      clearTimeout(debounceTimers.current[categoryId]);
    }

    debounceTimers.current[categoryId] = setTimeout(() => {
      updateCategoryOnServer(categoryId, newName.trim());
      delete debounceTimers.current[categoryId];
      inputRef?.current?.blur();
    }, 600);
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
              <CategoryItem key={category.categoryid} category={category} onNameChange={handleCategoryNameChange} onDelete={handleDeleteCategory} deletingId={deletingId} savingId={savingId}/>
            ))}
          </ol>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default CategoriesModal;