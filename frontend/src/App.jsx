import React from 'react';
import { useState, useEffect } from 'react';
import NavBar from './components/navbar/NavBar.jsx';
import Rooms from './components/rooms/Rooms.jsx';
import Footer from './components/footer/Footer.jsx';
import MainContent from './components/MainContent/MainContent.jsx';

function App() {

  const [searchQuery,setSearchQuery] = useState("");
  const [currentRoom,setCurrentRoom] = useState(0);

  return (
    <>
    
    <NavBar/> {/*Pass in searchQuery soon as props*/}
    <Rooms/> {/*Pass in currentRoom, and all rooms soon as props */}
    <MainContent/>
    <Footer/>
  
    </>
  );
}

export default App;