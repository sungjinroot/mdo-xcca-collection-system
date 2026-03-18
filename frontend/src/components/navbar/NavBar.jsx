import './NavBar.css'

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

                    <select>
                        <option> No Category </option>
                        <option> 2 </option>
                        <option> 3 </option>
                        <option> 4 </option>
                        <option> 5 </option>
                        <option> 6 </option>
                        <option> 7 </option>
                        <option> 8 </option>
                        <option> 9 </option>
                        <option> 10 </option>
                        <option> 11 </option>
                    </select>
                </div>

                <div className="profile">
                    <img src="src/assets/profile.png" onClick="alert(5)"/>
                </div>

            </div>
        </nav>
    )
}

export default NavBar;