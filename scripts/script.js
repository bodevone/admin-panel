var database = firebase.database();
var refDrivers = database.ref('auth/drivers');
var refAccounts = database.ref('accounts');

var idList = [];

refDrivers.on('value', gotData, errData);
function gotData(data) {
    var drivers = data.val();
    idToUsername(drivers);
}

function errData(err) {
    console.log('Error');
    console.log(err);
}

//Function to change users id to username
function idToUsername(driversId) {
    var driversUsernames = [];
    refAccounts.on('value', gotData, errData);
    function gotData(data) {
        for (var i = 0; i < driversId.length; i++) {
            if (data.child(driversId[i]).exists) {
                var value = data.child(driversId[i]).child('username').val();
                dataToTable(value, driversId[i]);
            }
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



function driverInfo(driver) {

}
