var socket = io.connect('http://localhost:3000');

socket
    .on("newTasks", function (data) {
        console.log("new: " + data.length);
    })
    .on("overdueTasks", function (data) {
        console.log("overdue: " + data.length);
    })
    .on("triggers", function (data) {
        console.log("triggers" + data);
    });