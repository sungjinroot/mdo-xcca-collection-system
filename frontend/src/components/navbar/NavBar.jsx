import './NavBar.css'
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

function NavBar(){

    return (
        <nav className="nav-container">
            <div className="logo">
                <img src="src/assets/logo.png"/>
            </div>

            <div className="nav-functions-container">
                
                <div className="search">
                    <input type="text" placeholder="Search by keyword..."/>

                    {/*To do later: Make select dynamic and fetch from the categories table... */}
                    
                    {/*make custom dropdown here. increase width. add more dropdowns!*/}

                </div>

                <div className="profile">
                    <img src="src/assets/profile.png" onClick="alert(5)"/>
                </div>

            </div>
        </nav>
    )
}

export default NavBar;