function LoadCities() {

    //create outer function for componen
    const [userInput, setUserInput] = React.useState("")
    const [cityNames, setCityNames] = React.useState([])

    function captureUserInput() {
        setUserInput(document.querySelector('#user-location'))

        React.useEffect(() => {
            // fetch(`/load-cities?key={userInput}`)
            fetch("/load-cities")
                .then(response => response.json())
                .then(resultList => {
                    const cityList = []
                    for (city in resultList) {
                        if (userInput in lowercase(city)) {
                            cityList.push(<LoadCityNames city={city} key={city.city} />);
                        }
                    setCityNames(cityList)
                    }
                });
        });

    }


    return (
    <div>
        <form>
            <label htmlFor="user-location" className="form-label">Location: </label>
            <input onChange={captureUserInput} className="form-control" list="datalistOptions" name="user-location" id="user-location" placeholder="Type to search your closest city..."></input>
            <datalist id="datalistOptions">
                {cityNames}
            </datalist>
        </form>
    </div>
    )
}

function LoadCityNames(props) {
    return (
        <option value={props.city}>{props.city}</option>    
    )
}