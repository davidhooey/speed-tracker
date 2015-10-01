var sqlite3   = require('sqlite3').verbose();
var speedTest = require('speedtest-net');
var moment    = require('moment');
var CronJob   = require('cron').CronJob;

var job = new CronJob({
    cronTime: '00,15,30,45 * * * *',
    onTick: function() {
        // Runs every 15 minutes

        var testSpeed = speedTest({
            maxTime:5000,
            maxServers: 2
        });

        testSpeed.on('data', function(speedData) {
            // {
            //    speeds:
            //    {
            //      download: 6.108,
            //      upload: 0.88
            //    }
            //    client:
            //    {
            //      ip: '23.239.38.173',
            //      isp: 'Xplornet Communications'
            //    }
            //    server:
            //    {
            //      host: 'www.wtccommunications.ca',
            //      location: 'Kingston, ON',
            //      country: 'Canada',
            //      distance: 36.44,
            //      ping: 104.4,
            //    }
            // }

            var db = new sqlite3.Database('speed-tracker.db');

            db.serialize(function() {

                db.run('create table if not exists speed_tracker \
                        ( \
                            id              integer primary key, \
                            run_at          timestamp, \
                            ping            real, \
                            download        real, \
                            upload          real, \
                            client_ip       varchar(64), \
                            client_isp      varchar(64), \
                            server_host     varchar(64), \
                            server_location varchar(64), \
                            server_country  varchar(64), \
                            server_distance real \
                        )'
                );

                var stmt = db.prepare('insert into speed_tracker \
                                        ( \
                                            run_at, \
                                            ping, \
                                            download, \
                                            upload, \
                                            client_ip, \
                                            client_isp, \
                                            server_host, \
                                            server_location, \
                                            server_country, \
                                            server_distance \
                                        ) \
                                        values \
                                            (?,?,?,?,?,?,?,?,?,?)'
                );

                stmt.run(
                    moment().format('YYYY-MM-DD HH:mm:ss'),
                    speedData['server']['ping'],
                    speedData['speeds']['download'],
                    speedData['speeds']['upload'],
                    speedData['client']['ip'],
                    speedData['client']['isp'],
                    speedData['server']['host'],
                    speedData['server']['location'],
                    speedData['server']['country'],
                    speedData['server']['distance']
                );

                stmt.finalize();
            });

            db.close();
        });
    },
    start: true
});
