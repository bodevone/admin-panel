var userId = parent.document.URL.substring(parent.document.URL.indexOf('?'), parent.document.URL.length);
while(userId.charAt(0) === '?') {
    userId = userId.substr(1);
}


// var index = twoIds.indexOf("&");  // Gets the first index where a space occours
// var userId = twoIds.substr(0, index); // Gets the first part
// var driverId = twoIds.substr(index + 1);

console.log(userId);

var database = firebase.database();
var refAccounts = database.ref('accounts');
var refUsers = database.ref('auth/users');

refAccounts.on('value', gotData, errData);
function gotData(data) {
    var username = data.child(userId).child('username').val();
    var password = data.child(userId).child('password').val();
    infoToTable(username, password);
}

function errData(err) {
    console.log('Error');
    console.log(err);
}

function infoToTable(username, password) {
    document.getElementById("name").innerHTML = username;
    document.getElementById("pass").innerHTML = password;
    document.getElementById("id").innerHTML = userId;
}
