$(document).ready(function () {

    renderHtml();

    $.getScript("/javascripts/client.js", function () {
        alert('client script loaded');
        initPage();

    });
    
});


function renderHtml() {

    fetch('/index')
        .then((response) => {
            return response.text();
        })
        .then((html) => {
            var contentDiv = $("#modal-content");
            
            contentDiv.html(html);
        });
}