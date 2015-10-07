# Speed Tracker

 A Node script to collect SpeedTest.net internet speeds in a local SQLite
 database.


## Usage

1. Install Node

2. Install SQLite

3. Install Node packages

    ```
    npm install
    ```

4. Adjust the CronTime in `speed_tracker.js` to indicate when to collect
   speed data. Default is every 15 minutes.

5. Run speed tracker.

    ```
    node speed-tracker.js &
    ```


## Speed Tracker Database

A `speed-tracker.db` SQLite database is created to store speed test data.

##### Schema

```sql
create table speed_tracker
(
    id              integer primary key,
    run_at          timestamp,
    ping            real,
    download        real,
    upload          real,
    client_ip       varchar(64),
    client_isp      varchar(64),
    server_host     varchar(64),
    server_location varchar(64),
    server_country  varchar(64),
    server_distance real
);
```

##### Querying

```
sqlite3 speed-tracker.db
```

```sql
-- Average Speeds
select
    round(avg(download),2) avg_download,
    round(avg(upload),2) avg_upload,
    round(avg(ping),2) avg_ping
from
    speed_tracker;
```

```sql
-- Averge Speeds Per Hour Of Day
select
    substr(run_at, 12, 2) hour,
    round(avg(download),2) avg_download,
    round(avg(upload),2) avg_upload,
    round(avg(ping),2) avg_ping
from
    speed_tracker
group by
    substr(run_at, 12, 2)
order by
    hour;
```
