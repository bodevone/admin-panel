var database = firebase.database();
var refDrivers = database.ref('auth/drivers');
var refAccounts = database.ref('accounts');

function openForm() {
    document.getElementById("myForm").style.display = "block";
}

function closeForm() {
    document.getElementById("myForm").style.display = "none";
}

function addDriver() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    // var username = myForm.;
    // var password = myForm.psw;
    console.log(username);

    // Register a new user
    // firebase.auth().createUserWithEmailAndPassword(username, password)
    // .catch(function (err) {
    //     // Handle errors
    // });

    // Sign in existing user
    firebase.auth().signInWithEmailAndPassword(username, password)
    .catch(function(err) {
        // Handle errors
    });

    var uid;
    var user = firebase.auth().currentUser;
    if (user != null) {
        uid = user.uid;
    }
    addDriverToDatabase(uid, username, password);

    console.log(uid);

    // Sign out user
    firebase.auth().signOut()
    .catch(function (err) {
        // Handle errors
    });
}

function addDriverToDatabase(uid, user, psw) {
    var data = {
        username: user,
        password: psw
    };
    refAccounts.child(uid).update(data);
}
