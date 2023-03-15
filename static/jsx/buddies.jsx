// """functions for accepting and rejecting buddy requests"""
function App() {
    const [users, setUsers] = React.useState([]);

    React.useEffect(() => {
        fetch("/get-buddies")
            .then(response => response.json())
            .then(result => {
                setUsers(result);
                console.log(result)
            });
    }, []);
    const userBuddies = [];
    for (const user of users) {
        // userRequests.push(<loadRequests item = {user} key={user.user_id}/>);
        userBuddies.push(<LoadRequest user={user} key={user.user_id} />);
    }
    return (
        <div>
            {userBuddies}
        </div>
    );
}

function LoadRequest(props) {

    const [click, setClick] = React.useState(false);
    // const [ClickChat, setClickChat] = React.useState("");
    const [BuddyDeny, setBuddyDeny] = React.useState("jk I hate this dude, deny buddy!");

//     React.useEffect(() => {
//         fetch("/chat", {
//             method: 'POST',
//             body: JSON.stringify({"chat-buddy-id": props.user.user_id}),
//             redirect: 'follow',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             credentials: "same-origin" //sends the cookies with it
//         })
//             .then(response => response.text())
//             .then(result => {
//                 setClickChat(result);
//     });
// })

    function clickDeny() {
        fetch("/deny-buddy", {
            method: 'POST',
            body: JSON.stringify({ "buddy-deny-id": props.user.user_id }),
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "same-origin" //sends the cookies with it
        })
            .then(response => response.text())
            .then(result => {
                setBuddyDeny(result)
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

            <a href={props.user.chat_link} type="button" > Chat with {props.user.fname}! </a>

            <br></br>
            <button disabled={click} onClick={clickDeny} type="submit" > {BuddyDeny} </button>
        </div>
    );
}