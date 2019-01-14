var database = firebase.database();
var refDrivers = database.ref('auth/drivers');
var refAccounts = database.ref('accounts');

var query = refDrivers.orderByKey();
query.once("value").then(function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
        var driver = childSnapshot.child('driver').val();
        idToUsername(driver);
        // Cancel enumeration
    });
});

//Function to change users id to username
function idToUsername(driversId) {
    refAccounts.on('value', gotData, errData);
    function gotData(data) {
        if (data.child(driversId).exists) {
            var value = data.child(driversId).child('username').val();
            dataToTable(value, driversId);
        }

    }

    function errData(err) {
        console.log('Error');
        console.log(err);
    }
    // console.log(driversUsernames);
    // return driversUsernames;
}

//Function to push data to table
function dataToTable(driversToTable, driversId) {
    $("#table_body").append("<tr><td><a href=\"driver.html?" + driversId + "\" class=\"btn btn-primary\">" + driversToTable + "</a></tr></td>");
    console.log(driversId);
}