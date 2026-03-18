import React from 'react';
import Carousel from 'react-bootstrap/Carousel';


function Rooms(){



    return (
    <Carousel> {/*No delete and edits in this room*/}
      <Carousel.Item>
        <img className="d-block w-100" src="https://www.xu.edu.ph/images/2016/img/may/xu.jpg" alt="First slide" style={{ height: '200px', width: '100%', objectFit: 'cover' }}/>
        <Carousel.Caption>
          <h2 style={{color: '#b99430'}}> The Collection in it's entirety </h2>
          <h3 style={{color: '#b99430'}}>Museo De Oro</h3>
          <p style={{color: '#b99430'}}>Museo de Oro, dubbed as the first folkloric museum in the country, is not an abode of dead things. It is, by all means, bursting with life, clad with vivid imagination and rich history.</p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
    )
    
}

export default Rooms;