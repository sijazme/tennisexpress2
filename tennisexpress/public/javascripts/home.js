$(document).ready(function () {

    //alert('home page loaded');
    renderHtml();
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