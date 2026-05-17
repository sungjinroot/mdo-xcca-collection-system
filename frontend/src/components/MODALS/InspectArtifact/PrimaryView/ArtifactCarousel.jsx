import Carousel from 'react-bootstrap/Carousel';
import './PrimaryView.css'

function ArtifactCarousel({ pictures, setPictures }) {
  return (
    <Carousel interval={null} indicators={false} className="artifact-carousel">
      {pictures.map((picture) => (
        <Carousel.Item key={picture.pictureid}>
          <img className="d-block w-100 pan-image-view" src={picture.picturefilepath} alt={picture.anglename} style={{ height: '100%', width: '100%', objectFit: 'contain' }}/>
          <button className="images-options-left images-options"> Remove Photo </button>
          <button className="images-options-right images-options"> Insert Photo </button>
          <Carousel.Caption>
            <h1 style={{ color: 'white' }}>
              <span className="highlight"> {picture.anglename} </span>
            </h1>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  )
}

export default ArtifactCarousel;