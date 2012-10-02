var config = require('../config.json');

var data = JSON.stringify({
    "jsonrpc": "2.0",
    "method": "user.authenticate",
    "params": config.zabbix.authParams,
    "auth": null,
    "id": 0
});

/*function zbx_request(data) {
 return {
 host:config.zabbix.host,
 port:config.zabbix.port,
 path:'/zabbix/api_jsonrpc.php',
 method:'POST',
 headers:{
 'Content-Type':'application/json',
 'Content-Length':data.length
 }
 };
 }*/
/*

 exports.index = function (req, res) {

 var newreq = http.request(zbx_request(data), function (res) {
 //        res.setEncoding('utf8');

 res.on('data', function (chunk) {
 console.log("body: " + chunk);

 var id = JSON.parse(chunk).result;

 var newdata = JSON.stringify(
 {
 "jsonrpc": "2.0",
 "method": "trigger.get",
 "params": {
 "filter": {
 "status":[0],
 "value":[1,2],
 "priority":[3,4,5]
 },
 "monitored":0,
 "select_items":"extend",
 "sortfield":"lastchange",
 "output":"extend"
 },
 "auth": id,
 "id": "2"
 }
 );

 (function (newdata) {
 var newreq1 = http.request(zbx_request(newdata), function (res) {
 //res.setEncoding('utf8');
 var result = '';
 res.on('data', function (chunk) {
 result += chunk;
 });
 res.on('end', function(){
 var ids = [],
 res2 = JSON.parse(result).result.slice(-2);

 console.log(JSON.parse(result).result.length);

 for (var i = 0, l = res2.length; i < l; i++) {
 ids[i] = res2[i]['triggerid']
 }

 var data = JSON.stringify({
 "jsonrpc": "2.0",
 "method": "host.get",
 "params": {
 "triggerids": ids,
 "output":"extend"
 },
 "auth": id,
 "id": "3"
 });

 var req = http.request(zbx_request(data), function(res) {
 var result = '';

 res.on('data', function(chunk) {
 result += chunk;
 });

 res.on('end', function() {
 console.log(JSON.parse((result)));
 });
 });

 req.write(data);
 req.end();
 console.log(JSON.parse(result).result.slice(-2));
 console.log(JSON.parse(result).result.length)
 });
 });

 newreq1.write(newdata);
 newreq1.end();

 })(newdata);
 });
 });

 newreq.on('error', function (e) {
 console.log(e);
 });

 newreq.write(data);
 newreq.end();

 res.render('index', { title:'aaaa' });
 };
 */