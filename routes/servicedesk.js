
var soap = require('soap'); //Подключаем модуль
var userSoap = 'monitor'; //Пользак веб сервиса
var passSoap = 'monitor123QWE'; //Пароль пользака веб сервиса
var url = 'http://'+userSoap+':'+passSoap+'@1cws.avalon.ru/itilp/ws/MonitoringService?wsdl'; //Урл до всдл с включенной аутентификацией, тут нужны пароли чтобы получить саму всдл

function f3(elem, index) { //Ковыряемся в результате
    console.log("---------------" + elem.IncidentCount)//Ну тут все понятно

}

function f2(err, result) { //Вызываем метод Сервис.Порт.Метод(Аргументы, шняга)

    console.log(result); //Че получили в ответ, тут нужно делать проверку на ошибки


    result.return.Counters.forEach(f3);
}

function f1(err, client) { //Создаем клиента модуля

    client.setSecurity(new soap.BasicAuthSecurity(userSoap, passSoap)); //Говорим методам что они работают с сервисом которому нужна аутентификация

    console.log(client.describe()); //Смотрим что нам предоставляют веб-сервисы, какие методы, порты и сервисы.

    client.MonitoringService.MonitoringServiceSoap.TaskCounter({}, f2);
}

soap.createClient(url, f1);


function getDataFrom1C(query, callback) {


}


 function getData(query, callback) {
     var connection = new Connection(config.servicedesk),
     result = [];

     function executeStatement() {
         var request = new Request(query, function (err, rowCount) {
             if (err) {
                console.log(err);
             }
             else {
             result.forEach(function(elem, id, arr) {
                 arr[id] = {};
                 elem.forEach(function(elem) {
                 arr[id][elem.metadata.colName] = elem.value;
                });
             });
            callback(result);
            connection.close();
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
     });


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
     getData("EXEC Incidents_SelectOverdue", callback);

 };

