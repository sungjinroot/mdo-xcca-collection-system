import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import { useState } from 'react';
import './Rooms.css';

import NewRoomModal from '../MODALS/RoomModal/NewRoom/NewRoomModal.jsx';
import EditRoomModal from '../MODALS/RoomModal/EditRoom/EditRoomModal.jsx';

import CategoriesModal from '../MODALS/Categories/CategoriesModal.jsx';

function Rooms(){

    const [showAdd,setShowAdd] = useState(false);
    const [showEdit,setShowEdit] = useState(false);

    const [showCategories,setShowCategories] = useState(false);


    return (
    <>
      <Carousel interval={null} indicators={false} style={{'zoom': '80%'}}> {/*No delete and edits in this room*/}
        <Carousel.Item>
          <img className="d-block w-100 pan-image" onClick={() => setShowEdit(true)} src="https://host.javanielsen.dk/wp-content/uploads/2016/10/x5.jpg" alt="First slide" style={{ height: '200px', width: '100%', objectFit: 'cover' }}/>
          <button className="button-utils-left utils" onClick={() => setShowCategories(true)}> Categories </button>
          <button className="button-utils-right utils" onClick={() => setShowAdd(true)}> New Room </button>

          <Carousel.Caption onClick={() => setShowEdit(true)}>

            <h2 style={{color: 'white'}}>
              <span className="highlight"> The Collection in it's entirety </span> 
            </h2>
                    
            <h3 style={{color: 'white'}}>
              <span className="highlight"> Museo De Oro </span>
            </h3>
          
            <p style={{color: 'white'}}>
              <span className="highlight"> Museo de Oro, dubbed as the first folkloric museum in the country, is not an abode of dead things. It is, by all means, bursting with life, clad with vivid imagination and rich history. </span>
            </p>
          </Carousel.Caption>

        </Carousel.Item>

        <Carousel.Item>
          <img className="d-block w-100 pan-image" onClick={() => alert("edited room")} src="https://getwallpapers.com/wallpaper/full/d/d/6/295104.jpg" alt="First slide" style={{ height: '200px', width: '100%', objectFit: 'cover',}}/>
          <button className="button-utils-left utils" onClick={() => alert(5)}> Categories </button>
          <button className="button-utils-right utils" onClick={() => setShowAdd(true)}> New Room </button>

          <Carousel.Caption onClick={() => alert("edited room")}>
            <h2 style={{color: 'white'}}>
              <span className="highlight"> The Vastness of Space </span> 
            </h2>
          
            <h3 style={{color: 'white'}}>
              <span className="highlight"> Outer Space </span>
            </h3>
          
            <p style={{color: 'white'}}>
              <span className="highlight"> Outer space is an infinite canvas of velvet black, sprinkled with silver fire, where stars whisper ancient secrets and galaxies drift like dreams across the cosmos. </span>
            </p>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item>
          <img className="d-block w-100 pan-image" onClick={() => alert("edited room")} src="https://wallpapercave.com/wp/wp10486449.jpg" alt="First slide" style={{ height: '200px', width: '100%', objectFit: 'cover', }}/>
          <button className="button-utils-left utils" onClick={() => alert(5)}> Categories </button>
          <button className="button-utils-right utils" onClick={() => setShowAdd(true)}> New Room </button>

          <Carousel.Caption onClick={() => alert("edited room")}>
            <h2 style={{color: 'white'}}>
              <span className="highlight"> The World Of Cyberspace </span> 
            </h2>
          
            <h3 style={{color: 'white'}}>
              <span className="highlight"> Minecraft </span>
            </h3>
          
            <p style={{color: 'white'}}>
              <span className="highlight"> The boundless world of blocks where imagination is your only limit, and every sunrise over a pixelated landscape feels like the start of a new adventure. </span>
            </p>
          </Carousel.Caption>
        </Carousel.Item>

      </Carousel>

      <NewRoomModal showAdd={showAdd} setShowAdd={setShowAdd}/>

      <EditRoomModal showEdit={showEdit} setShowEdit={setShowEdit}/>
      
      <CategoriesModal showCategories={showCategories} setShowCategories={setShowCategories}/>

    
    </>

    )
    
}

export default Rooms;