
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
                result.forEach(function(elem, id, arr) {
                    arr[id] = {};
                    elem.forEach(function(elem) {
                        arr[id][elem.metadata.colName] = elem.value;
                    });
                });
                callback(result);
            }
        });

        request.on('row', function (columns) {
            result.push(columns);
        });

        connection.execSql(request);
    }

    connection.on('connect', function (err) {
            if(err) {
                console.log('Connection error: ' + err);
            } else {
                executeStatement();
            }
        }
    );


    connection.on('errorMessage', function (err) {
        console.log('Connection error: ' + err);
    });
}

exports.newTasks = function(callback) {
    getData("EXEC Incidents_SelectLast @Last=11", callback);
};

exports.overdueTasks = function(callback) {
    getData("EXEC Incidents_SelectOverdue", callback);
};

exports.taskCounter = function(callback) {
    getData("IncidentsStatusSummaries_SelectAll", callback);
}