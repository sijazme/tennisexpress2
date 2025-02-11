
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

   
});
