// """loading profiles to search potential buds"""
function App() {
    const [users, setUsers] = React.useState([]);

    React.useEffect(() => {
        fetch("/load-profiles")
            .then(response => response.json())
            .then(result => {
                setUsers(result);
            });
    }, []);
    const userProfiles = [];
    for (const user of users) {
        userProfiles.push(<LoadRequest user={user} key={user.user_id} />);
    }
    return (
        <div>
            {userProfiles}
        </div>
    );
}

function LoadRequest(props) {

    const [click, setClick] = React.useState(false);
    const [SendBuddyRequest, setSendBuddyRequest] = React.useState("Send Buddy Request!");

    function clickSendRequest() {
        fetch("/send-buddy-request", {
            method: 'POST',
            body: JSON.stringify({ "user-request-id": props.user.user_id }),
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "same-origin" //sends the cookies with it
        })
            .then(response => response.text())
            .then(result => {
                setSendBuddyRequest(result)
                setClick(true)
            });
    }

    return (
        <div>
            <h1>{props.user.fname}</h1>
            <img className="profile" src={props.user.photo_link} ></img>
            <li> {props.user.gender}, {props.user.birthday} </li>
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
}

// function LoadUsaCities() {
//     const [cities, setCities] = React.useState([]);

//     React.useEffect(() => {
//         fetch("/load-profiles")
//             .then(response => response.json())
//             .then(result => {
//                 cityList = result
//                 const usaCities = [];
//                 for (const city of usaCities) {
//                     usaCities.push(<LoadCities city={city} />);
//                 };  
//                 setCities(usaCities)
//             });
//     }, []);
// }



function CitySearch() {
    const [cities, setCities] = React.useState([]);

    React.useEffect(() => {
        fetch("/load-cities")
            .then(response => response.json())
            .then(result => {
                setCities(result)
            });
    }, []);

    const usaCities = [];
    for (const city of cities) {
        usaCities.push(<LoadCities city={city} />);
    };
    return (
        <div>
            <label className="form-label">Location: </label>
            <input className="form-control" list="datalistOptions" name="user-location" id="user-location" placeholder="Type to search your closest city..." ></input>
            <datalist>
                {usaCities}
            </datalist>
            <input type="submit" value="Search"></input>
        </div>
    );
}

function LoadCities(props) {
    return (
        <option value={props.city}></option>
    );
}




// <label for="user-location" class="form-label">Location: </label>
// <input class="form-control" list="datalistOptions" name = "user-location" id="user-location" placeholder="Type to search your closest city...">
// <datalist id="datalistOptions">
//     {% for city in city_list %} 
//     <option value="{{city}}">
//     {% endfor %}
// </datalist>
// <input type="submit" value = "Search">
// )