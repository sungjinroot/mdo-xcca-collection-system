import './PrimaryView.css';
import ArtifactCarousel from './ArtifactCarousel.jsx';



function PrimaryView({ pictures, setPictures }) {

    /*ADD CATEGORIES SOON */
    

  return (
        <div className="primary-view-container">
            <ArtifactCarousel pictures={pictures} setPictures={setPictures}/>
        </div>
  );
}

export default PrimaryView;