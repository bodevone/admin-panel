var database = firebase.database();
var refUsers = database.ref('auth/users');
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
    console.log(username);

    console.log(driverId);

    //Register a new user
    firebase.auth().createUserWithEmailAndPassword(username, password).then(function() {
        console.log("User Was Created");
        // Sign in existing user
        firebase.auth().signInWithEmailAndPassword(username, password).then(function() {
                    console.log("User was Singed In");
                    var user = firebase.auth().currentUser;
                    var id = user.uid;
                    console.log(id);

                    addUserToDatabase(id, username, password);

                    //Sign-out
                    firebase.auth().signOut().then(function() {
                        // Sign-out successful.
                        console.log('Sign out successful');
                    }).catch(function(error) {
                        // An error happened.
                    });
        }).catch(function(err) {
            console.log('error');
        });

    }).catch(function (err) {
        console.log('error');
    });
}

function addUserToDatabase(uid, user, psw) {
    var data = {
        username: user,
        password: psw
    };
    refAccounts.child(uid).update(data);

    refUsers.child(uid).update({driver: driverId});

    location.reload();
}
