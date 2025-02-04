
$(document).ready(function () {


    $('#buttonInplay').bind('click', function () {
        var url = '/0';
        document.location.href = url;

        //$.ajax({
        //    type: "GET",
        //    url: '/index',
        //    data: { id = 0 },

        //    success: function (data) {
        //        alert('reloaded inplay matches');
        //        console.log(data);
        //    },

        //    error: function (data) {
        //        console.log(data);
        //    },
        //});

            
        //fetch(url, { method: 'GET' })
        //        .then(function (response) {
        //            if (response.ok) {                        
        //                alert('reloaded inplay matches');
        //                return;
        //            }
        //            throw new Error('Request failed.');
        //        })
        //        .catch(function (error) {
        //            console.log(error);
        //            alert(error);
        //        });

    });


    $('#buttonUpcoming').bind('click', function () {
               
        var url = '/1';
        document.location.href = url;
       

        //$.ajax({
        //    type: "GET",
        //    url: '/index',
        //    data: { id = 1 },

        //    success: function (data) {
        //        alert('reloaded upcming matches');
        //        console.log(data);
        //    },

        //    error: function (data) {
        //        console.log(data);
        //    },
        //});

        //fetch(url, { method: 'GET' })
        //    .then(function (response) {
        //        if (response.ok) {                    
        //            alert('reloaded upcoming matches');
        //            return;
        //        }
        //        throw new Error('Request failed.');
        //    })
        //    .catch(function (error) {
        //        console.log(error);
        //        alert(error);
        //    });

    });
   
});
