import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import './Rooms.css';

function Rooms(){



    return (
    <Carousel interval={null}> {/*No delete and edits in this room*/}
      <Carousel.Item>
        <img className="d-block w-100" src="https://www.xu.edu.ph/images/2016/img/may/xu.jpg" alt="First slide" style={{ height: '200px', width: '100%', objectFit: 'cover' }}/>
        <button className="button-utils-left utils" onClick={() => alert(5)}> Categories </button>
        <button className="button-utils-right utils" onClick={() => alert(5)}> New Room </button>

        <Carousel.Caption>
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
        <img className="d-block w-100" src="https://t4.ftcdn.net/jpg/01/28/98/53/360_F_128985367_mNdX0b56w6OcgiyUDnZwukpK1bkpfWwI.jpg" alt="First slide" style={{ height: '200px', width: '100%', objectFit: 'cover' }}/>
        <button className="button-utils-left utils" onClick={() => alert(5)}> Categories </button>
        <button className="button-utils-right utils" onClick={() => alert(5)}> New Room </button>

        <Carousel.Caption>
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
        <img className="d-block w-100" src="https://www.alphr.com/wp-content/uploads/2021/02/2021-03-02_13.42.14.png" alt="First slide" style={{ height: '200px', width: '100%', objectFit: 'cover' }}/>
        <button className="button-utils-left utils" onClick={() => alert(5)}> Categories </button>
        <button className="button-utils-right utils" onClick={() => alert(5)}> New Room </button>

        <Carousel.Caption>
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
    )
    
}

export default Rooms;