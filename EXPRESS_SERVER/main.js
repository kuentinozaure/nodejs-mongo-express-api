callPost() => {

    fetch('/city', {
        method: 'post'
    })
    .then(response => response.json())
    .then(jsonData => console.log(jsonData))
    .catch(err => {
    })
}
