function getMeAll(callback) {

    var Connection = require('tedious').Connection;
    var Request = require('tedious').Request;
    var config = require('../config.json');

    var connection = new Connection(config.servicedesk),
        result = '';

    connection.on('connect', function (err) {
            // If no error, then good to go...
            console.log('connected...');


            function executeStatement() {
                request = new Request("EXEC Incidents_SelectLast @Last=10", function (err, rowCount) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(rowCount + ' rows');
                    }
                });

                request.on('row', function (columns) {
                    columns.forEach(function (column) {
                        result += (column.metadata.colName + ':\t' + column.value);
                    });
                    result += ('---------------------')

                    callback(result);
                });

                request.on('error', function (e) {

                });

                connection.execSql(request);
            }

            executeStatement();
        }
    );


    connection.on('error', function (err) {
        console.log('somthing was wrong');
    });

    console.log('I am run');
}

exports.sdsk = getMeAll;