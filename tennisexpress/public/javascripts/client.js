
var refreshIntervalId = 0;

const INTERVAL = 20000;

$(document).ready(function () {

    $('#buttonInplay').bind('click', function () {
        $("#img_status").attr("src", "")
        var url = '/0';
        document.location.href = url;
    });


    $('#buttonUpcoming').bind('click', function () {
        $("#img_status").attr("src", "")
        var url = '/1';
        document.location.href = url;     

    });

    $('#buttonOdds').bind('click', function () {

        renderOddsLive();
        //var url = '/';
        //document.location.href = url
    });

    setImage();
    countdown();
    renderOddsLive();

    if (isInplay()) {
       
        refereshOdds(INTERVAL);  // 30 seconds
    }
});

function setImage() {     

    if (isUpcoming()) {
        $("#img_status").attr("src", "../images/upcoming.jpg");
    }
    else if (isInplay()) { // inplay
        $("#img_status").attr("src", "../images/inplay.jpg");
        refereshOdds(10000);
    }
    else {

        $("#img_status").attr("src", "");
        $("#img_status").attr("src", "../images/upcoming.jpg");
    }
}

function isUpcoming() {
        
    var url = String(window.location);    
    return url.endsWith('1');
}

function isInplay() {
    var url = String(window.location);
    return url.endsWith('0');
}

function refereshOdds(interval) {

    if (refreshIntervalId > 0) {
        clearInterval(refreshIntervalId);
    }

    refreshIntervalId = setInterval(function () {
        renderOddsLive();
    }, interval);
}
function renderOddsLive() {

    $("#lastupdate").text(moment().format('YYYY-MM-DD HH:mm:ss'));
    
    var $timestamps = $(".timestamp");
    var eventids = [];

    $timestamps.each(function (i, current) {
        var eventid = $(current).attr('eventid');
        eventids.push(parseInt(eventid));
    });
       

    $.ajax({
        type: "POST",
        url: "/odds",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(eventids),
        success: function (result) {
            if (result && result.length > 0) {
                //print(result);
                bindOdds(result);
            }
            else {
                print('POST failed : Too many requests to BETS API.');
                clearInterval(refreshIntervalId);
            }
        },
        error: function (XMLHttpRequest, textStatus, error) {
            print(error);
        }
    });

}
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function bindOdds(oddsdata) {

    var color = getRandomColor();

    for (var key in oddsdata)
    {
        var odds = oddsdata[key];
        var eventid = odds.eventid;
        var odd1 = odds.odd1;
        var odd2 = odds.odd2;
        
        var $odds = $(".odds");
        $odds.each(function (i, current) {

            var eventid_ = $(current).attr('id');
            
            //print(eventid_);
            if (eventid_ == eventid + '.1') {
                //console.log(odd1);
                $(current).text(odd1);
                $(current).css('color', color);
            }

            else if (eventid_ == eventid + '.2') {
                //console.log(odd2);
                $(current).text(odd2);
                $(current).css('color', color);
            }
        });
    };
}
function countdown() {
    var $timestamps = $(".timestamp");

    $timestamps.each(function (i, current) {
        var timestamp = $(current).attr('id');
        //var text = $(current).text();
        var eventTime = timestamp; 
        var currentTime = Math.floor(Date.now() / 1000);
        var diffTime = eventTime - currentTime;
        var duration = moment.duration(diffTime * 1000, 'milliseconds');
        var interval = 1000;

        //print(currentTime);
        $(current).text('');

        if (duration) {
            setInterval(function () {

                duration = moment.duration(duration - interval, 'milliseconds');

                var hours = duration.hours();
                var minutes = duration.minutes();
                var seconds = duration.seconds();

                if (parseInt(hours) < 0 || parseInt(minutes) < 0) {
                    
                    $(current).text(Math.abs(hours) + ":" + Math.abs(minutes) + ":" + Math.abs(seconds));
                }
                else {
                    $(current).text(duration.hours() + ":" + duration.minutes() + ":" + duration.seconds());
                }
            }, interval);
        }

    });
}

function print(str)
{
    var consoletext = $('#console').text();

    if (typeof str == 'string') {
    
        $('#console').text(consoletext + ' ' + str + ' ');
    }
    else if (typeof str == 'object') 
        {
            var obj = str;
            var str1 = JSON.stringify(obj);
            str1 = JSON.stringify(obj, null, 4); // (Optional) beautiful indented output.            
            $('#console').text(consoletext + ' ' + str1 + ' ');
        }
}