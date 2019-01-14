var driverId = parent.document.URL.substring(parent.document.URL.indexOf('?'), parent.document.URL.length);
while(driverId.charAt(0) === '?') {
    driverId = driverId.substr(1);
}
console.log(driverId);

var database = firebase.database();
var refAccounts = database.ref('accounts');
var refUsers = database.ref('auth/users');

refAccounts.on('value', gotData, errData);
function gotData(data) {
    var username = data.child(driverId).child('username').val();
    var password = data.child(driverId).child('password').val();
    infoToTable(username, password);
}

function errData(err) {
    console.log('Error');
    console.log(err);
}

function infoToTable(username, password) {
    document.getElementById("name").innerHTML = username;
    document.getElementById("pass").innerHTML = password;
    document.getElementById("id").innerHTML = driverId;
}

var query = refUsers.orderByKey();
query.once("value").then(function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
        var driver = childSnapshot.child('driver').val();
        if (driver == driverId) {
            changeId(childSnapshot.key);
        }
        // Cancel enumeration
    });
});

function changeId(userOfDriver) {
    refAccounts.once('value').then(function(snapshot) {
        if (snapshot.child(userOfDriver).exists) {
            var username = snapshot.child(userOfDriver).child('username').val();
            addToTable(username, userOfDriver);
        }
    });
}

function addToTable(username, userId) {
    console.log(username);
    console.log(userId);
    $("#table_users_body").append("<tr><td><a href=\"passenger.html?" + userId + "\" class=\"btn btn-primary\">" + username + "</a></tr></td>");

}
