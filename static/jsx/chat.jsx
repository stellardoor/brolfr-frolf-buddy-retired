function App() {

    const [user, setUser] = React.useState()

    React.useEffect(() => {
        fetch("/send-message")
            .then(response => response.json())
            .then(result => {
                setUser(result);
            });
    }, []);
    const userRequests = [];
    for (const user of users) {
        // userRequests.push(<loadRequests item = {user} key={user.user_id}/>);
        userRequests.push(<LoadRequest user={user} />);
    }
    return (
        <div>
            {userRequests}
        </div>
    );
}