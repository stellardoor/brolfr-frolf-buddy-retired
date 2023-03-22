// """loads upload photo feature"""

function UploadProfilePicture() {
    // const buttonPhoto = document.querySelector("photo-submit")
    // const [userFile, setuserFile] = React.useState()

    const handleUpload = (evt) => {
        evt.preventDefault()
        const formData = new FormData(evt.target); // need to understand formdata

            // const photoInput = { 'form-file': document.querySelector('#form-file') };

        fetch('/process-photo', {
            method: 'POST',
            body: formData,
            credentials: "same-origin",
            // sends cookies w/ app route ^
        })
            .then((response) => response.text())
            .then((responsePhoto) => {
                alert(responsePhoto)
            })

    }
    return (
        <div className="container">
            <form onSubmit={handleUpload} encType="multipart/form-data">
                <div className="mb-3">
                    <label htmlFor="form-file" className="form-label">Upload a new profile photo:</label>
                    <input className="form-control" type="file" id="form-file" name="form-file" ></input>
                    <input type="submit" id="photo-submit"></input>
                </div>
            </form>
        </div>
    )
}