// """Functions for Profile searching"""
'use strict';

const chatForm = document.querySelector('.chat-message');


chatForm.addEventListener('submit', (evt) => {
    evt.preventDefault();

    const formData = { "receiver-id": chatForm.querySelector("input[name=receiver-id]").value, "send-message": chatForm.querySelector("input[name=send-message]").value };

    fetch('/send-message', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: "same-origin",
        // sends cookies w/ app route ^
    })
        .then((response) => response.text())
        .then((responseMessage) => {
            const button = chatForm.querySelector('button')
            button.innerHTML = responseMessage
            location.reload()
        })
});

// refreshes the div every second to mimic live convos:
window.setInterval(function() {
    const divLocation = document.getElementById("message-content")
    divLocation.reload()
}, 1000);
// not working