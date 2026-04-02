import '../Layout.css';
import './ImagesPage.css';

function ImagesPage({prevStep, setShow}){
    

    function autoUpload(){
        const file = document.getElementById("imageUpload").files[0];
                
        alert(file.name);

    }

    return (
    
        <div className="stepper-container">
            <div className="stepper-content">
                <div className="stepper-left">
                    <div className="stepper-upload">
                        <label htmlFor="imageUpload" className="image-upload-label">
                            <div className="upload-box">
                                Click or Drag & Drop to Upload
                            </div>
                            <input type="file" id="imageUpload" accept="image/*" className="image-upload-input" multiple onChange={autoUpload}/>
                        </label>
                    </div>
                </div>










                <div className="stepper-right">
                    {/* content for right box */}
                    <button onClick={autoUpload}>
                        test
                    </button>
                </div>
            </div>

            <div className="stepper-navigation-multi">
                <div className="stepper-navigation-left" onClick={() => prevStep()}> Previous </div> 
                <div className="stepper-navigation-right" onClick={() => (alert("5"))}> Submit </div> 
            </div>
        </div>
    
    )
}


export default ImagesPage;