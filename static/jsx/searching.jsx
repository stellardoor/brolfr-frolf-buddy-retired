function LoadCities() {

    //create outer function for componen
    const [userInput, setUserInput] = React.useState("")
    const [cityNames, setCityNames] = React.useState([])
    const [getStates, setGetStates] = React.useState([])

    React.useEffect(() => {
        fetch("/get-states")
            .then(response => response.json())
            .then(result => {
                setGetStates(result);
            });
    }, []);
    const stateNames = []
    for (const state of getStates) {
        stateNames.push(<LoadCityOrStates name={state} key={state} />);
    }

    const captureUserInput = (evt) => { //idk how capture ???
        evt.preventDefault()
        setUserInput(document.querySelector("user-state").value)

        const loadCityNames = () => {
            fetch("/load-cities"), {
                method: 'POST',
                body: JSON.stringify({ "user-state": userInput }),
                credentials: "same-origin"
            }
                .then((response) => response.json())
                .then((responseCities) => {
                    for (const city of responseCities) {
                        cityNames.push(<LoadCityOrStates name={city} key={city} />);
                    }
                })
            setGetStates(cityNames)
        };
        loadCityNames()
    };

    return (
        <div>
            <form>
                <select onChange={captureUserInput} name="user-state" id="user-state">
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

function LoadCityOrStates(props) {
    return (
        <option value={props.name}>{props.name}</option>
    )
};

