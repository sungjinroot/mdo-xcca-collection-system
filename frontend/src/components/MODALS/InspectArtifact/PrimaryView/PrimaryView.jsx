import './PrimaryView.css';
import ArtifactCarousel from './ArtifactCarousel.jsx';



function PrimaryView() {

    /*ADD CATEGORIES SOON */
    

  return (
        <div className="primary-view-container">
            <ArtifactCarousel/>

            <div className="primary-view-identifier"> 
                <div className="primary-view-identifier-fields">
                    <label> Accession Number </label>
                    <input type="text"/>
                </div>

                <div className="primary-view-identifier-fields">
                    <label> Catalogue Number </label>
                    <select>
                        <option> No Catalogue </option>
                    </select>
                </div>
            </div>

            <div className="primary-view-identifier"> 
                <div className="primary-view-identifier-fields">
                    <label> English Name </label>
                    <input type="text"/>
                </div>

                <div className="primary-view-identifier-fields">
                    <label> Vernacular Name </label>
                    
                    <input type="text"/>
                
                </div>
            </div>

            <div className="primary-view-identifier"> 
                <div className="primary-view-identifier-fields">
                    <label> Storage Location </label>
                    <input type="text"/>
                </div>

                <div className="primary-view-identifier-fields">
                    <label> Room </label>
                    <select>
                        <option> Room 1 </option>
                    </select>
                </div>
            </div>

        </div>
  );
}

export default PrimaryView;