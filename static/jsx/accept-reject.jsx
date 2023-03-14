// """functions for accepting and rejecting buddy requests"""
function App() {

    const [users, setUsers] = React.useState([])

    React.useEffect(() => {
        fetch('/get-requests')
        .then(response => response.json())
        .then(result => {
            setUsers(result);
        });
    }, []);
    const userRequests = [];
    for(const user of users) {
        // userRequests.push(<loadRequests item = {user} key={user.user_id}/>);
        userRequests.push(<loadRequests user={user}/>);
    }
    return (<div>
        {userRequests}
        </div>
    );
}

function loadRequests(props) {
    // const [showMore, setShowMore] = React.useState(false);
    // function buttonClick(event) {
    //     setShowMore(showMore);
    // }
    // let buttonText = 'See more';
    // if (showMore) {
    //     buttonText = 'See less';
    // }
        return (
            <div>
                    <h1>{props.user.fname}</h1>
                    <img class = "profile" src="{props.user.photo_link}" ></img>
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

                    <form action="/accept-buddy" method="POST" class="accept-buddy" >
                    <input type="hidden" name="buddy-accept-id" value="{props.user.user_id}"></input> 
                    <button id="buddy-accept-{props.user.user_id}" type="submit" > Accept Buddy Request! </button>
                </form>
                <br></br>
                <form>
                    <input type="hidden" name="buddy-deny-id" value="{props.user.user_id}"></input> 
                    <button id="buddy-deny-{props.user.user_id}" type="submit" > Deny! </button>
                </form>
            </div>
        );
    }


// function clickAccept(props) {
//     const [click, setClick] = React.useState(false);

//     function buttonClicked() {
//         setClick(true);
//     }

//     return (
//         <button onClick={buttonClicked} disabled = "true">
//             Sent request to {user.fname}!
//         </button>
//     )
// }

// function clickDeny(props) {
//     const [click, setClick] = React.useState(false);

//     function buttonClicked() {
//         setClick(true);
//     }

//     return (
//         <button onClick={buttonClicked} disabled = "true">
//             Denied {user.fname}!
//         </button>
//     )
// }