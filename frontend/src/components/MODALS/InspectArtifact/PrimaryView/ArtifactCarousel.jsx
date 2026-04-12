import Carousel from 'react-bootstrap/Carousel';
import './PrimaryView.css'

function ArtifactCarousel(){

    return (
    <Carousel interval={30000} indicators={false} className="artifact-carousel"> {/*No delete and edits in this room*/}
      <Carousel.Item>
        <img className="d-block w-100 pan-image" onClick={() => alert("edited room")} src="https://www.xu.edu.ph/images/2016/img/may/xu.jpg" alt="First slide" style={{ height: '400px', width: '100%', objectFit: 'cover'}}/>

        <Carousel.Caption onClick={() => alert("edited room")}>

          
                    
          <h1 style={{color: 'white'}}>
            <span className="highlight"> Front </span>
          </h1>
          
          
        </Carousel.Caption>

      </Carousel.Item>

      <Carousel.Item>
        <img className="d-block w-100 pan-image" onClick={() => alert("edited room")} src="https://cdn.wallpapersafari.com/79/64/M5Fbuy.jpg" alt="First slide" style={{ height: '400px', width: '100%', objectFit: 'cover'}}/>

        <Carousel.Caption onClick={() => alert("edited room")}>
         
          
          <h1 style={{color: 'white'}}>
            <span className="highlight"> Top Left </span>
          </h1>
          
          
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        <img className="d-block w-100 pan-image" onClick={() => alert("edited room")} src="https://wallpapercave.com/wp/wp15079789.webp" alt="First slide" style={{ height: '400px', width: '100%', objectFit: 'cover'}}/>

        <Carousel.Caption onClick={() => alert("edited room")}>
          
          <h1 style={{color: 'white'}}>
            <span className="highlight"> Back </span>
          </h1>
          
         
        </Carousel.Caption>
      </Carousel.Item>

    </Carousel>
    )
}

export default ArtifactCarousel;