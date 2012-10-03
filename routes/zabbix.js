var config = require('../config.json'),
    http = require('http'),
    token,
    authData;

function zbx_request(data) {
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
}

authData = JSON.stringify({
    "jsonrpc":"2.0",
    "method":"user.authenticate",
    "params":config.zabbix.authParams,
    "auth":null,
    "id":0
});

function getHostName(triggerObj, hosts) {
    hosts.forEach(function(elem, index, arr) {
        elem.triggers.forEach(function(trigger) {
            if (trigger.triggerid == triggerObj.triggerid) {
                triggerObj['hostname'] = elem.name;
                triggerObj.description = triggerObj.description.replace('{HOSTNAME}', elem.name);
            }
        })
    })
};

function auth(callback) {
    var newreq = http.request(zbx_request(authData), function (res) {
        res.on('data', function (chunk) {
            token = JSON.parse(chunk).result;
            callback();
        });
    });

    newreq.on('error', function (e) {
        console.log(e);
    });

    newreq.write(authData);
    newreq.end();
}

function getTriggers(callback) {
    var newdata = JSON.stringify({
        "jsonrpc":"2.0",
        "method":"trigger.get",
        "params":{
            "filter":{
                "status":[0],
                "value":[1, 2],
                "priority":[3, 4, 5]
            },
            "monitored":0,
            "select_items":"extend",
            "sortfield":"lastchange",
            "output":"extend"
        },
        "auth":token,
        "id":"2"
    });


    var newreq1 = http.request(zbx_request(newdata), function (res) {
        var result = '';

        res.on('data', function (chunk) {
            result += chunk;
        });

        res.on('end', function () {
            var triggers = JSON.parse(result).result;

            getHosts(triggers, callback);
        });
    });

    newreq1.on('error', function (e) {
        console.log(e);
    });

    newreq1.write(newdata);
    newreq1.end();

};


function getHosts(triggers, callback) {
    var data,
        ids = [];

    triggers.forEach(function(trigger) {
        ids.push(trigger.triggerid);
    });

    data = JSON.stringify({
        "jsonrpc":"2.0",
        "method":"host.get",
        "params":{
            "triggerids":ids,
            "output":"extend"
        },
        "auth":token,
        "id":"2"
    });

    var req = http.request(zbx_request(data), function (res) {
        var result = '';

        res.on('data', function (chunk) {
            result += chunk;
        });

        res.on('end', function () {
            var hosts = JSON.parse(result).result;

            triggers.forEach(function(trigger) {
                getHostName(trigger, hosts);
            });

            callback(triggers);
        });
    });

    req.write(data);
    req.end();
}

exports.triggers = function (callback) {
    auth(function() {
        getTriggers(callback);
    });
};
