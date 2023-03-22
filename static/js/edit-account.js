// """Functions for Account edit form"""
// 'use strict';

const accountForm = document.querySelector('#edit-profile-form')


accountForm.addEventListener('submit', (evt) => {
    evt.preventDefault();

    const formInputs = {
        "fname" : document.querySelector("#fname").value,
        "pronouns": document.querySelector("#pronouns").value,
        "gender": document.querySelector("#gender").value,
        "birthday": document.querySelector("#birthday").value,
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
        .then((responseAccountEdit) => {
            alert(responseAccountEdit);
        })
    });