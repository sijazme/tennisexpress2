
$(document).ready(function () {

    $('#buttonInplay').bind('click', function () {
        var url = '/0';
        document.location.href = url;
    });


    $('#buttonUpcoming').bind('click', function () {
               
        var url = '/1';
        document.location.href = url;     

    });

    $('#buttonOdds').bind('click', function () {

        var url = '/';
        document.location.href = url
    });

    countdown();
    getOddsLive();
   
});

function getOddsLive() {

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
            alert('success');
        },
        error: function (XMLHttpRequest, textStatus, error) {
            alert(error);
        }
    });

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

        if (duration) {
            setInterval(function () {

                duration = moment.duration(duration - interval, 'milliseconds');

                var hours = duration.hours();
                var minutes = duration.minutes();
                var seconds = duration.seconds();

                if (parseInt(seconds) < 0) {
                    $(current).text('');
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
    else {        
        var obj = str;
        for (var key in obj) {
            $('#console').text(consoletext + ' ' + obj[key] + ' ');
        }
    }
}