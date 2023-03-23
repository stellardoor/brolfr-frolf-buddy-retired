// """Functions for Profile edit form"""
// 'use strict';

// const buttonToggle = document.querySelector("#button-toggle")
const profileForm = document.querySelector('#edit-profile-form')

// function DisableEnableElement(evt, elementName) {
//     evt.preventDefault();
//     const disabledElement = document.getElementById(elementName)

//     clickEnabled = false
// };     
// //     if (disabledElement.disabled = true) {
// //         disabledElement.disabled = false   
// //     }
// //     else {
// //         disabledElement.disabled = true
// //         buttonToggle.innerHTML = "Edit"
// //     }
// })

profileForm.addEventListener('submit', (evt) => {
    evt.preventDefault();

    const ageRange = document.querySelectorAll(".age-range")
    const calendarInfo = document.querySelectorAll(".calendar")

    console.log(ageRange)
    const ageRangeList = []
    for (input of ageRange) {
        if (input.checked) {
            ageRangeList.push(input.value) 
        }
        }
    console.log(ageRangeList)

    console.log(calendarInfo)
    const calendarList = []
    for (input of calendarInfo) {
        if (input.checked) {
            calendarList.push(input.value) 
        }        }
    console.log(calendarList)

    const formInputs = {
        "user-state" : document.querySelector("#user-state").value,
        "user-location": document.querySelector("#user-location").value,
        "intro-text": document.querySelector("#intro-text").value,
        // calendar: calendarList,
        "skill-level": document.querySelector("#skill-level").value,
        // age_range: ageRangeList,
        "frequented-courses": document.querySelector("#frequented-courses").value,
        "gender-pref": document.querySelector("#gender-pref").value,
        "kids-ok": document.querySelector("#kids-ok").value,
        "dogs-ok": document.querySelector("#dogs-ok").value,
        "friendly-stakes": document.querySelector("#friendly-stakes").value,
        "game-type": document.querySelector("#game-type").value,
        "alcohol-ok": document.querySelector("#alcohol-ok").value,
        "tobacco-ok": document.querySelector("#tobacco-ok").value,
        "smoke-420-ok": document.querySelector("#smoke-420-ok").value
    };

    console.log(formInputs)

    fetch('/process-edit', {
        method: 'POST',
        body: JSON.stringify(formInputs),
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: "same-origin"
    })
        .then((response) => response.text())
        .then((responseProfileEdit) => {
            alert(responseProfileEdit);
        })
    });