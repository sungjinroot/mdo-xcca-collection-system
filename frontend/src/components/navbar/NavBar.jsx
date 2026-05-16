import './NavBar.css';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState, useEffect } from 'react';

const images = [
  'src/assets/xcca.png',
  'src/assets/omm.jpg',
  'src/assets/mdo.jpg',
];

function NavBar({ categories, setCategoryId, searchQuery, setSearchQuery, setRoomId, setRoomIndex, onLogout }) {
  const [category, setCategory] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sliding, setSliding] = useState(false);
  const open = Boolean(anchorEl);

  useEffect(() => {
    const interval = setInterval(() => {
      setSliding(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
        setSliding(false);
      }, 400); 
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
  handleClose();
  onLogout();
};

  const handleChange = (event) => {
    setCategory(event.target.value);
    setCategoryId(event.target.value ? Number(event.target.value) : null);
  };

  function handleSearchQuery(query) {
    setRoomIndex(null);
    setRoomId(null);
    setSearchQuery(query);
  }

  return (
    <nav className="nav-container">
      <div className="nav-left">
        <img src="src/assets/logo.png" alt="centennial" />
        <img src="src/assets/centennial.png" alt="centennial" />
      </div>

      <div className="nav-stats">
        <h5>Artifacts Collected: 234</h5>
        <h5>Artifacts in this room: 157</h5>
      </div>

      <div className="nav-functions-container">
        <div className="search">
        
          <input type="text" placeholder="Search by keyword..." value={searchQuery} onChange={(e) => handleSearchQuery(e.target.value)}/>
          <select value={category} onChange={handleChange}>
            <option onClick={() => setCategoryId(null)}>No Category</option>
            {categories && categories.map((cat) => (
              <option key={cat.categoryid} value={cat.categoryid}>
                {cat.categoryname}
              </option>
            ))}
          </select>

        </div>
        
        
        <div className="profile">
          <div className="profile-carousel">
            <img src={images[currentIndex]} alt="profile" onClick={handleMenuOpen} className={sliding ? 'slide-out' : 'slide-in'}/>
          </div>
        </div>


        <Menu id="basic-menu" anchorEl={anchorEl} open={open} onClose={handleClose} MenuListProps={{ 'aria-labelledby': 'basic-button' }}>
          <MenuItem onClick={handleClose}>User Manual</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </div>
    </nav>
  );
}

export default NavBar;