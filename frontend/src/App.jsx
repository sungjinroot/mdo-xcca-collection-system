import React from 'react';
import './Main.css';
import { useState, useEffect } from 'react';
import Pagination from '@mui/material/Pagination';
import NavBar from './components/navbar/NavBar.jsx';
import Rooms from './components/rooms/Rooms.jsx';
import Artifact from './components/artifact/Artifact.jsx';

function App() {

  const [searchQuery,setSearchQuery] = useState("");
  const [currentRoom,setCurrentRoom] = useState(0);

  return (
    <>
    
    <NavBar/> {/*Pass in searchQuery soon as props*/}
    <Rooms/> {/*Pass in currentRoom soon as props */}

    {/*To optimize soon... as is for now*/}
    <div className="main-content">
      <div className="gnome-container"> 
        <div className="move-left move"> 
          <span aria-hidden="true" className="carousel-control-prev-icon move-icon"></span>
        </div> 



        <div className="artifacts-grid"> 
          <Artifact/> 
          <Artifact/> 
          <Artifact/> 
          <Artifact/> 
          <Artifact/> 
          <Artifact/> 
          <Artifact/> 
          <Artifact/> 
          <Artifact/> 
          <Artifact/> 
          <Artifact/> 
          <Artifact/> 
          <Artifact/> 
          <Artifact/> 
          <Artifact/> 
          <Artifact/> 
          <Artifact/> 
          <Artifact/> 
          <Artifact/> 
          <Artifact/> 


        </div>



        <div className="move-right move"> 
          <span aria-hidden="true" className="carousel-control-next-icon move-icon"></span> 
        </div> 
      </div>
      
      <div className="footer"> 
        <Pagination count={20} shape="rounded" /> {/* Calculate based on table size soon of artifacts*/}
      </div>
    </div>
  

  
    </>
  );
}

export default App
