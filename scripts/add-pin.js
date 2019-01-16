var database = firebase.database();
var refDrivers = database.ref('auth/drivers');
var refAccounts = database.ref('accounts'); 

var query = refDrivers.orderByKey();
query.once("value").then(function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
        var driver = childSnapshot.child('driver').val();
        idToUsername(driver);
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
    for(var i = 0; i < 100; i++) {
        driversPins[i].remove();
    }
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
                        var popup = new mapboxgl.Popup({ offset: 25, className: k });
                        var pinLon = pinsArray[k].longitude;
                        var pinLat = pinsArray[k].latitude;
                        driversPins[pin_it++] = new mapboxgl.Marker({draggable : true}).setLngLat([pinLon, pinLat]).setPopup(popup).addTo(map);
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

function addDriverPin(driversId) {
    var storesRef = firebase.database().ref().child('driver-pins/' + driversId);
        var newStoreRef = storesRef.push();
        newStoreRef.set({
        latitude: 51.14026671483069,
        longitude: 71.42799629560065
    }); 
}

function removeDriverPin(driversId) {
    // var refPins = database.ref('driver-pins/' + driversId);
    // refPins.on('value', gotDriverPins, errDriverPins);
    // function errDriverPins(err) {
    //     console.log('Error');
    //     console.log(err);
    // }

    // function gotDriverPins(data) {
    //     var lastKey;
    //     for(var key in data.val()) {
    //         lastKey = key;
    //     }

    //     console.log(lastKey);

    //     var storesRef = firebase.database().ref().child('driver-pins/' + driversId + "/" + lastKey).remove();
    // }  

    var refPins = database.ref('driver-pins/' + driversId);

    var query = refPins.orderByKey();
    query.once("value").then(function(snapshot) {
        var lastKey;
        snapshot.forEach(function(childSnapshot) {
            lastKey = childSnapshot.key;
        });
        var storesRef = firebase.database().ref().child('driver-pins/' + driversId + "/" + lastKey).remove();
    });
}



//Function to push data to table
function dataToTable(driversToTable, driversId) {
    var str0 = "<tr><td><button class=\"btn btn-primary\" onclick=showDriverPins(\""+ driversId + "\")>" + driversToTable + "</button>";
    var str1 = "<button id=\"addDriverPinButton\" type=\"button\" class=\"btn btn-success\" onclick=addDriverPin(\""+ driversId + "\")>+</button>";
    var str2 = "<button id=\"removeDriverPinButton\" type=\"button\" class=\"btn btn-danger\" onclick=removeDriverPin(\""+ driversId + "\")>-</button>";
    var end = "</tr></td>";
    $("#addPinTable").append(str0 + str1 + str2 + end);
}