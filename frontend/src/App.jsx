import React from 'react';
import { useState, useEffect } from 'react';
import NavBar from './components/navbar/NavBar.jsx';
import Rooms from './components/rooms/Rooms.jsx';

function App() {

  const [searchQuery,setSearchQuery] = useState("");
  const [currentRoom,setCurrentRoom] = useState(0);

  return (
    <>
      <NavBar/> {/*Pass in searchQuery soon as props*/}
      <Rooms/> {/*Pass in currentRoom soon as props */}

    </>
  );
}

export default App
