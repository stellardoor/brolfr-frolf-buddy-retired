// """functions for accepting and rejecting buddy requests"""
function App() {
    const [users, setUsers] = React.useState([])

    React.useEffect(() => {
        fetch("/get-requests")
            .then(response => response.json())
            .then(result => {
                setUsers(result);
                // console.log(result)
            });
    }, []);
    const userRequests = [];
    for (const user of users) {
        userRequests.push(<LoadRequest  user ={user} key={user.user_id} />);
    }
    return (
        <div>
            {userRequests}
        </div>
    );
}

function LoadRequest(props) {

    const [click, setClick] = React.useState(false);
    const [BuddyAccept, setBuddyAccept] = React.useState("Accept Buddy Request!");
    const [BuddyDeny, setBuddyDeny] = React.useState("Deny!")


    function clickAccept() {
        const data = {"buddy-accept-id": props.user.user_id}
        // console.log(data)
        fetch("/accept-buddy", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "same-origin" //sends the cookies with it
        })
            .then(response => response.text())
            .then(result => {
                setBuddyAccept(result)
                setBuddyDeny("🤩🤩🤩")
                setClick(true)
            });
    }
    function clickDeny() {
        fetch("/deny-buddy", {
            method: 'POST',
            body: JSON.stringify({"buddy-deny-id": props.user.user_id}),
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "same-origin" //sends the cookies with it
        })
            .then(response => response.text())
            .then(result => {
                setBuddyDeny(result)
                setBuddyAccept("😭😭😭")
                setClick(true)
            });
    }

    return (
        <div>
            <h1>{props.user.fname}</h1>
            <img className="profile" src= {props.user.photo_link} ></img>
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

            <button className="app" disabled={click} type="submit" onClick={clickAccept}> {BuddyAccept} </button>

            <br></br>
            <button className="app" disabled={click} onClick={clickDeny} type="submit" > {BuddyDeny} </button>
        </div>
    );
}