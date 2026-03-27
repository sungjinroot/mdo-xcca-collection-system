import './Pages.css';

function BasicInformation({ nextStep }){
    return (
        <div className="stepper-page">
            <div className="stepper-content">
                hurrah
            </div>

            <div className="stepper-movement">
                <div className="stepper-movement-options single">
                    <button className="single-button" onClick={() => nextStep()}> Next </button>
                </div>
            </div>
        </div>
    )
}

export default BasicInformation;