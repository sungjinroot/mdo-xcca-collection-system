import React from 'react';
import { useState, useEffect } from 'react';
import NavBar from './components/navbar/NavBar.jsx';
import Rooms from './components/rooms/Rooms.jsx';
import Footer from './components/footer/Footer.jsx';
import MainContent from './components/MainContent/MainContent.jsx';
import Login from './components/login/Login.jsx';

function App() {

  const [categories,setCategories] = useState(null);
  const [categoryId,setCategoryId] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  
  const [roomIndex, setRoomIndex] = useState(null);
  const [roomId, setRoomId] = useState(null);

  //Debugging purposes
  useEffect(() => {
    console.log(categoryId);
  }),[categoryId];

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('http://127.0.0.1:3000/api/v1/categories');
      const result = await response.json();
      setCategories(result)
      console.log(result);
    };
    fetchData();
  },[]);

  return (
    <>
    
      <NavBar categories={categories} setCategoryId={setCategoryId}/> {/*Pass in searchQuery soon as props*/}
      <Rooms roomIndex={roomIndex} setRoomIndex={setRoomIndex} roomId={roomId} setRoomId={setRoomId} categories={categories} setCategories={setCategories}/> {/*Pass in currentRoom, and all rooms soon as props */}
      <MainContent categories={categories}/>
      <Footer/>

      {/*<Login/>*/}
            
    </>
  );
}

export default App;