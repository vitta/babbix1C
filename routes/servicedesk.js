
var Connection = require('tedious').Connection,
    Request = require('tedious').Request,
    config = require('../config.json');

function getData(query, callback) {
    var connection = new Connection(config.servicedesk),
        result = [];

    function executeStatement() {
        var request = new Request(query, function (err, rowCount) {
            if (err) {
                console.log(err);
            } else {
                callback(result);
            }
        });

        request.on('row', function (columns) {
            result.push(columns);
        });

        request.on('error', function (e) {
            console.log('Request Error')
        });

        connection.execSql(request);
    }

    connection.on('connect', function (err) {
            executeStatement();
        }
    );


    connection.on('errorMessage', function (err) {
        console.log('Connection error');
    });
}

exports.newTasks = function(callback) {
    getData("EXEC Incidents_SelectLast @Last=11", callback);
};

exports.overdueTasks = function(callback) {
    getData("EXEC Incidents_SelectOverdue", callback);
};