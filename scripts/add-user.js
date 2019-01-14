var database = firebase.database();
var refUsers = database.ref('auth/users');
var refAccounts = database.ref('accounts');

function openForm() {
    document.getElementById("myForm").style.display = "block";
}

function closeForm() {
    document.getElementById("myForm").style.display = "none";
}

function addUser() {
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


//Deleting user
function openDelete() {
    document.getElementById("deleteForm").style.display = "block";
}

function closeDelete() {
    document.getElementById("deleteForm").style.display = "none";
}

function deleteUser () {
    var username = document.getElementById("nameForDelete").value;
    console.log(username);

    findUserId(username);
}

function findUserId(username) {

    var query = refAccounts.orderByKey();
    query.once("value").then(function(snapshot) {
        var foundUser = false;
        var userId;
        var name;
        var pass;
        snapshot.forEach(function(childSnapshot) {
            var user = childSnapshot.child('username').val();
            if (username == user) {
                foundUser = true;
                userId = childSnapshot.key;
                name =  user;
                pass =  childSnapshot.child('password').val();
            }
            // Cancel enumeration
        });
        if (foundUser) {
            console.log(userId);
            deleteFromAuth(userId, name, pass);
        } else {
            alert('Имя Пользователя Было Введено не Правильно');
        }
    });
}

function deleteFromAuth(userId, username, password) {
    console.log(username);
    console.log(password);
    firebase.auth().signInWithEmailAndPassword(username, password).then(function() {
        var user = firebase.auth().currentUser;

        //Sign-out
        firebase.auth().signOut().then(function() {
            // Sign-out successful.
            console.log('Sign out successful');

            user.delete().then(function() {
                console.log('User Deleted');
                deleteFromDatabase(userId)
            }).catch(function(error) {
                // An error happened.
                console.log('Error');
            });
        }).catch(function(error) {
            // An error happened.
        });

    }).catch(function(error) {
        console.log('Error');
    });
}

function deleteFromDatabase(userId) {
    refAccounts.child(userId).remove().then(function() {
        refUsers.child(userId).remove().then(function() {
            location.reload();
        }).catch(function(error) {
            console.log('Error');
        });
    }).catch(function(error) {
        console.log('Error');
    });
}
