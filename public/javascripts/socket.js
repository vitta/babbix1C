var socket = io.connect('http://localhost:3000');

socket
    .on("newTasks", function (data) {
        console.log(data);
    })
    .on("triggers", function (data) {
        console.log("Triggers" + data);
    });