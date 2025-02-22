
var refreshIntervalId = 0;
const INTERVAL = 20000;

$(document).ready(function () {

    setImage();
    countdown();
    renderOddsLive();
    getPlayersData();
    bindRatings();
    addRatingChangeListener();

    if (isInplay()) {

        setOddsTimer(INTERVAL);  // 30 seconds
    }


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
    });

    $('#buttonRating').bind('click', function () {
        playerRatingUpdate();
    });
    
});

function getColor() {
    const colors = ["#FF66FF", "#FF6633", "#FF3300", "#66CC00", "#66FF00", "#FFCC00", "#FF3300", "#9900FF"];
    var max = colors.length;
    var index = Math.random() * max | 0;
    return colors[index];
}

function setImage() {     

    $("#img_status").attr("src", "");

    if (isUpcoming()) {
        $("#img_status").attr("src", "../images/upcoming.jpg");
    }
    else if (isInplay()) { // inplay
        $("#img_status").attr("src", "../images/inplay.jpg");        
    }
    else {
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
function setOddsTimer(interval) {

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


    if (eventids.length <= 0) {

        print('No events are inplay.');
        clearInterval(refreshIntervalId);
        // no tennis events are inplay
    }

    else {
            $.ajax({
                type: "POST",
                url: "/odds",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(eventids),
                success: function (result) {
                   // print(result);
                    if (result && result.length > 0) {                
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

}

function bindOdds(oddsdata) {

    var color = getColor();

    for (var key in oddsdata)
    {
        var odds = oddsdata[key];
        var eventid = odds.eventid;
        var odd1 = odds.odd1;
        var odd2 = odds.odd2;
        
        var $odds = $(".odds");
        $odds.each(function (i, current) {

            var eventid_ = $(current).attr('id');

            if (eventid_ == eventid + '.1') {                
                $(current).text(odd1);
                $(current).css('color', color);
            }

            else if (eventid_ == eventid + '.2') {                
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
        var eventTime = timestamp; 
        var currentTime = Math.floor(Date.now() / 1000);
        var diffTime = eventTime - currentTime;
        var duration = moment.duration(diffTime * 1000, 'milliseconds');
        setHours(duration, $(current));
    });
}

function setHours(duration, element) {

    element.text('');
    var interval = 1000; // 1 secondss
    
    setInterval(function () {

        duration = moment.duration(duration - interval, 'milliseconds');

        var hours = duration.hours();
        var minutes = duration.minutes();
        var seconds = duration.seconds();

        if (parseInt(hours) < 0 || parseInt(minutes) < 0 || parseInt(seconds) < 0) {

            element.text(Math.abs(hours) + ":" + Math.abs(minutes) + ":" + Math.abs(seconds));
        }
        else {
            element.text(hours + ":" + minutes + ":" + seconds);
        }
    }, interval);
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

async function renderFlag(cc, playerid) {

    
    var $flags = $(".flag");
    var flagcountry = String(cc).toUpperCase();
    var flagurl = 'https://flagsapi.com/' + flagcountry + '/flat/64.png';
    var found = false;
    var img = null;

    if (flagcountry.length == 2) {
        
        $flags.each(function (i, current) {

            var pid = parseInt($(current).attr('pid'));

            if (pid == playerid)
            {
                //console.log(flagurl);                
                $(current).attr('src', flagurl);             
            }
        });
    }

}

async function renderPlayer(data) {

    for (var i = 0; i < data.length; i++) {

        var current = data[i];
        var playerid = parseInt(current.id);
        var playername = current.name;
        var playercountry = current.country;
        var playerranking = current.ranking;
        var playercc = current.cc;

        //console.log(current);

        var $players = $(".player");

        $players.each(function (i, current) {

            var pid = parseInt($(current).attr('pid'));
            var ptext = playername + ' (' + playercountry + ' | ' + playerranking + ')';
            //console.log(ptext);
            if (pid == playerid) {
                renderFlag(playercc, playerid);
                $(current).text(ptext);
            }
        });
    }
}
async function getPlayersData() {

    $("#lastupdate").text(moment().format('YYYY-MM-DD HH:mm:ss'));

    $.getJSON("/players", function (data) {

        var data0 = data[0];  // male player ranking data
        var data1 = data[1]; // female player ranking data

        //console.log(data);

        renderPlayer(data0);
        renderPlayer(data1);

        // Process the JSON data here
       

    }).fail(function () {
        console.log("An error has occurred.");
    });

}


async function addRatingChangeListener() {
    var $ratings = $('jsuites-rating');

    $ratings.each(function (i, current) {
        var pid = parseInt($(current).attr('id'));

        // Add eventlistener for when the rating changes
        current.addEventListener('onchange', function () {
            var new_rating = parseInt(current.rating.options.value);            
            var data = [];
            data.push({
                id: pid,
                rating: new_rating
            });
            playerRatingUpdate(data);
        })
    });
}
    
// write this method to set player rating upon loading the page
async function setPlayerRating(id, newrating) {

    var $ratings = $('jsuites-rating');

    $ratings.each(function (i, current) {

        var playerid = current.id;
        if (playerid == id) {

          
            //$(current).attr('value') = newrating;
            console.log(current);
            //const current_rating = parseInt($(current).attr('value'));
            //console.log(current_rating);
            //console.log('player ' + id + ' rating     old #' + current_rating + '      new #' + newrating);

            

        }
    });
}

async function bindRatings() {

    $.getJSON("/rating", function (data) {

        const player_ratings = data;

        for (var key in data) {
            var player = data[key];

            setPlayerRating(player.id, player.rating);
        }
    });
}

async function playerRatingUpdate(data) {

   // alert('player ' + data[0].id + ' has new rating ' + data[0].rating);

    $.ajax({
        type: "POST",
        url: "/rating",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(data),
        success: function (result) {
             print(result);           
        },
        error: function (XMLHttpRequest, textStatus, error) {
            print(error);
        }
    });
}