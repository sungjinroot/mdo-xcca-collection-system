import './NavBar.css'
import Logo from './Logo.jsx';

function NavBar(){

    return (
        <nav className="nav-container">
            
            <Logo LogoSrc="src/assets/logo.png"/>

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