var database = firebase.database();
var refFeedbacks = database.ref('feedbacks');

var query = refFeedbacks.orderByKey();
query.once('value').then(function (snapshot) {
    snapshot.forEach(function(childSnapshot) {
        var username = childSnapshot.child('username').val();
        var name = childSnapshot.child('name').val();
        var text = childSnapshot.child('feedback').val();
        var key = childSnapshot.key;

        addToTable(username, name, text, key);
    });
});

function addToTable(username, name, feedback, key) {
    $("#table_body").append("<tr class=\"table-info\"><td>" + username +
    "</td><td>" + name + "</td><td>" + feedback +
    "</td><td><button type=\"button\" class=\"btn btn-danger\" onclick=deleteFeedback(\""+ key + "\")> Удалить </button></td></tr>");
}

function deleteFeedback(key) {
    refFeedbacks.child(key).remove();
    location.reload();
}
