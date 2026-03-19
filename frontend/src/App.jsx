import React from 'react';
import './Config.css';
import { useState, useEffect } from 'react';
import Pagination from '@mui/material/Pagination';
import NavBar from './components/navbar/NavBar.jsx';
import Rooms from './components/rooms/Rooms.jsx';

function App() {

  const [searchQuery,setSearchQuery] = useState("");
  const [currentRoom,setCurrentRoom] = useState(0);

  return (
    <>
    
    <NavBar/> {/*Pass in searchQuery soon as props*/}
    <Rooms/> {/*Pass in currentRoom soon as props */}

    <div className="main-content">
      <div className="first"> Content </div>
      

      <div className="footer"> 
        <Pagination count={20} shape="rounded" /> {/* Calculate based on table size soon*/}
      </div>
    </div>
  

  
    </>
  );
}

export default App
