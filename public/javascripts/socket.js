$(function(){
    var socket = io.connect(window.location.host),
        newTasks = 3;

    _.templateSettings = {
        interpolate : /\{\{(.+?)\}\}/g
    };

    socket
        .on("disconnect", raiseDisconnect)
        .on("connect_failed", raiseDisconnect)
        .on("error", raiseDisconnect)
        .on("reconnect_failed", raiseDisconnect)
        .on("reconnect", clearDisconnect)
        .on("connect", clearDisconnect)
        .on("newTasks", function (data) {
            showTasks(data, 'new', 3);
        })
        .on("overdueTasks", function (data) {
            showTasks(data, 'expired', 5 - newTasks);
        })
        .on("triggers", function (data) {
            showTriggers(data);
        })
        .on("taskCounter", function (data) {
            showTaskCounter(data);
        });

    function pad(n) {
        return n < 10 ? '0' + n : n
    }

    function raiseDisconnect() {
        $(".site-name").addClass("disconnected");
        soundAlert();
    }

    function soundAlert() {
        $(".error-sound")[0].play();
    }

    function clearDisconnect() {
        $(".site-name").removeClass("disconnected");
    }

    function printDate(date) {

        return pad(date.getDate()) + "."
            + pad(date.getMonth()) + "."
            + date.getFullYear() + " в "
            + pad(date.getHours()) + ":"
            + pad(date.getMinutes())
    }

    function timeDelta(date) {
        var now = new Date().getTime(),
            delta = (now - date) / 1000,
            diff_days = Math.floor(delta / 86400),
            diff_hours = Math.floor(delta / 3600),
            diff_minutes = Math.floor(delta / 60),
            result;

        diff_hours = diff_hours - 24 * diff_days;
        diff_minutes = diff_minutes - (24 * 60 * diff_days) - (60 * diff_hours);
        result = pad(diff_hours) + ":" + pad(diff_minutes);

        if (diff_days) {
            result = diff_days + "дн. " + result;
        }

        return result;
    }

    function updateClock() {
        var timer = $('.current-time'),
            date = new Date();

        timer.html(pad(date.getHours()) + ':' + pad(date.getMinutes()));
    }

    function getCounters(data, level, oldvalue) {
        var value = data.filter(function(elem) {return elem.priority == level}).length;

        if (parseInt(oldvalue) < value && level > 3) {
            soundAlert();
        }

        return value;
    }

    function showTasks(data, type, count) {
        var counter = $('.tasks-counter .' + type + ' .counter'),
            template = _.template('<li><span class="id">{{ id }}</span><p>{{ subject }}</p><p class="additional"><span class="place">{{ location }}</span><time>{{ date }}</time></p></li>'),
            container = $('.' + type + '-tasks-data'),
            html = '';

        data.forEach(function(elem, index) {
            if (index < count) {
                var date = new Date(Date.parse(elem.DesiredResolutionDate));
                html += template({
                    id: elem.IncidentID,
                    subject: elem.Subject,
                    location: elem.LocationID,
                    date: isNaN(date) ? '' : printDate(date)
                });
            }
        });

        if (type === 'new') {
            newTasks = data.length > 3 ? 3 : data.length;
        }

        counter.text(data.length);
        container.html(html);
        updateClock();
    }

    function showTriggers(data) {
        var counters = {},
            template = _.template('<li class="{{ type }}"><span class="device">{{ host }}</span><time>{{ time }}</time><p>{{ description }}</p></li>'),
            container = $('.triggers-data'),
            types = [
                'not-classified',
                'not-classified',
                'warning',
                'average',
                'high',
                'disaster'
            ],
            html = '';

        counters['disaster'] = $('.triggers-counters .disaster .counter');
        counters['high'] = $('.triggers-counters .high .counter');
        counters['average'] = $('.triggers-counters .average .counter');

        counters.disaster.text(function(index, text) {
            return getCounters(data, 5, text);
        });
        counters.high.text(function(index, text) {
            return getCounters(data, 4, text);
        });
        counters.average.text(function(index, text) {
            return getCounters(data, 3, text);
        });

        data.sort(function(a, b) {
            if(a.priority < b.priority) {
                return 1;
            }
            if (a.priority > b.priority) {
                return -1;
            }
            if (a.priority == b.priority) {
                if (a.lastchange > b.lastchange) {
                    return -1
                }
                if (a.lastchange < b.lastchange) {
                    return 1
                }
                return 0;
            }
        });

        data.filter(function(elem, index) {return index < 4}).forEach(function(elem, index) {
            html += template({
                type: types[elem.priority],
                host: elem.hostname,
                description:  elem.description,
                time: timeDelta(elem.lastchange * 1000)
            })
        });

        container.html(html);
    }

    function showTaskCounter(data) {
        var counter = $('.tasks-counter .total .counter').text(0);

        data.filter(function(elem, index) {return elem.StatusID <=64}).forEach(function(elem, index) {
            counter.text(+counter.text() + elem.IncidentCount);
        });
    }
});