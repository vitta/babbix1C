var Connection = require('tedious').Connection;

var config = {
    userName: '',
    password: '',
    server: ''
};

exports.get = function() {

    var connection = new Connection(config),
        result = '';

    connection.on('connect', function(err) {
            // If no error, then good to go...
            console.log('connected');

            var Request = require('tedious').Request;

            function executeStatement() {
                request = new Request("EXEC Incidents_SelectLast @Last=10", function(err, rowCount) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(rowCount + ' rows');
                    }
                });

                request.on('row', function(columns) {
                    columns.forEach(function(column) {
                        result += (column.metadata.colName + ':\t' + column.value);
                    });
                    result += ('---------------------')
                });

                request.on('error', function(e) {

                });

                connection.execSql(request);
            }

            executeStatement();
        }
    );

    return result;
}