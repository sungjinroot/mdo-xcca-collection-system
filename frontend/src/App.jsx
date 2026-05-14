import React from 'react';
import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './components/navbar/NavBar.jsx';
import Rooms from './components/rooms/Rooms.jsx';
import Footer from './components/footer/Footer.jsx';
import MainContent from './components/MainContent/MainContent.jsx';
import Login from './components/login/Login.jsx';
import CategoriesModal from './components/MODALS/Categories/CategoriesModal.jsx';

function App() {
  //too late to refactor using useContext :/
  //Cant afford any regressions rn. 

  //TO DO - update everything once an artifact is added

  //reminder - remove statistics api for counter...

  const [currentPage,setCurrentPage] = useState(1); 
  const [totalPages,setTotalPages] = useState(1);


  const [categories,setCategories] = useState(null);
  const [categoryId,setCategoryId] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  
  const [roomIndex, setRoomIndex] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [rooms, setRooms] = useState([]);

  const [artifacts,setArtifacts] = useState([]);

  // Auth state — persist across refresh
  const [user, setUser] = useState(() => {
    const saved = sessionStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });


  

  async function initiateArtifactSearch(){
    if (roomId){
      const response = await fetch(`http://127.0.0.1:3000/api/v1/artifactsdisplay/?search=${searchQuery}&categoryID=${categoryId}&roomID=${roomId}&page=${currentPage}`);
      const result = await response.json();

      setTotalPages(result.pagination.totalPages)
      setArtifacts(result.data); 
    } else{
      const response = await fetch(`http://127.0.0.1:3000/api/v1/artifactsdisplay/?search=${searchQuery}&categoryID=${categoryId}&page=${currentPage}`);
      const result = await response.json();

      setTotalPages(result.pagination.totalPages)
      setArtifacts(result.data); 
    }
    
  }

  useEffect(() =>{
    initiateArtifactSearch();
    console.log(artifacts);
  },[currentPage,roomId,categoryId,searchQuery])


  const handleLoginSuccess = (userData) => {
    sessionStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    setUser(null);
  };

  // Debugging purposes
  useEffect(() => {
    console.log(categoryId);
  }, [categoryId]);

  useEffect(() => {
    const fetchDefaultRooms = async () => {
      try {
        const response = await fetch('http://127.0.0.1:3000/api/v1/rooms');
        const result = await response.json();
        setRooms(result);
        console.log(result);
      } catch (error) {
        console.error('Failed to fetch rooms:', error);
      }
    };

    const fetchDefaultArtifacts = async () => {
      try {
        const response = await fetch('http://127.0.0.1:3000/api/v1/artifactsdisplay');
        const result = await response.json();
        setArtifacts(result.data);
      } catch (error){
        console.error('Failed to fetch artifact displays:', error);
      }
    }

    fetchDefaultRooms();
    fetchDefaultArtifacts();

  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:3000/api/v1/categories');
        const result = await response.json();
        setCategories(result);
        console.log(result);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    fetchData();
  }, []);

 
  // Protected layout component
  
  
  //const ProtectedLayout = () => {
    //if (!user) return <Navigate to="/login" replace />;

    return (
      <>
        <NavBar categories={categories} setCategoryId={setCategoryId} searchQuery={searchQuery} setSearchQuery={setSearchQuery} setRoomId={setRoomId} setRoomIndex={setRoomIndex}/> 
        <Rooms roomIndex={roomIndex} setRoomIndex={setRoomIndex} roomId={roomId} setRoomId={setRoomId} rooms={rooms} setRooms={setRooms} categories={categories} setCategories={setCategories} setCurrentPage={setCurrentPage}/> 
        <MainContent categories={categories} rooms={rooms} artifacts={artifacts}/>
        <Footer totalPages={totalPages} setTotalPages={setTotalPages} currentPage={currentPage} setCurrentPage={setCurrentPage}/>
      </>
    );
  };
  
  //return (
    //<Routes>
      //<Route path="/login" element={
          //user
            //? <Navigate to="/" replace />
            //: <Login onLoginSuccess={handleLoginSuccess} />
        //}
      ///>
      //<Route path="/*" element={<ProtectedLayout />} />
    //</Routes>
  //);
  
//}

export default App;