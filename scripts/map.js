mapboxgl.accessToken = 'pk.eyJ1Ijoic2lnZW1peiIsImEiOiJjanFydWRpbGIwb3RxM3htdmRmMTVmdHhkIn0.zyq6Zode1A65qjir6wMLnw';
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/streets-v9',
    center: [71.41598, 51.1101], // starting position
    zoom: 11 // starting zoom
});

map.addControl(new mapboxgl.NavigationControl(), 'top-left');

var database = firebase.database();
var ref = database.ref('driver-locations');

ref.on('value', gotData, errData);

var markers = new Array();
for (var i = 0; i < 100; i++) {
    var marker = new mapboxgl.Marker();
    markers.push(marker);
}

function gotData(data) {
    var driver_locations = data.val();
    var it = 0;

    for(var i = 0; i < 100; i++) {
        markers[i].remove();
    }

    for (var key in driver_locations) {
        if (driver_locations.hasOwnProperty(key)) {
            var driver = driver_locations[key];
            addDriverToMap(key, driver, it);
            it++;
        }
    }
}

function addDriverToMap(key, driver, it) {
    database.ref('accounts').once('value').then(function(snapshot) {
        if (snapshot.hasChild(key)) {
            var name = snapshot.child(key).child('username').val();
            var popup = new mapboxgl.Popup({ offset: 25 }).setText(name);
            //markers[it] = new mapboxgl.Marker().setLngLat([driver.longitude, driver.latitude]).setPopup(popup).addTo(map);

            var el = document.createElement('div');
            el.className = 'marker';
            // add marker to map
            markers[it] = new mapboxgl.Marker(el)
            .setLngLat([driver.longitude, driver.latitude]).setPopup(popup).addTo(map);
        }
    });
}

function errData(err) {
    console.log('Error');
    console.log(err);
}

function openPinForm() {
    document.getElementById("driversAddPinList").style.display = "block";
}

function closePinForm() {
    document.getElementById("driversAddPinList").style.display = "none";
}
