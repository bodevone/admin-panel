var driverId = parent.document.URL.substring(parent.document.URL.indexOf('?'), parent.document.URL.length);
while(driverId.charAt(0) === '?') {
    driverId = driverId.substr(1);
}
console.log(driverId);
