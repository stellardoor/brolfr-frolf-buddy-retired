/**
 * Description: This file contains the React components for the plant element.
 * 
 * Language: JavaScript (JSX)
 * Frameworks: React
 * Libraries: React Bootstrap
 * APIS: Home Assistant
 * Components: PlantModal, PlantButton, Plant
 */


// PlantModal component displays live sensor readings and plant library data in a modal
// PlantModal component displays live sensor readings and plant library data in a modal
const PlantModal = (props) => {
    const { plantBookData, sensorData, selectedPlantId, showModal, handleClose } = props;
    const displayName = selectedPlantId ? selectedPlantId.slice(0, -2) : '';
    const sensorNumber = selectedPlantId ? selectedPlantId.slice(-2) : '';
    const isMoistureOutOfRange = sensorData && plantBookData && (sensorData.moisture < plantBookData.min_soil_moist || sensorData.moisture > plantBookData.max_soil_moist);
    const isConductivityOutOfRange = sensorData && plantBookData && (sensorData.conductivity < plantBookData.min_soil_ec || sensorData.moisture > plantBookData.max_soil_ec);


    return (
        <div className={`modal fade ${showModal ? "show" : ""}`} tabIndex="-1" aria-hidden={!showModal} style={{ display: showModal ? "block" : "none" }}>
            <div class="modal-dialog modal-sm">
                <div className="modal-content">
                    <div className="modal-header">
                        <h2 className="modal-title">{displayName}</h2>
                        <button type="button" className="btn-close" onClick={handleClose}></button>
                    </div>
                    <div className="modal-body">
                        {sensorData && (
                            <div id="plant-sensor-data">
                                <h3>Live Sensor Readings</h3>
                                <ul>
                                    <li><strong>Sensor Id:</strong> {sensorNumber}</li>
                                    <li className={isMoistureOutOfRange ? "text-danger" : ""}>Moisture: {sensorData.moisture}%</li>
                                    <li>Temperature: {sensorData.temperature}°F</li>
                                    <li>Illuminance: {sensorData.illuminance}lux</li>
                                    <li className={isConductivityOutOfRange ? "text-danger" : ""}>Conductivity: {sensorData.conductivity}%</li>
                                    <li>Conductivity: {sensorData.conductivity}</li>
                                    <li>Battery: {sensorData.battery}%</li>
                                </ul>
                            </div>
                        )}
                        {plantBookData && (
                            <div id="plantbook-data">
                                <h3>Plant Library Data</h3>
                                <ul>
                                    <li>Alias: {plantBookData.alias}</li>
                                    <li>Category: {plantBookData.category}</li>
                                    <li>Max Light: {plantBookData.max_light_lux}lux</li>
                                    <li>Min Light: {plantBookData.min_light_lux}lux</li>
                                    <li>Max Temperature: {plantBookData.max_temp}°F</li>
                                    <li>Min Temperature: {plantBookData.min_temp}°F</li>
                                    <li>Max Env. Humidity: {plantBookData.max_env_humid}%</li>
                                    <li>Min Env. Humidity: {plantBookData.min_env_humid}%</li>
                                    <li>Max Soil Moisture: {plantBookData.max_soil_moist}%</li>
                                    <li>Min Soil Moisture: {plantBookData.min_soil_moist}%</li>
                                    <li>Max Soil EC: {plantBookData.max_soil_ec}</li>
                                    <li>Min Soil EC: {plantBookData.min_soil_ec}</li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};


// PlantButton component displays a button with a plant image
const PlantButton = (props) => {
    const { id, onClick } = props;
    const displayName = id.slice(0, -3);
    return (
        <div className="plant-container">
            <button className="plant-button" type="button" onClick={() => onClick(id)}>
                <img className="plant-image" key={`sensor-${id}`} id={`sensors=${id}-button`} src={`/static/images/project photos/${id}.png`} />
                <div className="plant-id">{displayName}</div>
            </button>
        </div>
    );
};




function Plant() {
    const [plantIds, setPlantIds] = React.useState([]);
    const [sensorData, setSensorData] = React.useState(null);
    const [plantBookData, setPlantBookData] = React.useState(null);
    const [showModal, setShowModal] = React.useState(false);
    const [selectedPlantId, setSelectedPlantId] = React.useState(null);

    // Fetch plant IDs from the server
    React.useEffect(() => {
        fetch('/plants.json')
            .then(response => response.json())
            .then(data => {
                setPlantIds(data);
            });
    }, []);

    // Fetch sensor readings and plant library data from the server
    const handleButtonClick = (plantID) => {
        fetch(`/plants/${plantID}.json`)
            .then((response) => response.json())
            .then((data) => {
                const sensor_readings = data.sensor_readings;
                const plant_data = data.plant_data;

                setSelectedPlantId(plantID);
                setShowModal(true);
                setSensorData(sensor_readings);
                setPlantBookData(plant_data);
            });
    };

    // Close the modal
    const handleClose = () => {
        setShowModal(false);
    };

    return (
        <div className="plant-container plant-grid">
            {plantIds.map((plantId) => (
                <PlantButton key={plantId} id={plantId} onClick={handleButtonClick} />
            ))}
            <PlantModal
                plantBookData={plantBookData}
                sensorData={sensorData}
                selectedPlantId={selectedPlantId}
                showModal={showModal}
                handleClose={handleClose}
            />
        </div>
    );
}


return (
    <div>
        <h1>{props.user.fname}</h1>
        <img className="profile" src={props.user.photo_link} ></img>
        <li> {props.user.gender}, {props.user.age} </li>
        <li> Located in {props.user.location}</li>
        <p> {props.user.intro_text}</p>
        <ul>
            <li>Joined {props.user.member_since}</li>
            <li>Looking to throw with: {props.user.gender_preference}</li>
            <li>Availability: {props.user.calendar}</li>
            <li>Skill Level: {props.user.skill_level}</li>
            <li>Frequented Courses: {props.user.frequented_courses}</li>
            <li>Kids: {props.user.kids_okay}</li>
            <li>Dogs: {props.user.dogs_okay}</li>
            <li>Friendly/Stakes: {props.user.friendly_or_stakes_game}</li>
            <li>Game preference: {props.user.type_of_game}</li>
            <li>Alcohol: {props.user.alcohol_okay}</li>
            <li>Tobacco: {props.user.tobacco_okay}</li>
            <li>420 Friendly: {props.user.smoke_420_okay}</li>
        </ul>

        <br></br>
        <button disabled={click} onClick={clickSendRequest} type="submit" > {SendBuddyRequest} </button>
    </div>
);
