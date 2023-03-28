// """functions loading all chatsssssss"""
function App() {
    const [buddyChat, setBuddyChat] = React.useState([]);
    const [allBuddiesToChat, setAllBuddiesToChat] = React.useState([]);
    const userID = document.querySelector("#user-id").value
    const [receiverID, setReceiverID] = React.useState("");
    const [buddyID, setBuddyID] = React.useState("");
    const [chatMessages, setChatMessages] = React.useState([]);

    
    // React.useEffect(() => {    
        // function loadChatMessagesInterval() {
        // function loadChatMessagesInterval() {
        function loadChatMessagesInterval(chatMessages) {
            const chatLogList = [];
            console.log(`chatmessage = ${chatMessages}`)
            if (chatMessages === []) {
                chatLogList.push(
                    <div>
                        <p> No one to talk to </p>
                    </div>
                )
            }
            else {
                for (const chat of chatMessages) {
                    if (chat.sender_id == userID) {
                        chatLogList.push(<LoadChatsRight chat={chat} user1={userID} key={chat.chat_id} />);
                    }
                    else {
                        chatLogList.push(<LoadChats chat={chat} user1={chat.receiver_id} key={chat.chat_id} />);
                    }
                }
        }
        setBuddyChat(chatLogList)
    }

        // console.log(`chat log = ${chatLogList}`)


    // loadChatMessagesInterval();
    // let id = setInterval(loadChatMessagesInterval, 10000); //callback - when component unloads, stop timer
    // return () => { clearInterval(id) }

// }, []);

    // function loadNewBuddyChat(buddyID) {

    // }
        const setNewChatMessages = (evt) => {
            evt.preventDefault()
            const idInput = evt.currentTarget.value
            console.log(idInput)
            fetch("/get-buddy-other-id", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ "buddy-id": idInput}),
                credentials: "same-origin"
            })
                .then(response => response.text())
                .then(resultID => {
                    setReceiverID(resultID)
                })
            fetch("/load-buddy-chats-2", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ "buddy-id": idInput }),
                credentials: "same-origin"
            })
                .then(response => response.json())
                .then(resultList => {
                    console.log(resultList)
                    loadChatMessagesInterval(resultList)
                    setChatMessages(resultList) //why not work
                    setBuddyID(idInput)
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
                userChats.push( <button id={user.buddy_id} key = {user.buddy_id} type="button" value={user.buddy_id} onClick={(evt) => setNewChatMessages(evt)}
                className="list-group-item list-group-item-action"> <img className="tiny" src={user.photo_link} ></img> {user.fname}</button>);
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
                alert(responseText)
            }))
        }

    return (
        <div>
            <div className="list-group">
                {allBuddiesToChat}
            
            </div>
            <div className="buddy-message">
                {buddyChat}
            </div>
            <div>
                <input type="hidden" id="send-message-hidden" value = {buddyID} />
                <input type="hidden" id="receiver-id-hidden" value = {receiverID} />
                <input type="text" id="send-message" name="send-message" />
                <button htmlFor="send-message" type="submit" onClick={(evt) => processSendMessage(evt)} > Send Message! </button>
            </div>
        </div>
    );


}


function LoadChats(props) {

    return (
        <div className="left-message">
            <img className="extra-tiny" src="/static/images/tree-b.png" ></img>
            <div className="bubble">
                <b>{props.chat.sender_name}: </b> {props.chat.message} </div><br></br>
            <small className="timestamp">{props.chat.time_stamp} </small>
        </div>
    )
}

function LoadChatsRight(props) {
    return (
        <div className="right-message">
            <div className="bubble">
                <b>{props.chat.sender_name}: </b> {props.chat.message}   </div>
            <img className="extra-tiny" src="/static/images/tree-b.png" ></img> <br></br>
            <small className="timestamp">{props.chat.time_stamp} </small>
        </div>
    )

}

