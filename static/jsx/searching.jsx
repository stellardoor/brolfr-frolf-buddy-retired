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

    const processUserLocation = (evt) => { //idk how capture ???
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
                alert(responseSubmit)
            }))    
    //     }
    //     else {
    //         alert("please only use city selected from dropdown")    
    //     }
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
                <input type ="submit" onClick={(evt)=> processUserLocation(evt)} ></input>
            </form>
        </div>
    )

};

