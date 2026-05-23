import './PrimaryView.css';
import ArtifactCarousel from './ArtifactCarousel.jsx';

function PrimaryView({ pictures, setPictures, currentArtifactData, setShow, refreshThumbnails }) {
  return (
    <div className="primary-view-container">
      <ArtifactCarousel pictures={pictures} setPictures={setPictures} currentArtifactData={currentArtifactData} setShow={setShow} refreshThumbnails={refreshThumbnails}/>
    </div>
  );
}

export default PrimaryView;