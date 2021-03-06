var database = firebase.database();
var refDrivers = database.ref('auth/drivers');
var refUsers = database.ref('auth/users');
var refAccounts = database.ref('accounts');

//Adding driver
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

    //Register a new user
    firebase.auth().createUserWithEmailAndPassword(username, password).then(function() {
        console.log("User Was Created");
        // Sign in existing user
        firebase.auth().signInWithEmailAndPassword(username, password).then(function() {
            console.log("User was Singed In");
            var user = firebase.auth().currentUser;
            var id = user.uid;
            console.log(id);

            addDriverToDatabase(id, username, password);

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

function addDriverToDatabase(uid, user, psw) {
    var data = {
        username: user,
        password: psw
    };
    refAccounts.child(uid).update(data);

    refDrivers.child(uid).update({driver: uid});

    location.reload();
}

//Deleting driver
function openDelete() {
    document.getElementById("deleteForm").style.display = "block";
}

function closeDelete() {
    document.getElementById("deleteForm").style.display = "none";
}

function deleteDriver () {
    var username = document.getElementById("nameForDelete").value;
    console.log(username);

    findDriverId(username);
}

function findDriverId(username) {

    var query = refAccounts.orderByKey();
    query.once("value").then(function(snapshot) {
        var foundDriver = false;
        var driverId;
        var name;
        var pass;
        snapshot.forEach(function(childSnapshot) {
            var driver = childSnapshot.child('username').val();
            if (username == driver) {
                foundDriver = true;
                driverId = childSnapshot.key;
                name =  driver;
                pass =  childSnapshot.child('password').val();
            }
            // Cancel enumeration
        });
        if (foundDriver) {
            console.log(driverId);
            deleteFromAuth(driverId, name, pass);
            //deleteDriverPinsAndLocations(driverId);
        } else {
            alert('Имя Пользователя Было Введено не Правильно');
        }
    });
}

function deleteDriverPinsAndLocations(driverId) {
    var refPins = database.ref('driver-pins');
    var refLocations = database.ref('driver-locations');

    refPins.once('value').then(function(snapPin) {
        if (snapPin.child(driverId).exists) {
            snapPin.child(driverId).remove().then(function() {
                console.log('Driver Pin Deleted');
            });
        }
    });

    refLocations.once('value').then(function(snapLoc) {
        if (snapLoc.child(driverId).exists) {
            snapLoc.child(driverId).remove().then(function() {
                console.log('Driver Location Deleted');
            });
        }
    });
}

function deleteFromAuth(driverId, username, password) {
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
                deleteFromDatabase(driverId)
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

function deleteFromDatabase(driverId) {
    refAccounts.child(driverId).remove().then(function() {
        refDrivers.child(driverId).remove().then(function() {
            deleteUserOfDriver(driverId);
        }).catch(function(error) {
            console.log('Error');
        });
    }).catch(function(error) {
        console.log('Error');
    });
}

function deleteUserOfDriver(driverId) {
    var query = refUsers.orderByKey();
    query.once("value").then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var driver = childSnapshot.child('driver').val();
            if (driverId == driver) {
                var userId = childSnapshot.key;
                refUsers.child(userId).remove().then(function() {
                    console.log('User WAs Delted From Users');
                    deleteUserOfDriverFromAuth(userId);
                }).catch(function(error) {
                    console.log('Error');
                });
                // Cancel enumeration
            }
        });
    });
}

function deleteUserOfDriverFromAuth(userId) {
    refAccounts.once('value').then(function(snapshot) {
        var username = snapshot.child(userId).child('username').val();
        var password = snapshot.child(userId).child('password').val();

        console.log('In deleting from auth user Process');
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

                    refAccounts.child(userId).remove().then(function() {
                        console.log('User of Driver deleted in Database');
                        location.reload();

                    }).catch(function(error) {
                        console.log('Error');
                    });

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
    });
}
