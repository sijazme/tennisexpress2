
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

        
        alert("call to odds service " + oddsdata != null);

        //$.ajax({
        //    method: 'GET',
        //    url: '/',
        //    data: { oddsdata },
        //    headers: { }
        //}).done(() =>
        //{
            
        //    console.log(oddsdata);
            
        //    // window.location.href='/about';

        //}).catch(e => console.log('ajax error'));

    });

   
});
