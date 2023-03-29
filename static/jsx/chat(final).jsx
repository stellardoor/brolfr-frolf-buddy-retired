// """functions loading all chatsssssss"""
function App() {
    const [buddyChat, setBuddyChat] = React.useState([]);
    const [allBuddiesToChat, setAllBuddiesToChat] = React.useState([]);
    const [buddyID, setBuddyID] = React.useState("");
    const [receiverID, setReceiverID] = React.useState("");
    const [receiverName, setReceiverName] = React.useState("No Chats Open");
    const user1 = document.querySelector("#user-id").value
    const [button, setButton] = React.useState("Send Message");

    // console.log([user1, user2, buddyID])

    React.useEffect(() => {
        function loadChatMessages() {
        const user2 = document.getElementById("receiver-id-hidden").value
        console.log(`reciever-id = ${user2}`)
        const buddyIDinput = document.getElementById("send-message-hidden").value
        console.log(`buddy-id = ${buddyIDinput}`)
        fetch("/load-buddy-chats", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify( {"buddy-id" : buddyIDinput}),
            credentials: "same-origin"
        })
            .then(response => response.json())
            .then(resultList => {
                console.log(`result-list = ${resultList}`)
                const chatLogList = [];
                if (resultList.includes("Error")) {
                    setBuddyChat("none")
                }
                else {
                    for (const chat of resultList) {
                        if (chat.sender_id == user1) {
                        chatLogList.push(<LoadChatsRight chat={chat} user1={user1} key={chat.chat_id} />);
                        }
                        else {
                            chatLogList.push(<LoadChats chat={chat} user1={user2} key={chat.chat_id} />);
                        }
                    }
                    setBuddyChat(chatLogList)
                }
    
            });
        }
    // loadChatMessages();
    // let id = setInterval(loadChatMessages, 10000);
    // return () => {clearInterval(id)} //callback - when component unloads, stop timer
}, []);

function loadInitialChats(buddyIDinput, receiverIDinput) {
    fetch("/load-buddy-chats", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify( {"buddy-id" : buddyIDinput}),
        credentials: "same-origin"
    })
        .then(response => response.json())
        .then(resultList => {
            console.log(`result-list = ${resultList}`)
            const chatLogList = [];
            if (resultList.includes("Error")) {
                setBuddyChat("none")
            }
            else {
                for (const chat of resultList) {
                    if (chat.sender_id == user1) {
                    chatLogList.push(<LoadChatsRight chat={chat} user1={user1} key={chat.chat_id} />);
                    }
                    else {
                        chatLogList.push(<LoadChats chat={chat} user1={receiverIDinput} key={chat.chat_id} />);
                    }
                }
                setBuddyChat(chatLogList)
            }

        });
    }

const setNewChatMessages = (evt) => {
    evt.preventDefault()
    const idInput = evt.currentTarget.value
    console.log(idInput)
    setBuddyID(idInput)
    fetch("/get-buddy-other-id", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ "buddy-id": idInput }),
        credentials: "same-origin"
    })
        .then(response => response.json())
        .then(resultID => {
            setReceiverID(resultID[0])
            setReceiverName(`Chatting with ${resultID[1]}!`)
            loadInitialChats(idInput, resultID)
        })
}

React.useEffect(() => {
    fetch("/get-buddies-chat")
        .then(response => response.json())
        .then(resultUsers => {

            // console.log(users)
            const userChats = [];
            for (const user of resultUsers) {
                // userRequests.push(<loadRequests item = {user} key={user.user_id}/>);
                userChats.push(<button id={user.buddy_id} key={user.buddy_id} type="button" value={user.buddy_id} onClick={(evt) => setNewChatMessages(evt)}
                    className="buddy-button"> <img className="tiny" src={user.photo_link} ></img> {user.fname}</button>);
            }
            console.log(userChats)
            setAllBuddiesToChat(userChats)
        })
}, []);


const processSendMessage = (evt) => {
    evt.preventDefault()
    const sendMessage = document.getElementById("send-message").value;
    document.getElementById("send-message").value = ""
    const receiver = document.getElementById("receiver-id-hidden").value
    const buddyID = document.getElementById("send-message-hidden").value

    // alert(sendMessage)
    const formInputs = {
        "receiver-id": receiver,
        "send-message": sendMessage,
        "buddy-id": buddyID
    }

    fetch("/send-message", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formInputs),
        credentials: "same-origin"
    })
        .then((response) => response.text())
        .then((responseText => {
            setButton(responseText)
            setTimeout(
                () => { setButton("Send Message!") },
                3000)
        }))
        loadInitialChats(buddyID, receiver)
}

return (
    <div>
        <div className="row">
        <div className="nav container-for-buddies-chat d-flex justify-content-between">
                <div className="col-3">
                    {allBuddiesToChat}
                </div>
            </div>
        <div className="col-3 offset-2">
            <h1> {receiverName}</h1>
            <div className="buddy-message">
                {buddyChat}
                <input className ="send-input" type="text" id="send-message" name="send-message" />
                <button className="send-button" htmlFor="send-message" type="submit" onClick={(evt) => processSendMessage(evt)} > {button} </button>
            
            </div>
        </div>
                <div>
                    <input className="send-input" type="hidden" id="send-message-hidden" value={buddyID} />
                        <input type="hidden" id="receiver-id-hidden" value={receiverID} />
                </div>
                </div>
    </div>
);


}



function LoadChats(props) {

    return(
        <div className = "left-message">
            <img className="extra-tiny" src="/static/images/tree-b.png" ></img>
            <div className = "bubble">
            <b>{props.chat.sender_name}: </b> {props.chat.message} </div><br></br>
            <small className = "timestamp">{props.chat.time_stamp} </small> 
        </div>
        )
    }

function LoadChatsRight(props) {
        return(
            <div className="right-message">
                <div className = "bubble">
                <b>{props.chat.sender_name}: </b> {props.chat.message}   </div>
              <img className="extra-tiny" src="/static/images/tree-b.png" ></img> <br></br>
                <small className = "timestamp">{props.chat.time_stamp} </small> 
            </div>
            )
    }