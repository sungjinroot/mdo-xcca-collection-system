import './NavBar.css'
import { useState } from 'react';

function NavBar(){

    const [category, setCategory] = useState('');

    const handleChange = (event) => {
        setCategory(event.target.value);
    };

    return (
        <nav className="nav-container">
            
            <div className="nav-left">
                <img src="src/assets/logo.png" alt="centennial"/>
                <img src="src/assets/centennial.png" alt="centennial"/>
            </div>
            


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