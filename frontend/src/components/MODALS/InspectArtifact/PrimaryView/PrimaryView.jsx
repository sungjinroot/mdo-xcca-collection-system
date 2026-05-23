import './PrimaryView.css';
import ArtifactCarousel from './ArtifactCarousel.jsx';



function PrimaryView({ pictures, setPictures, currentArtifactData, setShow }) {

    /*ADD CATEGORIES SOON */
    

  return (
        <div className="primary-view-container">
            <ArtifactCarousel pictures={pictures} setPictures={setPictures} currentArtifactData={currentArtifactData} setShow={setShow}/>
        </div>
  );
}

export default PrimaryView;