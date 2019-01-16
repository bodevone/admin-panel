function enterAdmin() {
    var username = document.getElementById("inputUsername").value;
    var password = document.getElementById("inputPassword").value;

    // Sign in existing user
    firebase.auth().signInWithEmailAndPassword(username, password).then(function() {
        window.open("index.html", "_self");
    }).catch(function(err) {
        alert('Неправильные Пароль или Имя Пользователя');
    });
}
