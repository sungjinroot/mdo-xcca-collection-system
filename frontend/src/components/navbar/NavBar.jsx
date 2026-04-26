import './NavBar.css';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AssistantsModal from '../MODALS/Assistants/AssistantsModal.jsx';
import { useState } from 'react';

function NavBar() {
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
    };

    const [showAssistants,setShowAssistants] = useState(false);

    function handleOpen(){
        handleClose();
        setShowAssistants(true);
    }

    return (
        
        <nav className="nav-container">

            <div className="nav-left">
                <img src="src/assets/logo.png" alt="centennial" />
                <img src="src/assets/centennial.png" alt="centennial" />
            </div>

            <div className="nav-stats">
                <h5> Artifacts Collected: 10 </h5>
                <h5> Artifacts in this room: 15 </h5>
            </div>

            <div className="nav-functions-container">

                <div className="search">
                    <input type="text" placeholder="Search by keyword..." />

                    <select value={category} onChange={handleChange}>
                        <option value="">No Category</option>
                        <option value="second">Second</option>
                        <option value="third">Third</option>
                    </select>
                </div>

                <div className="profile">
                    <img
                        src="src/assets/profile.png"
                        alt="profile"
                        onClick={handleMenuOpen}
                        style={{ cursor: 'pointer' }}
                    />
                </div>

                <Menu id="basic-menu" anchorEl={anchorEl} open={open} onClose={handleClose} MenuListProps={{'aria-labelledby': 'basic-button',}}>
                    <MenuItem onClick={handleClose}>User Manual</MenuItem>
                    <MenuItem onClick={() => handleOpen()}>Users</MenuItem>
                    <MenuItem onClick={handleClose}>Logout</MenuItem>
                </Menu>

            </div>

            <AssistantsModal showAssistants={showAssistants} setShowAssistants={setShowAssistants}/>

        </nav>
    );
}

export default NavBar;