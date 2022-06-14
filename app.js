document.getElementById("start").addEventListener("click", function(){
    window.location.assign("https://api.digikey.com/v1/oauth2/authorize?response_type=code&client_id=" + document.getElementById("clientId").value + "&redirect_uri=" + encodeURIComponent("https://smansoccer.github.io/Digikey-API"))
})