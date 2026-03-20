import './Artifact.css';


function Artifact(){

    return (
        <div className="card-container">
            <div className="card-img">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5_-G-aUrLzcrqXAlgkn6nNpNwK3-rs5pT1Q&s"/>
            </div>

            <div className="card-info">
                <div className="basic-info">
                    <p> English Name </p>
                    <p> Vernacular name </p>
                    <p> Year </p>
                </div>

                <div className="basic-functions">
                    <p> tset </p>
                </div>
            </div>
        </div>
    );
}

export default Artifact;