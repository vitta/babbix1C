
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , io = require('socket.io')
  , servicedesk = require('./routes/servicedesk')
  , fs = require('fs')
  , zabbix = require('./routes/zabbix');

var app = express();

var logFile = fs.createWriteStream(__dirname + '/error.log', {flags: 'a'});


process.on('uncaughtException', function (err) {
        logFile.write('uncaughtException: ' + err.message);
        logFile.write(err.stack);
    }
);

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.logger({stream: logFile}));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

var socket = io.listen(server).set('log level', 1);

socket.sockets.on('connection', function (socket) {
    var newTasks = servicedesk.newTasks,
        overdueTasks = servicedesk.overdueTasks,
        taskCounter = servicedesk.taskCounter,
        triggers = zabbix.triggers;

    newTasks(function() {
        var that = arguments.callee,
            data = arguments[0];

        socket.emit("newTasks", data);
        setTimeout(function() {
            newTasks(that);
        }, 30000);
    });

    overdueTasks(function() {
        var that = arguments.callee,
            data = arguments[0];

        socket.emit("overdueTasks", data);
        setTimeout(function() {
            overdueTasks(that);
        }, 30000);
    });

    triggers(function() {
        var that = arguments.callee,
            data = arguments[0];

        socket.emit("triggers", data);
        setTimeout(function() {
            triggers(that);
        }, 30000);
    });

    taskCounter(function() {
        var that = arguments.callee,
            data = arguments[0];

        socket.emit("taskCounter", data);
        setTimeout(function() {
            taskCounter(that);
        }, 30000);
    });
});
