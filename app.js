document.getElementById("start").addEventListener("click", function(){
    let location = window.location.href;
    let localLocation = location.substring(location.indexOf("/", 7), location.length)
    window.location.assign("https://api.digikey.com/v1/oauth2/authorize?response_type=code&client_id=" + document.getElementById("clientId").value + "&redirect_uri=" + encodeURIComponent("https://google.com"))
})