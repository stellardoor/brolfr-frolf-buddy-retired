// """loads edit profile page for user"""
function LoadCities() {

    //create outer function for componen
    // const [userInput, setUserInput] = React.useState("")
    const [cityName, setCityName] = React.useState([])

    // function typingCityName(){
    //     setUserInput(form.querySelector('#user-location'))
    //     React.useEffect(() => {
    //         fetch( `/load-cities?key={userInput}`)
    //         .then((response) => response.json()) 
    //         .then((responseCityName) => { 
    //             setCityName(responseCityName) 
    //     })
    //     })
    //     const cityNames = [];
    //     for (const city of cityName) {
    //         cityNames.push(<LoadRequest city={city} key={city.city} />);
    //     }
    // }
    // };
    function typingCityName() {
        React.useEffect(() => {
            fetch('/load-cities')
                .then((response) => response.json())
                .then((responseCityName) => {
                    setCityName(responseCityName)
                })
        })
    const cityNames = []
    for (const city of cityName) {
        cityNames.push(<LoadRequest city={city} key={city.city} />);
    }
    }

    return (
        <div>
            <label htmlFor="user-location" className="form-label"> Location: </label>
            <input onChange={typingCityName} className="form-control" list="datalistOptions" name="user-location" id="user-location" placeholder="Type to search your closest city..."></input>
            <datalist id="datalistOptions">
                {cityNames}
            </datalist>
        </div>
    );
};

function LoadRequest(props) {
    return (
        <option value={props.city}></option>
    )
}