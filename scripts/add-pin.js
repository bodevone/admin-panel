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

var driversPins = new Array();
for (var i = 0; i < 100; i++) {
    var marker = new mapboxgl.Marker();
    driversPins.push(marker);
}


function showDriverPins(driversId) {
    var refPins = database.ref('driver-pins');
    for(var i = 0; i < 100; i++) {
        driversPins[i].remove();
    }
    refPins.on('value', gotDataPins, errDataPins);
    function gotDataPins(data) {
        for (var key in data.val()) {
            if (data.val().hasOwnProperty(key) && key == driversId) {
                var pinsArray = data.val()[key];
                var pin_it = 0;
                for(var k in pinsArray) {
                    if(pinsArray.hasOwnProperty(k)) {
                        var popup = new mapboxgl.Popup({ offset: 25 })
                            .setText(k);
                        var pinLon = pinsArray[k].longitude;
                        var pinLat = pinsArray[k].latitude;
                        driversPins[pin_it++] = new mapboxgl.Marker().setLngLat([pinLon, pinLat]).setPopup(popup).addTo(map);
                    }
                }
            }
        }
    }
    function errDataPins(err) {
        console.log('Error');
        console.log(err);
    }
}

//Function to push data to table
function dataToTable(driversToTable, driversId) {
    var str1 = "Era pidr))"
    var str = "<tr><td><button class=\"btn btn-primary\" onclick=showDriverPins(\""+ driversId + "\")>" + driversToTable + "</button></tr></td>";
    $("#addPinTable").append(str);
}