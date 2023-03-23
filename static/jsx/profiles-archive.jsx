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

function LoadCities() {

    const [userState, setUserState] = React.useState("")
    const [userCity, setUserCity] = React.useState("")

    React.useEffect(() => {
        fetch("/get-user-state", {
        method: 'POST'
    })
        .then(response => response.text())
        .then(stateResponse=> {
            setUserState(stateResponse)
            }  
        );
        });
    React.useEffect(() => {
        fetch("/get-user-city", {
        method: 'POST'
    })
        .then(response => response.text())
        .then(cityResponse=> {
            setUserCity(cityResponse)
            }  
        );
        });

    const [cityNames, setCityNames] = React.useState([])
    const [stateNames, setStateNames] = React.useState([])

    React.useEffect(() => {
        fetch("/get-states")
            .then(response => response.json())
            .then(stateList=> {
                const states = []
                for (const state of stateList) {
                    states.push(<option value={state} key={state} >{state}</option>);
                }
                setStateNames(states)
            });
    }, []);


    const captureUserInput = (evt) => { //idk how capture ???

        fetch("/load-cities", {
            method: 'POST', 
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ "user-state": evt.target.value}),
            credentials: "same-origin"
        })
            .then((response) => response.json())
            .then((responseCities) => {
                const cityList = []
                for (const city of responseCities) {
                    cityList.push(<option  value={city} key={city} >{city}</option>);
                }
                setCityNames(cityList)
                document.querySelector("#user-location").defaultValue=""
            })
            
    
    };

    const processNewProfiles = (evt) => { //idk how capture ???
        evt.preventDefault()

        const formInputs = { 
            "user-state": document.querySelector("#user-state").value, 
            "user-location" : document.querySelector("#user-location").value
        }
        
        fetch("/process-city-state", {
            method: 'POST', 
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formInputs),
            credentials: "same-origin"
        })
            .then((response) => response.text())
            .then((responseSubmit => {
                responseSubmit
            }))    
    };

    return (
        <div>
            <form>
                <select onChange={(evt)=>captureUserInput(evt)} name="user-state" id="user-state">
                    <option defaultValue={userState} >{userState} </option>
                    {stateNames} 
                </select><br></br>
            </form>
            <form>
                <label htmlFor="user-location" className="form-label">City: </label>
                <input className="form-control" list="datalistOptions" name="user-location" id="user-location" defaultValue = {userCity} placeholder="Type to search your closest city..."></input>
                <datalist id="datalistOptions">
                    {cityNames}
                </datalist>
                <input type ="submit" onClick={(evt)=> processNewProfiles(evt)} ></input>
            </form>
        </div>
    )

};


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

function LoadCities() {

    const [userState, setUserState] = React.useState("")
    const [userCity, setUserCity] = React.useState("")

    React.useEffect(() => {
        fetch("/get-user-state", {
        method: 'POST'
    })
        .then(response => response.text())
        .then(stateResponse=> {
            setUserState(stateResponse)
            }  
        );
        });
    React.useEffect(() => {
        fetch("/get-user-city", {
        method: 'POST'
    })
        .then(response => response.text())
        .then(cityResponse=> {
            setUserCity(cityResponse)
            }  
        );
        });

    const [cityNames, setCityNames] = React.useState([])
    const [stateNames, setStateNames] = React.useState([])

    React.useEffect(() => {
        fetch("/get-states")
            .then(response => response.json())
            .then(stateList=> {
                const states = []
                for (const state of stateList) {
                    states.push(<option value={state} key={state} >{state}</option>);
                }
                setStateNames(states)
            });
    }, []);


    const captureUserInput = (evt) => { //idk how capture ???

        fetch("/load-cities", {
            method: 'POST', 
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ "user-state": evt.target.value}),
            credentials: "same-origin"
        })
            .then((response) => response.json())
            .then((responseCities) => {
                const cityList = []
                for (const city of responseCities) {
                    cityList.push(<option  value={city} key={city} >{city}</option>);
                }
                setCityNames(cityList)
                document.querySelector("#user-location").defaultValue=""
            })
            
    
    };

    const processProfilesByState = (evt) => { //idk how capture ???
        evt.preventDefault()
        
        fetch("/load-users-by-state", {
            method: 'POST', 
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({"user-state": document.querySelector("#user-state").value}),
            credentials: "same-origin"
        })
            .then((response) => response.text())
            .then((responseSubmit => {
                setUsers(responseSubmit);
            }));
        const userProfiles = [];
        for (const user of users) {
            userProfiles.push(<LoadRequest user={user} key={user.user_id} />);
        }
        return (
            <div>
                {userProfiles}
            </div>
        );
            
    };

    const processProfilesByCity = (evt) => { //idk how capture ???
        evt.preventDefault()

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
                setUsers(responseSubmit);
            }));
        const userProfiles = [];
        for (const user of users) {
            userProfiles.push(<LoadRequest user={user} key={user.user_id} />);
        }
        return (
            <div>
                {userProfiles}
            </div>
        );
            
    };

    return (
        <div>
            <form>
                <select onChange={(evt)=>captureUserInput(evt)} name="user-state" id="user-state">
                    <option defaultValue={userState} >{userState} </option>
                    {stateNames} 
                </select><br></br>
                <input type="submit" value="Search folks by State" onClick = {(evt)=>processProfilesByState(evt)}></input>
            </form>
            <form>
                <label htmlFor="user-location" className="form-label">City: </label>
                <input className="form-control" list="datalistOptions" name="user-location" id="user-location" defaultValue = {userCity} placeholder="Type to search your closest city..."></input>
                <datalist id="datalistOptions">
                    {cityNames}
                </datalist>
                <input type ="submit" onClick={(evt)=> processProfilesByCity(evt)} >Search by City</input>
            </form>
        </div>
    )

};