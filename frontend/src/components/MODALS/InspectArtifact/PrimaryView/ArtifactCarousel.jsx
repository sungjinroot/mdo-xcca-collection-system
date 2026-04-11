import Carousel from 'react-bootstrap/Carousel';
import './PrimaryView.css'

function ArtifactCarousel(){

    return (
    <Carousel interval={null} indicators={false} className="artifact-carousel"> {/*No delete and edits in this room*/}
      <Carousel.Item>
        <img className="d-block w-100 pan-image" onClick={() => alert("edited room")} src="https://www.xu.edu.ph/images/2016/img/may/xu.jpg" alt="First slide" style={{ height: '300px', width: '100%', objectFit: 'cover'}}/>

        <Carousel.Caption onClick={() => alert("edited room")}>

          
                    
          <h3 style={{color: 'white'}}>
            <span className="highlight"> Front</span>
          </h3>
          
          
        </Carousel.Caption>

      </Carousel.Item>

      <Carousel.Item>
        <img className="d-block w-100 pan-image" onClick={() => alert("edited room")} src="https://cdn.wallpapersafari.com/79/64/M5Fbuy.jpg" alt="First slide" style={{ height: '300px', width: '100%', objectFit: 'cover'}}/>

        <Carousel.Caption onClick={() => alert("edited room")}>
         
          
          <h3 style={{color: 'white'}}>
            <span className="highlight"> Left </span>
          </h3>
          
          
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        <img className="d-block w-100 pan-image" onClick={() => alert("edited room")} src="https://wallpapercave.com/wp/wp15079789.webp" alt="First slide" style={{ height: '300px', width: '100%', objectFit: 'cover'}}/>

        <Carousel.Caption onClick={() => alert("edited room")}>
          
          <h3 style={{color: 'white'}}>
            <span className="highlight"> Back </span>
          </h3>
          
         
        </Carousel.Caption>
      </Carousel.Item>

    </Carousel>
    )
}

export default ArtifactCarousel;