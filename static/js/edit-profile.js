// // """Functions for Profile searching"""
// 'use strict';

// const userProfileInput = document.querySelectorAll('.get-input');



// form.addEventListener('submit',(evt) => {
//     evt.preventDefault();

//     const buddyInput = {'buddy-id' : form.querySelector("input").value}; 
//     // we need to put .value and NOT .value() - not a function!

//     fetch('/process-edit', {method: 'POST',
//     body: JSON.stringify(buddyInput),
//     headers: {
//     'Content-Type': 'application/json',
//     },
//     credentials: "same-origin", 
//     // sends cookies w/ app route ^
// })
//     .then((response) => response.text())
//     .then((responseBuddyId) => { 
//         const button = form.querySelector('button')
//         button.innerHTML = responseBuddyId
//         button.disabled = true
//         location.reload()
//     })
// }
// )