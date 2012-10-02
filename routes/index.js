/*
 * GET home page.
 */

var http = require('http');

exports.index = function (req, res) {
    res.render('index', {
        title:'Babbix',
        time: new Date().getHours() + ":" + new Date().getMinutes(),
        counts: {
            triggers: {
                disaster: 1,
                high: 4,
                average: 1
            },
            tasks: {
                expired: 2,
                new: 4,
                total: 43
            }
        }
    });
};


