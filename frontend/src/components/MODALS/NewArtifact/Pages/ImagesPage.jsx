import './Pages.css';

function ImagesPage({prevStep, setShow}){
    return (
        <div className="stepper-page">
            <div className="stepper-content">
                
                <div className="basic-info-form-container">

                    <h2> Basic Information </h2>

                    <div className="basic-fields">
                        <input placeholder="English name of the artifact"/>

                        <input placeholder="Vernacular name of the artifact"/>
                    </div>
                    
                </div>

                <div className="basic-info-categories">
                    Categories
                </div>
            </div>

            <div className="stepper-movement">
                <div className="stepper-movement-options single">
                    <button className="single-button" onClick={() => prevStep()}> Previous </button>
                    <button className="single-button" onClick={() => setShow(false)}> Submit </button>
                </div>
            </div>
        </div>
    )
}


export default ImagesPage;