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
        <img className="d-block w-100" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbyajt37u5oufDCuI7akC5fFIVbch6tql-pg&s" alt="First slide" style={{ height: '200px', width: '100%', objectFit: 'cover' }}/>
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
        <img className="d-block w-100" src="https://www.xu.edu.ph/images/2016/img/may/Museo1.jpg" alt="First slide" style={{ height: '200px', width: '100%', objectFit: 'cover' }}/>
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

    </Carousel>
    )
    
}

export default Rooms;