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
    var marker = new mapboxgl.Marker({
        draggable: true
    });
    driversPins.push(marker);
}


function showDriverPins(driversId) {
    var refPins = database.ref('driver-pins');
    // var pin_it = 0;
    // for(var i = 0; i < 100; i++) {
    //     driversPins[i].remove();
    // }
    refPins.on('value', gotDataPins, errDataPins);
    function gotDataPins(data) {
        for (var key in data.val()) {
            if (data.val().hasOwnProperty(key) && key == driversId) {
                var pinsArray = data.val()[key];
                var pin_it = 0;
                for(var i = 0; i < 100; i++) {
                    driversPins[i].remove();
                }
                for(var k in pinsArray) {
                    if(pinsArray.hasOwnProperty(k)) {
                        var popup = new mapboxgl.Popup({ offset: 25, className: k })
                            .setText(k);
                        var pinLon = pinsArray[k].longitude;
                        var pinLat = pinsArray[k].latitude;
                        driversPins[pin_it++] = new mapboxgl.Marker({draggable : true}).setLngLat([pinLon, pinLat]).setPopup(popup).addTo(map);
                        console.log(pin_it);
                    }
                }

                for(var i = 0; i < pin_it; i++) {
                    driversPins[i].on('dragend', onDragEnd);
                } 
            }
        }
    }

    function onDragEnd(e) {
        var pinName = e.target._popup['options']['className'];
        var pinLng = e.target._lngLat['lng'];
        var pinLat = e.target._lngLat['lat']
        firebase.database().ref('driver-pins/' + driversId + "/" + pinName).set({
            latitude: pinLat,
            longitude: pinLng
        });
    }

    function errDataPins(err) {
        console.log('Error');
        console.log(err);
    }
}

//Function to push data to table
function dataToTable(driversToTable, driversId) {
    var str0 = "<tr><td><button class=\"btn btn-primary\" onclick=showDriverPins(\""+ driversId + "\")>" + driversToTable + "</button>";
    var str1 = "<button id=\"addDriverPinButton\" type=\"button\" class=\"btn btn-success\">+</button>";
    var str2 = "<button id=\"removeDriverPinButton\" type=\"button\" class=\"btn btn-danger\">-</button>";
    var end = "</tr></td>";
    $("#addPinTable").append(str0 + str1 + str2 + end);
}