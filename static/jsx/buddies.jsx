// """loading buddies"""
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
        userBuddies.push(<LoadRequest user={user} key={user.user_id} />);
    }
    return (
        <div>
            <div className="container">
                <div className="row justify-content-center p-3">
                    {userBuddies}
                </div>
            </div>

            <br></br>
            <button>
                <a className="button-link" href='/denied-buddies'> View rejected buddies </a>
            </button>
        </div>

    );
}

function LoadRequest(props) {

    const [click, setClick] = React.useState(false);
    const [BuddyDenyAgain, setBuddyDenyAgain] = React.useState("jk I hate this dude, deny buddy!");
    const [showModal, setShowModal] = React.useState(false);

    function clickDenyAgain() {
        fetch("/deny-buddy-again", {
            method: 'POST',
            body: JSON.stringify({ "buddy-deny-again-id": props.user.user_id }),
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "same-origin" //sends the cookies with it
        })
            .then(response => response.text())
            .then(result => {
                setBuddyDenyAgain(result)
                setClick(true)
            });
    }


    const handleClose = () => {
        setShowModal(false);
    };
    const handleOpen = () => {
        setShowModal(true);
    };

    return (
        <div>
            <div className="col-12 col-md-6 ">
                <div className="brolfr-card" >
                    <img className="profile" src={props.user.photo_link} ></img>
                    <h4 className="">{props.user.fname} <small style={{ fontSize: "small" }}>{props.user.pronouns} </small></h4>
                    <p className="">
                        {props.user.gender}, {props.user.age} 🌳 {props.user.location}, {props.user.state}  <br></br>
                        {props.user.intro_text}
                    </p>

                    <br></br>
                    <button type="button" className="btn btn-primary app" data-bs-toggle="modal" data-bs-target={`#${props.user.user_id}`} data-bs-whatever={props.user.user_id} onClick={handleOpen} >View More</button><br></br><br></br>
                    <button className="app">
                        <a  href={props.user.chat_link} type="button" > Chat with {props.user.fname}! </a>
                    </button>

                    <br></br>
                    <button className="app" disabled={click} onClick={clickDenyAgain} type="submit" > {BuddyDenyAgain} </button>

                    <div className={`modal fade ${showModal ? "show" : ""}`}
                        id="exampleModal" tabIndex="-1" aria-labelledby={`modal-label-${props.user.user_id}`} aria-hidden={!showModal} style={{ display: showModal ? "block" : "none" }}>
                        <div className="modal-dialog">
                            <div className="modal-content" style={{
                                fontSize: "large",
                                border: "1px solid rgba(14, 79, 79)",
                                backgroundColor: "rgba(245, 255, 245)",
                                textAlign: "center"
                            }} >
                                <div className="modal-header">
                                    <h5 className="modal-title" id={`modal-label-${props.user.user_id}`}>{props.user.fname}</h5>
                                    <button type="button" className="btn-close" onClick={handleClose}></button>
                                </div>
                                <div className="modal-body">
                                    <ul>
                                        <li>Joined {props.user.member_since}</li>
                                        <li>Looking to throw with: {props.user.gender_preference}</li>
                                        <li>Age Range: {props.user.age_range}</li>
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
                                    <div className="modal-footer">
                                        <button className="app">
                                            <a className="button-link" href={props.user.chat_link} type="button" > Chat with {props.user.fname}! </a>
                                        </button>

                                        <br></br>
                                        <button className="app" disabled={click} onClick={clickDenyAgain} type="submit" > {BuddyDenyAgain} </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>

    );
}




{/* <div>
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
<button>
<a className="button-link" href={props.user.chat_link} type="button" > Chat with {props.user.fname}! </a>
</button>

<br></br>
<button disabled={click} onClick={clickDenyAgain} type="submit" > {BuddyDenyAgain} </button>
</div> */}