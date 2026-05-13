import './NavBar.css';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AssistantsModal from '../MODALS/Assistants/AssistantsModal.jsx';
import { useState, useEffect } from 'react';

function NavBar({ categories,setCategoryId, searchQuery, setSearchQuery }) {
    const [category, setCategory] = useState('');

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleChange = (event) => {
        setCategory(event.target.value);
        setCategoryId(event.target.value ? Number(event.target.value) : null);
    };

    return (
        
        <nav className="nav-container">

            <div className="nav-left">
                <img src="src/assets/logo.png" alt="centennial" />
                <img src="src/assets/centennial.png" alt="centennial" />
                <img src="src/assets/omm.jpg"/>
                <img src="src/assets/mdo.jpg"/>
            </div>

            <div className="nav-stats">
                <h5> Artifacts Collected: 234 </h5>
                <h5> Artifacts in this room: 157 </h5>
            </div>

            <div className="nav-functions-container">

                <div className="search">
                    <input type="text" placeholder="Search by keyword..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>

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
                    <img src="src/assets/xcca.png"  alt="profile" onClick={handleMenuOpen} style={{ cursor: 'pointer' }}/>
                </div>

                <Menu id="basic-menu" anchorEl={anchorEl} open={open} onClose={handleClose} MenuListProps={{'aria-labelledby': 'basic-button',}}>
                    <MenuItem onClick={handleClose}>User Manual</MenuItem>
                    <MenuItem onClick={handleClose}>Logout</MenuItem>
                </Menu>

            </div>
        </nav>
    );
}

export default NavBar;