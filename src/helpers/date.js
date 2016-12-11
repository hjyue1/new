var dateHelper = {

    mktime: function () {
        //  discuss at: http://phpjs.org/functions/mktime/
        // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // improved by: baris ozdil
        // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // improved by: FGFEmperor
        // improved by: Brett Zamir (http://brett-zamir.me)
        //    input by: gabriel paderni
        //    input by: Yannoo
        //    input by: jakes
        //    input by: 3D-GRAF
        //    input by: Chris
        // bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // bugfixed by: Marc Palau
        // bugfixed by: Brett Zamir (http://brett-zamir.me)
        //  revised by: Theriault
        //        note: The return values of the following examples are
        //        note: received only if your system's timezone is UTC.
        //   example 1: mktime(14, 10, 2, 2, 1, 2008);
        //   returns 1: 1201875002
        //   example 2: mktime(0, 0, 0, 0, 1, 2008);
        //   returns 2: 1196467200
        //   example 3: make = mktime();
        //   example 3: td = new Date();
        //   example 3: real = Math.floor(td.getTime() / 1000);
        //   example 3: diff = (real - make);
        //   example 3: diff < 5
        //   returns 3: true
        //   example 4: mktime(0, 0, 0, 13, 1, 1997)
        //   returns 4: 883612800
        //   example 5: mktime(0, 0, 0, 1, 1, 1998)
        //   returns 5: 883612800
        //   example 6: mktime(0, 0, 0, 1, 1, 98)
        //   returns 6: 883612800
        //   example 7: mktime(23, 59, 59, 13, 0, 2010)
        //   returns 7: 1293839999
        //   example 8: mktime(0, 0, -1, 1, 1, 1970)
        //   returns 8: -1

        var d = new Date(),
            r = arguments,
            i = 0,
            e = ['Hours', 'Minutes', 'Seconds', 'Month', 'Date', 'FullYear'];

        for (i = 0; i < e.length; i++) {
            if (typeof r[i] === 'undefined') {
                r[i] = d['get' + e[i]]();
                r[i] += (i === 3); // +1 to fix JS months.
            } else {
                r[i] = parseInt(r[i], 10);
                if (isNaN(r[i])) {
                    return false;
                }
            }
        }

        // Map years 0-69 to 2000-2069 and years 70-100 to 1970-2000.
        r[5] += (r[5] >= 0 ? (r[5] <= 69 ? 2e3 : (r[5] <= 100 ? 1900 : 0)) : 0);

        // Set year, month (-1 to fix JS months), and date.
        // !This must come before the call to setHours!
        d.setFullYear(r[5], r[3] - 1, r[4]);

        // Set hours, minutes, and seconds.
        d.setHours(r[0], r[1], r[2]);

        // Divide milliseconds by 1000 to return seconds and drop decimal.
        // Add 1 second if negative or it'll be off from PHP by 1 second.
        return (d.getTime() / 1e3 >> 0) - (d.getTime() < 0);
    },


    /**
     * timestemp to yyyy-mm-dd
     * @param timestemp string
     * */
    timeFormat: function (timestemp/*string*/, type) {

        var date = new Date(timestemp * 1000),
            yyyy = date.getFullYear(),
            mm = date.getMonth() + 1,
            dd = date.getDate();
        mm = mm < 10 && type !== 1 ? '0' + mm : mm;
        dd = dd < 10 && type !== 1 ? '0' + dd : dd;
        if (type == 1)    return yyyy + '年' + mm + '月' + dd + '日';
        return yyyy + '-' + mm + '-' + dd;
    },


    date: function (format, timestamp) {
        //  discuss at: http://phpjs.org/functions/date/
        // original by: Carlos R. L. Rodrigues (http://www.jsfromhell.com)
        // original by: gettimeofday
        //    parts by: Peter-Paul Koch (http://www.quirksmode.org/js/beat.html)
        // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // improved by: MeEtc (http://yass.meetcweb.com)
        // improved by: Brad Touesnard
        // improved by: Tim Wiel
        // improved by: Bryan Elliott
        // improved by: David Randall
        // improved by: Theriault
        // improved by: Theriault
        // improved by: Brett Zamir (http://brett-zamir.me)
        // improved by: Theriault
        // improved by: Thomas Beaucourt (http://www.webapp.fr)
        // improved by: JT
        // improved by: Theriault
        // improved by: Rafał Kukawski (http://blog.kukawski.pl)
        // improved by: Theriault
        //    input by: Brett Zamir (http://brett-zamir.me)
        //    input by: majak
        //    input by: Alex
        //    input by: Martin
        //    input by: Alex Wilson
        //    input by: Haravikk
        // bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // bugfixed by: majak
        // bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // bugfixed by: Brett Zamir (http://brett-zamir.me)
        // bugfixed by: omid (http://phpjs.org/functions/380:380#comment_137122)
        // bugfixed by: Chris (http://www.devotis.nl/)
        //        note: Uses global: php_js to store the default timezone
        //        note: Although the function potentially allows timezone info (see notes), it currently does not set
        //        note: per a timezone specified by date_default_timezone_set(). Implementers might use
        //        note: this.php_js.currentTimezoneOffset and this.php_js.currentTimezoneDST set by that function
        //        note: in order to adjust the dates in this function (or our other date functions!) accordingly
        //   example 1: date('H:m:s \\m \\i\\s \\m\\o\\n\\t\\h', 1062402400);
        //   returns 1: '09:09:40 m is month'
        //   example 2: date('F j, Y, g:i a', 1062462400);
        //   returns 2: 'September 2, 2003, 2:26 am'
        //   example 3: date('Y W o', 1062462400);
        //   returns 3: '2003 36 2003'
        //   example 4: x = date('Y m d', (new Date()).getTime()/1000);
        //   example 4: (x+'').length == 10 // 2009 01 09
        //   returns 4: true
        //   example 5: date('W', 1104534000);
        //   returns 5: '53'
        //   example 6: date('B t', 1104534000);
        //   returns 6: '999 31'
        //   example 7: date('W U', 1293750000.82); // 2010-12-31
        //   returns 7: '52 1293750000'
        //   example 8: date('W', 1293836400); // 2011-01-01
        //   returns 8: '52'
        //   example 9: date('W Y-m-d', 1293974054); // 2011-01-02
        //   returns 9: '52 2011-01-02'

        var that = this;
        var jsdate, f;
        // Keep this here (works, but for code commented-out below for file size reasons)
        // var tal= [];
        var txt_words = [
            'Sun', 'Mon', 'Tues', 'Wednes', 'Thurs', 'Fri', 'Satur',
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        // trailing backslash -> (dropped)
        // a backslash followed by any character (including backslash) -> the character
        // empty string -> empty string
        var formatChr = /\\?(.?)/gi;
        var formatChrCb = function (t, s) {
            return f[t] ? f[t]() : s;
        };
        var _pad = function (n, c) {
            n = String(n);
            while (n.length < c) {
                n = '0' + n;
            }
            return n;
        };
        f = {
            // Day
            d: function () {
                // Day of month w/leading 0; 01..31
                return _pad(f.j(), 2);
            },
            D: function () {
                // Shorthand day name; Mon...Sun
                return f.l()
                    .slice(0, 3);
            },
            j: function () {
                // Day of month; 1..31
                return jsdate.getDate();
            },
            l: function () {
                // Full day name; Monday...Sunday
                return txt_words[f.w()] + 'day';
            },
            N: function () {
                // ISO-8601 day of week; 1[Mon]..7[Sun]
                return f.w() || 7;
            },
            S: function () {
                // Ordinal suffix for day of month; st, nd, rd, th
                var j = f.j();
                var i = j % 10;
                if (i <= 3 && parseInt((j % 100) / 10, 10) == 1) {
                    i = 0;
                }
                return ['st', 'nd', 'rd'][i - 1] || 'th';
            },
            w: function () {
                // Day of week; 0[Sun]..6[Sat]
                return jsdate.getDay();
            },
            z: function () {
                // Day of year; 0..365
                var a = new Date(f.Y(), f.n() - 1, f.j());
                var b = new Date(f.Y(), 0, 1);
                return Math.round((a - b) / 864e5);
            },

            // Week
            W: function () {
                // ISO-8601 week number
                var a = new Date(f.Y(), f.n() - 1, f.j() - f.N() + 3);
                var b = new Date(a.getFullYear(), 0, 4);
                return _pad(1 + Math.round((a - b) / 864e5 / 7), 2);
            },

            // Month
            F: function () {
                // Full month name; January...December
                return txt_words[6 + f.n()];
            },
            m: function () {
                // Month w/leading 0; 01...12
                return _pad(f.n(), 2);
            },
            M: function () {
                // Shorthand month name; Jan...Dec
                return f.F()
                    .slice(0, 3);
            },
            n: function () {
                // Month; 1...12
                return jsdate.getMonth() + 1;
            },
            t: function () {
                // Days in month; 28...31
                return (new Date(f.Y(), f.n(), 0))
                    .getDate();
            },

            // Year
            L: function () {
                // Is leap year?; 0 or 1
                var j = f.Y();
                return j % 4 === 0 & j % 100 !== 0 | j % 400 === 0;
            },
            o: function () {
                // ISO-8601 year
                var n = f.n();
                var W = f.W();
                var Y = f.Y();
                return Y + (n === 12 && W < 9 ? 1 : n === 1 && W > 9 ? -1 : 0);
            },
            Y: function () {
                // Full year; e.g. 1980...2010
                return jsdate.getFullYear();
            },
            y: function () {
                // Last two digits of year; 00...99
                return f.Y()
                    .toString()
                    .slice(-2);
            },

            // Time
            a: function () {
                // am or pm
                return jsdate.getHours() > 11 ? 'pm' : 'am';
            },
            A: function () {
                // AM or PM
                return f.a()
                    .toUpperCase();
            },
            B: function () {
                // Swatch Internet time; 000..999
                var H = jsdate.getUTCHours() * 36e2;
                // Hours
                var i = jsdate.getUTCMinutes() * 60;
                // Minutes
                // Seconds
                var s = jsdate.getUTCSeconds();
                return _pad(Math.floor((H + i + s + 36e2) / 86.4) % 1e3, 3);
            },
            g: function () {
                // 12-Hours; 1..12
                return f.G() % 12 || 12;
            },
            G: function () {
                // 24-Hours; 0..23
                return jsdate.getHours();
            },
            h: function () {
                // 12-Hours w/leading 0; 01..12
                return _pad(f.g(), 2);
            },
            H: function () {
                // 24-Hours w/leading 0; 00..23
                return _pad(f.G(), 2);
            },
            i: function () {
                // Minutes w/leading 0; 00..59
                return _pad(jsdate.getMinutes(), 2);
            },
            s: function () {
                // Seconds w/leading 0; 00..59
                return _pad(jsdate.getSeconds(), 2);
            },
            u: function () {
                // Microseconds; 000000-999000
                return _pad(jsdate.getMilliseconds() * 1000, 6);
            },

            // Timezone
            e: function () {
                // Timezone identifier; e.g. Atlantic/Azores, ...
                // The following works, but requires inclusion of the very large
                // timezone_abbreviations_list() function.
                /*              return that.date_default_timezone_get();
                 */
                throw 'Not supported (see source code of date() for timezone on how to add support)';
            },
            I: function () {
                // DST observed?; 0 or 1
                // Compares Jan 1 minus Jan 1 UTC to Jul 1 minus Jul 1 UTC.
                // If they are not equal, then DST is observed.
                var a = new Date(f.Y(), 0);
                // Jan 1
                var c = Date.UTC(f.Y(), 0);
                // Jan 1 UTC
                var b = new Date(f.Y(), 6);
                // Jul 1
                // Jul 1 UTC
                var d = Date.UTC(f.Y(), 6);
                return ((a - c) !== (b - d)) ? 1 : 0;
            },
            O: function () {
                // Difference to GMT in hour format; e.g. +0200
                var tzo = jsdate.getTimezoneOffset();
                var a = Math.abs(tzo);
                return (tzo > 0 ? '-' : '+') + _pad(Math.floor(a / 60) * 100 + a % 60, 4);
            },
            P: function () {
                // Difference to GMT w/colon; e.g. +02:00
                var O = f.O();
                return (O.substr(0, 3) + ':' + O.substr(3, 2));
            },
            T: function () {
                return 'UTC';
            },
            Z: function () {
                // Timezone offset in seconds (-43200...50400)
                return -jsdate.getTimezoneOffset() * 60;
            },

            // Full Date/Time
            c: function () {
                // ISO-8601 date.
                return 'Y-m-d\\TH:i:sP'.replace(formatChr, formatChrCb);
            },
            r: function () {
                // RFC 2822
                return 'D, d M Y H:i:s O'.replace(formatChr, formatChrCb);
            },
            U: function () {
                // Seconds since UNIX epoch
                return jsdate / 1000 | 0;
            },
            R: function () {
                var now = new Date().getTime(),
                    offset = jsdate.getTime();

                if (now - offset < 300000) {
                    return _.i18n.get('date.just');
                } else {
                    return "Y-m-d".replace(formatChr, formatChrCb);
                }
            }
        };
        this.date = function (format, timestamp) {
            that = this;
            jsdate = (timestamp === undefined ? new Date() : // Not provided
                (timestamp instanceof Date) ? new Date(timestamp) : // JS Date()
                    new Date(timestamp * 1000) // UNIX timestamp (auto-convert to int)
            );
            return format.replace(formatChr, formatChrCb);
        };
        return this.date(format, timestamp);
    },

    getSameMonthBeginTimestamp: function (date) {
        return new Date(date.getFullYear(), date.getMonth(), 1).getTime();
    },

    getSameDayBeginTimestamp: function (date) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    },

    isSameYear: function (time1, time2) {
        return (time1.getFullYear() == time2.getFullYear());
    },

    isSameMonth: function (time1, time2) {
        return (time1.getMonth() == time2.getMonth()) && (time1.getYear() == time2.getYear());
    },

    isSameDay: function (time1, time2) {
        var isSameMonth = dateHelper.isSameMonth(time1, time2);
        if (!isSameMonth) {
            return false;
        }
        return time1.getDate() == time2.getDate()
    },

    isSameHour: function (time1, time2) {
        var isSameDay = dateHelper.isSameDay(time1, time2);
        if (!isSameDay) {
            return false;
        }

        time1 = typeof time1 == 'number' ? time1 * 1000 : time1.getTime();
        time2 = typeof time2 == 'number' ? time2 * 1000 : time2.getTime();
        return time2 - time1 <= 3600000;
    },

    /**
     * 对比两个时间， 判断一个时间是另一个时间的昨天
     * @param {date} time1 输入时间
     * @param {date} time2 相对的时间
     * @return {boolean}
     */
    isItsYesterday: function (time1, time2) {

        var timestamp1 = time1.getTime()
            , timestamp2 = time2.getTime()
            , day1 = time1.getDay()
            , day2 = time2.getDay()

        if ((timestamp2 - timestamp1) < 86400000 * 2 && ((day1 == 0 && day2 == 6) || (day2 - day1) == 1)) {
            return true;
        }

        return false;
    },
    /*
     *  判断时间是否是昨天,从昨天0点-今天0点.
     */
    isYesterday: function (time) {
        var today = new Date();
        today.setHours(0);
        today.setMinutes(0);
        today.setSeconds(0);
        today.setMilliseconds(0);
        var oneday = 1000 * 60 * 60 * 24;
        // 昨天
        var yesterday = new Date(today - oneday);
        if (time >= yesterday && time <= today) {
            return true;
        }
        return false;
    },

    /**
     * 判断两个时间是不是间隔在60s内
     * @param {mix} t1
     * @param {mix} t2
     * @return {boolean}
     */
    isMonmentAgo: function (t1, t2) {

        t1 = typeof t1 == 'number' ? t1 * 1000 : t1.getTime()
        t2 = typeof t2 == 'number' ? t2 * 1000 : t2.getTime()


        return t2 - t1 <= 60000
    },

    minutesFromNow: function (time1, time2) {
        time1 = typeof time1 == 'number' ? time1 : time1.getTime()
        time2 = typeof time2 == 'number' ? time2 : time2.getTime()
        return Math.round((time2 - time1) / 60000);
    },


    relative: function (time = new Date(), relative = new Date()) {
        time = typeof time == 'number' ? new Date(time * 1000) : time;
        relative = typeof relative == 'number' ? new Date(relative * 1000) : relative

        var timestamp = parseInt(time.getTime() / 1000)

        if (dateHelper.isMonmentAgo(time, relative)) {
            return '刚刚'
        } else if (dateHelper.isSameHour(time, relative)) {
            return dateHelper.minutesFromNow(time, relative) + '分钟前'
        } else if (dateHelper.isSameDay(time, relative)) {
            return '今天 ' + dateHelper.date('H:i', timestamp)
        } else if (dateHelper.isYesterday(time)) {
            return '昨天 ' + dateHelper.date('H:i', timestamp);
        } else if (dateHelper.isSameYear(time, relative)) {
            return dateHelper.date('m-d H:i', timestamp);
        } else {
            return dateHelper.date('Y-m-d', timestamp);
        }
    },

    relativeSimple: function (time = new Date(), relative = new Date()) {
        time = typeof time == 'number' ? new Date(time * 1000) : time;
        relative = typeof relative == 'number' ? new Date(relative * 1000) : relative

        var timestamp = parseInt(time.getTime() / 1000)

        if (dateHelper.isMonmentAgo(time, relative)) {
            return '刚刚'
        } else if (dateHelper.isSameHour(time, relative)) {
            return dateHelper.minutesFromNow(time, relative) + '分钟前'
        } else if (dateHelper.isSameDay(time, relative)) {
            return dateHelper.date('H:i', timestamp)
        } else if (dateHelper.isYesterday(time)) {
            return '昨天 '
        } else if (dateHelper.isSameYear(time, relative)) {
            return dateHelper.date('m月d日', timestamp);
        } else {
            return dateHelper.date('Y年m月d日', timestamp);
        }
    },

    relativeConversation: function (time = new Date(), relative = new Date()) {
        time = typeof time == 'number' ? new Date(time) : time;
        relative = typeof relative == 'number' ? new Date(relative * 1000) : relative

        var timestamp = parseInt(time.getTime() / 1000)

        if (dateHelper.isSameDay(time, relative)) {
            return dateHelper.date('H:i', timestamp)
        } else if (dateHelper.isYesterday(time)) {
            return '昨天 ' + dateHelper.date('H:i', timestamp);
        } else if (dateHelper.isSameYear(time, relative)) {
            return dateHelper.date('m-d H:i', timestamp);
        } else {
            return dateHelper.date('Y-m-d H:i', timestamp);
        }
    },

    relativeYearMonthDay: function (time = new Date(), relative = new Date()) {
        time = typeof time == 'number' ? new Date(time) : time;
        relative = typeof relative == 'number' ? new Date(relative * 1000) : relative

        var timestamp = parseInt(time.getTime() / 1000)
        return dateHelper.date('Y年m月d日', timestamp);
    }
}

module.exports = dateHelper
