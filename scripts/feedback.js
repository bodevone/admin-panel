var database = firebase.database();
var refFeedbacks = database.ref('feedbacks');

var query = refFeedbacks.orderByKey();
query.once('value').then(function (snapshot) {
    snapshot.forEach(function(childSnapshot) {
        var username = childSnapshot.child('username').val();
        var name = childSnapshot.child('name').val();
        var text = childSnapshot.child('feedback').val();

        addToTable(username, name, text);
    });
});

function addToTable(username, name, feedback) {
    $("#table_body").append("<tr class=\"table-info\"><td>" + username + "</td><td>" + name + "</td><td>" + feedback + "</td></tr>");
}
