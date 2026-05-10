import React from 'react';
import { useState, useEffect } from 'react';
import NavBar from './components/navbar/NavBar.jsx';
import Rooms from './components/rooms/Rooms.jsx';
import Footer from './components/footer/Footer.jsx';
import MainContent from './components/MainContent/MainContent.jsx';
import Login from './components/login/Login.jsx';

function App() {

  const [searchQuery, setSearchQuery] = useState("");

  const [roomIndex, setRoomIndex] = useState(0);
  const [roomId, setRoomId] = useState(null);


  return (
    <>
      
      <NavBar/> {/*Pass in searchQuery soon as props*/}
      <Rooms roomIndex={roomIndex} setRoomIndex={setRoomIndex} roomId={roomId} setRoomId={setRoomId}/> {/*Pass in currentRoom, and all rooms soon as props */}
      <MainContent/>
      <Footer />

      {/*<Login/>*/}
            
    </>
  );
}

export default App;