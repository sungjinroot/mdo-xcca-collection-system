import '../Layout.css';
import './ImagesPage.css';

function ImagesPage({prevStep, setShow}){
    return (
    
        <div className="stepper-container">
            <div className="stepper-content">
                <div className="stepper-left">
                    <div className="stepper-upload">
                        <label htmlFor="imageUpload" className="image-upload-label">
                            <div className="upload-box">
                                Click or Drag & Drop to Upload
                            </div>
                        
                            <input type="file" id="imageUpload" accept="image/*" className="image-upload-input"/>
                        </label>
                    </div>
                </div>










                <div className="stepper-right">
                    {/* content for right box */}
                    Right Box
                </div>
            </div>

            <div className="stepper-navigation-multi">
                <div className="stepper-navigation-left" onClick={() => prevStep()}> Previous </div> 
                <div className="stepper-navigation-right" onClick={() => nextStep()}> Submit </div> 
            </div>
        </div>
    
    )
}


export default ImagesPage;