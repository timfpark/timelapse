var nitrogen = require('nitrogen')
  , SunCalc = require('suncalc');

var session;
var params;
var checkInterval;

// TODO: parameterize all of these
var LATITUDE = 36.972;
var LONGITUDE =  -122.0263;

var SHOTS_PER_DAY = 20;

var currentShots = {};

function fetchCurrentShots(callback) {
    currentShots = {};

    nitrogen.Message.find(session, { type: 'cameraCommand', to: params.camera_id }, {}, function(err, commands) {
        if (err) return callback(err);

        commands.forEach(function(cameraCommand) {
            currentShots[cameraCommand.ts.toString()] = cameraCommand;
        });

        return callback();
    });
}

function setupShots() {
    SunCalc.addTime(0.0, 'sunrise', 'sunset');
}

function checkShot(shotTime, shotTag) {
    console.log(shotTime.toString());

    if (!currentShots[shotTime.toString()]) {
        // expire the camera command if not taken within 15 minutes. 
        var expireTime = new Date(shotTime.getTime() + 15 * 60 * 1000);

        var cmd = new nitrogen.Message({
              to: params.camera_id,
              type: 'cameraCommand',
              ts: shotTime,
              expires: expireTime,
              body: {
                  command: 'snapshot',
                  message: {
                      tags: [shotTag]
                  }
              }
        });

        session.log.info('adding shot at: ' + cmd.ts.toString());
        cmd.send(session);
    } else {
        session.log.info('already have shot at: ' + shotTime.toString());        
    }
}

function checkShotsDaysOut(daysOut) {
    var date = new Date();
    date.setDate(new Date().getDate() + daysOut);

    var times = SunCalc.getTimes(date, LATITUDE, LONGITUDE);

    console.log('sunrise: ' + times['sunrise']);
    console.log('sunset: ' + times['sunset']);

    var difference = times['sunset'].getTime() - times['sunrise'].getTime();

    console.log('difference: ' + difference);

    var shotIncrement = difference / SHOTS_PER_DAY;

    for (var shot=0; shot <= SHOTS_PER_DAY; shot++) {  
        var shotTime = new Date(times['sunrise'].getTime() + shotIncrement * shot);
        checkShot(shotTime, 'timelapse');
    }
}

function checkShots() {
    var daysOut;

    session.log.info("checking shots");

    fetchCurrentShots(function(err) {
        if (err) return session.log.error('fetching current shots failed: ' + err);

        for (daysOut=0; daysOut <= 1; daysOut++) {
            checkShotsDaysOut(daysOut);
        }
    });
}

var start = function(s, p) {
    session = s;  
    params = p;

    ['camera_id'].forEach(function(key) {
        if (!params[key]) {
            session.log.error('required parameter ' + key +' not supplied.');
            return process.exit(0);            
        }
    });

    setupShots();
    
    checkShots();
    checkInterval = setInterval(checkShots, 24 * 60 * 60 * 1000);
};

var stop = function() {
    clearInterval(checkInterval);
}

module.exports = {
    start: start,
    stop: stop
}
