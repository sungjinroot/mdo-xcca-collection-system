import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import { useState, useEffect } from 'react';
import './Rooms.css';
import NewRoomModal from '../MODALS/RoomModal/NewRoom/NewRoomModal.jsx';
import EditRoomModal from '../MODALS/RoomModal/EditRoom/EditRoomModal.jsx';
import CategoriesModal from '../MODALS/Categories/CategoriesModal.jsx';

function Rooms( {roomIndex, setRoomIndex, roomId, setRoomId, categories, setCategories, rooms, setRooms, setCurrentPage } ) {
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showCategories, setShowCategories] = useState(false);

  //Note to self: this calls the api when the add room modal is closed / open
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('http://127.0.0.1:3000/api/v1/rooms');
      const result = await response.json();
      setRooms(result); //use () => prev notation
      console.log(result);
    };
    fetchData();
  }, [showAdd,showEdit]);

  const handleEditRoom = (room) => {
    setShowEdit(true);
  };

  const handleRoomSelect = (selectedIndex) => {
    if (selectedIndex === 0) {
      setRoomIndex(null);   
      setRoomId(null);
    } else {
      const index = selectedIndex - 1;  
      setRoomIndex(index);
      setRoomId(rooms[index].roomid);
    }
    setCurrentPage(1);
  };


  return (
    <>
      <Carousel interval={null} indicators={false} style={{ zoom: '80%' }} onSelect={handleRoomSelect} activeIndex={roomIndex === null ? 0 : roomIndex + 1}>

        <Carousel.Item>
          <img className="d-block w-100 pan-image" src="https://host.javanielsen.dk/wp-content/uploads/2016/10/x5.jpg" alt="First slide" style={{ height: '200px', width: '100%', objectFit: 'cover' }} />
          <button className="button-utils-left utils" onClick={() => setShowCategories(true)}>Categories</button>
          <button className="button-utils-right utils" onClick={() => setShowAdd(true)}>New Room</button>
          <Carousel.Caption>
            <h2 style={{ color: 'white' }}><span className="highlight">Entire Artifact Collection</span></h2>
            <h3 style={{ color: 'white' }}><span className="highlight">Museo De Oro</span></h3>
            <p style={{ color: 'white' }}><span className="highlight">Museo de Oro, dubbed as the first folkloric museum in the country, is not an abode of dead things. It is, by all means, bursting with life, clad with vivid imagination and rich history.</span></p>
          </Carousel.Caption>
        </Carousel.Item>

        {rooms.map((room) => (
          <Carousel.Item key={room.roomid}>
            <img className="d-block w-100 pan-image" onClick={() => handleEditRoom(room)} src={room.roompictureurl} alt={room.roomname} style={{ height: '200px', width: '100%', objectFit: 'cover', cursor: 'pointer' }} />
            <button className="button-utils-left utils" onClick={() => setShowCategories(true)}>Categories</button>
            <button className="button-utils-right utils" onClick={() => setShowAdd(true)}>New Room</button>
            <Carousel.Caption onClick={() => handleEditRoom(room)} style={{ cursor: 'pointer' }}>
              <h2 style={{ color: 'white' }}><span className="highlight">{room.title}</span></h2>
              <h3 style={{ color: 'white' }}><span className="highlight">{room.roomname}</span></h3>
              <p style={{ color: 'white' }}><span className="highlight">{room.caption}</span></p>
            </Carousel.Caption>
          </Carousel.Item>
        ))}

      </Carousel>
      <NewRoomModal showAdd={showAdd} setShowAdd={setShowAdd}/>
      <EditRoomModal showEdit={showEdit} setShowEdit={setShowEdit} roomId={roomId} setRoomId={setRoomId} roomIndex={roomIndex} setRoomIndex={setRoomIndex}/> 
      <CategoriesModal showCategories={showCategories} setShowCategories={setShowCategories} categories={categories} setCategories={setCategories}/>
    </>
  );
}

export default Rooms;