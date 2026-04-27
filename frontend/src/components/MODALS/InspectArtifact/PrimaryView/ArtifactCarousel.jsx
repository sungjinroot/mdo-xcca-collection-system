import Carousel from 'react-bootstrap/Carousel';
import './PrimaryView.css'

function ArtifactCarousel(){

    return (
    <Carousel interval={null} indicators={false} className="artifact-carousel" fade> {/*No delete and edits in this room*/}
      <Carousel.Item>
        <img className="d-block w-100 pan-image-view" onClick={() => alert("edited room")} src="https://www.xu.edu.ph/images/2016/img/may/xu.jpg" alt="First slide" style={{ height: '100%', width: '100%', objectFit: 'cover'}}/>
        
        <button className="images-options-left images-options"> Remove Photo </button>
        <button className="images-options-right images-options"> Insert Photo </button>

        <Carousel.Caption onClick={() => alert("edited room")}>
                    
          <h1 style={{color: 'white'}}>
            <span className="highlight"> Front </span>
          </h1>
                    
        </Carousel.Caption>

      </Carousel.Item>

      <Carousel.Item>
        <img className="d-block w-100 pan-image-view" onClick={() => alert("edited room")} src="https://cdn.wallpapersafari.com/79/64/M5Fbuy.jpg" alt="First slide" style={{ height: '100%', width: '100%', objectFit: 'cover'}}/>

        <button className="images-options-left images-options"> Remove Photo </button>
        <button className="images-options-right images-options"> Insert Photo </button>

        <Carousel.Caption onClick={() => alert("edited room")}>
         
          
          <h1 style={{color: 'white'}}>
            <span className="highlight"> Top Left </span>
          </h1>
          
          
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        <img className="d-block w-100 pan-image-view" onClick={() => alert("edited room")} src="https://wallpapercave.com/wp/wp15079789.webp" alt="First slide" style={{ height: '100%', width: '100%', objectFit: 'cover'}}/>

        <button className="images-options-left images-options"> Remove Photo </button>
        <button className="images-options-right images-options"> Insert Photo </button>

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