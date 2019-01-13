mapboxgl.accessToken = 'pk.eyJ1Ijoic2lnZW1peiIsImEiOiJjanFydWRpbGIwb3RxM3htdmRmMTVmdHhkIn0.zyq6Zode1A65qjir6wMLnw';
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/streets-v9',
    center: [71.41598, 51.1101], // starting position
    zoom: 12 // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());

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
            markers[it] = new mapboxgl.Marker().setLngLat([driver.longitude, driver.latitude]).addTo(map);
            it++;
        }
    }
}

function errData(err) {
    console.log('Error');
    console.log(err);
}

