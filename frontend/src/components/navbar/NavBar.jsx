import './NavBar.css'
import Logo from './Logo.jsx';
import { useState } from 'react';

function NavBar(){

    const [category, setCategory] = useState('');

    const handleChange = (event) => {
        setCategory(event.target.value);
    };

    return (
        <nav className="nav-container">
            
            <Logo LogoSrc="src/assets/logo.png"/>

            <div className="nav-functions-container">
                
                <div className="search">
                    <input type="text" placeholder="Search by keyword..."/>

                    <select>
                        <option> No Category </option>
                        <option> Second </option>
                        <option> Third </option>
                        <option> Second </option>
                    </select>
                </div>

                <div className="profile">
                    <img 
                        src="src/assets/profile.png" 
                        onClick={() => alert(5)}
                        alt="profile"
                    />
                </div>

            </div>
        </nav>
    )
}

export default NavBar;