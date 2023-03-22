function LoadCities() {

    //create outer function for componen
    // const [userInput, setUserInput] = React.useState("")
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
        // evt.preventDefault()
        // setUserInput(evt.target.value) asyncro

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
                    cityList.push(<option value={city} key={city} >{city}</option>);
                }
                setCityNames(cityList)
            })
            
    
    };
// on
    return (
        <div>
            <form>
                <select onChange={(evt)=>captureUserInput(evt)} name="user-state" id="user-state">
                    {stateNames} 
                </select><br></br>
            </form>
            <form>
                <label htmlFor="user-location" className="form-label">City: </label>
                <input className="form-control" list="datalistOptions" name="user-location" id="user-location" placeholder="Type to search your closest city..."></input>
                <datalist id="datalistOptions">
                    {cityNames}
                </datalist>
            </form>
        </div>
    )
};

// function LoadCityOrStates(props) {
//     return (
//         <option value={props.name}>{props.name}</option>
//     )
// };

