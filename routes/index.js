/*
 * GET home page.
 */

var http = require('http');

exports.index = function (req, res) {
    res.render('index', {
        title:'Babbix',
        time: new Date().getHours() + ":" + new Date().getMinutes()
    });
};


