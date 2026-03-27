import './Pages.css'

function PhysicalDescription({ prevStep, nextStep }){
    return (
        <div className="stepper-page">
            <div className="stepper-content">
                test
            </div>

            <div className="stepper-movement">
                <div className="stepper-movement-options single">
                    <button className="single-button" onClick={() => prevStep()}> Previous </button>
                    <button className="single-button" onClick={() => nextStep()}> Next </button>
                </div>
            </div>
        </div>
    )
}

export default PhysicalDescription;