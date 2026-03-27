import './Pages.css';

function ImagesPage({prevStep, setShow}){
    return (
        <div className="stepper-page">
            <div className="stepper-content">
                test
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