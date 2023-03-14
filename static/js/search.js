// """Event listener to take user to buddy chat"""
'use strict';

const locationInput = document.querySelector('user-location');

    form.addEventListener('submit',(evt) => {
        evt.preventDefault();

        const buddyInput = {'buddy-id' : form.querySelector("input").value}; 
        // we need to put .value and NOT .value() - not a function!

        fetch('/send-buddy-request', {method: 'POST',
        body: JSON.stringify(buddyInput),
        headers: {
        'Content-Type': 'application/json',
        },
        credentials: "same-origin", 
        // sends cookies w/ app route ^
    })
        .then((response) => response.text())
        .then((responseBuddyId) => { 
            const button = form.querySelector('button')
            button.innerHTML = responseBuddyId
            button.disabled = true
        })
    }
    )
};