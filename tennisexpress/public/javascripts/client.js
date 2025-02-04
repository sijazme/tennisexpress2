
$(document).ready(function () {


    $('#buttonInplay').bind('click', function () {        
            
            fetch('/', { method: 'GET' })
                .then(function (response) {
                    if (response.ok) {                        
                        alert('reloaded inplay matches');
                        return;
                    }
                    throw new Error('Request failed.');
                })
                .catch(function (error) {
                    console.log(error);
                    alert(error);
                });

    });


    $('#buttonUpcoming').bind('click', function () {
        
        fetch('/', { method: 'GET' })
            .then(function (response) {
                if (response.ok) {                    
                    alert('reloaded upcoming matches');
                    return;
                }
                throw new Error('Request failed.');
            })
            .catch(function (error) {
                console.log(error);
                alert(error);
            });

    });
   
});
