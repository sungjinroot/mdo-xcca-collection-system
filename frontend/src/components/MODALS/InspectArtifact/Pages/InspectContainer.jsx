import './InspectContainer.css';

function InspectContainer(props){

    return (
        <div className="tab-content-container">
            {props.children}
        </div>
    )
}

export default InspectContainer;