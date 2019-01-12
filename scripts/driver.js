var driverId = parent.document.URL.substring(parent.document.URL.indexOf('?'), parent.document.URL.length);
while(driverId.charAt(0) === '?') {
    driverId = driverId.substr(1);
}
console.log(driverId);

var database = firebase.database();
var refAccounts = database.ref('accounts');
var refUsers = database.ref('auth/users')

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
    refAccounts.on('value', gotData, errData);
    function gotData(data) {
        if (data.child(userOfDriver).exists) {
            var username = data.child(userOfDriver).child('username').val();
            addToTable(username, userOfDriver);
        }
    }

    function errData(err) {
        console.log('Error');
        console.log(err);
    }
}

function addToTable(username, userId) {
    console.log(username);
    console.log(userId);
    $("#table_users_body").append("<tr><td><a href=\"#\" class=\"btn btn-primary\">" + username + "</a></tr></td>");

}
