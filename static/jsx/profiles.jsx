// """loading profiles to search potential buds"""
function App() {
    const [users, setUsers] = React.useState([]);
    // const [loadingCircle, setLoadingCircle] = React.useState(true)

    // if (loadingCircle) {
    //     document.querySelector("")
    // }

    React.useEffect(() => {
        fetch("/load-profiles")
            .then(response => response.json())
            .then(result => {
                console.log(result)
                setUsers(result);
            });
    }, []);
    const userProfiles = [];
    for (const user of users) {
        userProfiles.push(<LoadRequest user={user} key={user.user_id} />);
    }
    return (
    <div>
        <div id="cities"> 
            <LoadCities setUsers={setUsers} />
            <LoadCalendar setUsers={setUsers} />
        </div>
        <div>
            {userProfiles}
        </div>
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
}

function LoadCities(props) {

    const [initialState, setInitialState] = React.useState("")
    // const [initialCity, setInitialCity] = React.useState("")
    const [userState, setUserState] = React.useState("")
    // const [userCity, setUserCity] = React.useState("")
    const [cityNames, setCityNames] = React.useState([])
    const [stateNames, setStateNames] = React.useState([])

    React.useEffect(() => {
        fetch("/get-user-state", {
            method: 'POST'
        })
            .then(response => response.text())
            .then(stateResponse => {
                setInitialState(stateResponse)
            }
            );
    });

    // React.useEffect(() => {
    //     fetch("/get-user-city", {
    //         method: 'POST'
    //     })
    //         .then(response => response.text())
    //         .then(cityResponse => {
    //             setInitialCity(cityResponse)
    //         }
    //         );
    // });


    React.useEffect(() => {
        fetch("/get-states")
            .then(response => response.json())
            .then(stateList => {
                const states = []
                for (const state of stateList) {
                    states.push(<option value={state} key={state} >{state}</option>);
                }
                setStateNames(states)
            });
    }, []);



    const captureUserInput = (evt) => { //idk how capture ???
        evt.preventDefault()
        const userInput = evt.target.value
        setUserState(userInput)
        fetch("/load-cities", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ "user-state": userInput}),
            credentials: "same-origin"
        })
            .then((response) => response.json())
            .then((responseCities) => {
                const cityList = []
                let i = 0
                for (const city of responseCities) {
                    cityList.push(<option value={city} key={i} >{city}</option>);
                    i += 1
                }
                setCityNames(cityList)
                
            })
            document.querySelector("#user-location").defaultValue=""
    };


    const processProfilesByState = (evt) => { //idk how capture ???
        evt.preventDefault()
        console.log(userState)

        fetch("/load-users-by-state", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ "user-state": userState}),
            credentials: "same-origin"
        })
            .then((response) => response.json())
            .then((responseSubmit => {
                console.log(responseSubmit)
                props.setUsers(responseSubmit)

    }));
}


    const processProfilesByCity = (evt) => { 
        evt.preventDefault()
        console.log(document.querySelector("#user-location").value)
        const formInputs = { 
            "user-state": document.querySelector("#user-state").value, 
            "user-location" : document.querySelector("#user-location").value
        }

        fetch("/load-users-by-city", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formInputs),
            credentials: "same-origin"
        })
            .then((response) => response.json())
            .then((responseSubmit => {
                if (responseSubmit.includes("Error")) {
                    alert("ERROR: Please choose a valid city from the dropdown list after selecting a state")
                }
                else {
                    console.log(responseSubmit)
                    props.setUsers(responseSubmit);
            }
            }));

    };

    return (
        <div>
            <select onChange={(evt) => captureUserInput(evt)} name="user-state" id="user-state">
                <option selecteddisabledhidden="true" >{initialState}</option>
                {stateNames}
            </select><br></br>
            <button type="submit"  onClick={(evt) => processProfilesByState(evt)}>Search folks by State</button><br></br>


            <label htmlFor="datalist" className="form-label">City: </label>
            <input  className="form-control" list="datalistOptions" name="user-location" id="user-location"  placeholder="Type to search your closest city..." ></input>
            <datalist id="datalistOptions">
                {cityNames}
            </datalist>
            <button htmlFor= "user-location" name="user-location"  type="submit" onClick={(evt) => processProfilesByCity(evt)} >Search folks by City</button>
        </div>
    )

    }

    // --------------- test user calendar filter----------
function LoadCalendar(props) {

    const processProfilesByCalendar = (evt) => { 
        evt.preventDefault()
        const calendarInfo = document.querySelectorAll(".calendar")
        console.log(calendarInfo)
        const calendarList = [];
        for (const input of calendarInfo) {
            if (input.checked) {
                calendarList.push(input.value); 
            }        
        }
        console.log(calendarList)
        const formInputs = { 
            "user-state": document.querySelector("#user-state").value, 
            "user-location" : document.querySelector("#user-location").value, 
            "calendar": calendarList
        }


        fetch("/load-users-by-calendar-match", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formInputs),
            credentials: "same-origin"
        })
            .then((response) => response.json())
            .then((responseSubmit => {
                console.log(responseSubmit)
                props.setUsers(responseSubmit);
            }));

    };
    return(
        <div>
            <div id="calendar">
            <input type="checkbox" name="calendar" className ="calendar" id="early-mornings" value="Early Mornings (Sunrise - 8am)" ></input>
            <label htmlFor="early-mornings"> Early Mornings (Sunrise - 8am) </label><br></br>
            <input type="checkbox" name="calendar" className ="calendar" id="mornings" value="Mornings (8am - 11am)" ></input>
            <label htmlFor="mornings"> Mornings (8am - 11am) </label><br></br>
            <input type="checkbox" name="calendar" className ="calendar" id="afternoons" value="Afternoons (11am - 2pm)"></input>
            <label htmlFor="afternoons"> Afternoons (11am - 2pm) </label><br></br>
            <input type="checkbox" name="calendar" className ="calendar" id="late-afternoon" value="Late Afternoons (2pm - 5pm)"></input>
            <label htmlFor="late-afternoons"> Late Afternoons (2pm - 5pm) </label><br></br>
            <input type="checkbox" name="calendar" className ="calendar" id="evenings" value ="Evenings (5pm - Sunset)" ></input>
            <label htmlFor="evenings"> Evenings (5pm - Sunset) </label><br></br>
            <button htmlFor= "calendar" name="calendar"  type="submit" onClick={(evt) => processProfilesByCalendar(evt)} >Filter by Calendar</button>
            </div>
        </div>
        )
        }


//         <div className="card" style="width:400px">
{/* <img className="card-img-top" src={props.user.photo_link}>
<div className="card-body">
    <h4 className="card-title">{props.user.fname}</h4>
    <p className="card-text">{props.user.gender}, {props.user.age} <br></br>
    Located in {props.user.location}<br></br> {props.user.intro_text}</p>
    <a href="#" className="btn btn-primary">See Profile</a>
</div>
</div> */}