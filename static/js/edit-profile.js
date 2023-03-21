// // """Functions for Profile searching"""
// 'use strict';

// // const userProfilePic = document.querySelector('#form-file');
// function uploadProfilePicture() {
//     const buttonPhoto = document.querySelector("photo-submit")


//     buttonPhoto.addEventListener('submit', (evt) => {
//         evt.preventDefault();

//         const photoInput = { 'form-file': document.querySelector('#form-file') };

//         fetch('/process-photo', {
//             method: 'POST', enctype: "multipart/form-data",
//             body: JSON.stringify(photoInput),
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             credentials: "same-origin",
//             // sends cookies w/ app route ^
//         })
//             .then((response) => response.text())
//             .then((responsePhoto) => {
//                 alert(responsePhoto)
//             })
//     }
//     )
// }