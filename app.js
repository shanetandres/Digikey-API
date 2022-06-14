let clientId;
let clientSecret;
let accessToken;
let allValues = [1.00, 1.02, 1.05, 1.07, 1.10, 1.13, 1.15, 1.18, 1.21, 1.24, 1.27, 1.30, 1.33, 1.37, 1.40, 1.43, 1.47, 1.50, 1.54, 1.58, 1.62, 1.65, 1.69, 1.74, 1.78, 1.82, 1.87, 1.91, 1.96, 2.00, 2.05, 2.10, 2.16, 2.21, 2.26, 2.32, 2.37, 2.43, 2.49, 2.55, 2.61, 2.67, 2.74, 2.80, 2.87, 2.94, 3.01, 3.09, 3.16, 3.24, 3.32, 3.40, 3.48, 3.57, 3.65, 3.74, 3.83, 3.92, 4.02, 4.12, 4.22, 4.32, 4.42, 4.53, 4.64, 4.75, 4.87, 4.99, 5.11, 5.23, 5.36, 5.49, 5.62, 5.76, 5.90, 6.04, 6.19, 6.34, 6.49, 6.65, 6.81, 6.98, 7.15, 7.32, 7.50, 7.68, 7.87, 8.06, 8.25, 8.45, 8.66, 8.87, 9.09, 9.31, 9.53, 9.76];
let allRKMValues = rkmList();
let userOutput = [];
let teststring;

window.addEventListener('load', function(){

    if(window.location.href.includes("&code=")){
        document.getElementById("idLabel").style.display = "none";
        document.getElementById("clientId").style.display = "none";
        document.getElementById("secretLabel").style.display = "none";
        document.getElementById("clientSecret").style.display = "none";
        document.getElementById("start").style.display = "none";

        clientId = document.getElementById("clientId").value;
        clientSecret = document.getElementById("clientSecret").value; //INSERT COOKIE MAGIC HERE TO GET THESE VALUES AFTER USER HAS COME BATH FROM INITAL AUTH
        let loc = window.location.href;
        beginAuth(loc.substring(loc.indexOf("&code=") + 6, loc.indexOf("&scope=")));
    }
    else{
        document.getElementById("formalLabel").style.display = "none";
        document.getElementById("linkFormat").style.display = "none";
        document.getElementById("decadeLabel").style.display = "none";
        document.getElementById("decade").style.display = "none";
        document.getElementById("go").style.display = "none";
        document.getElementById("outputLabel").style.display = "none";
        document.getElementById("output").style.display = "none";
        document.getElementById("toggle").style.display = "none";
    }
});

document.getElementById("start").addEventListener("click", function(){
    window.location.assign("https://api.digikey.com/v1/oauth2/authorize?response_type=code&client_id=" + document.getElementById("clientId").value + "&redirect_uri=" + encodeURIComponent("https://tinyurl.com/digikeyapi"))
});

document.getElementById("go").addEventListener("click", function() {
    let linkFormat = document.getElementById("linkFormat").value;
    let decade = document.getElementById("decade").value;

    if(linkFormat.includes("xxxx")) {
        for(let i = 96 * (decade - 1); i < 96 * (decade); i++) {
            linkMatcher3000(linkFormat.replace("xxxx", allRKMValues[i]), i);
            console.log(linkFormat.replace("xxxx", allRKMValues[i]), i)
        }
    }
    else {
        alert("Improper formatting uh oh");
    }
});

function beginAuth(authCode){
    console.log(clientId)

    let url = "https://api.digikey.com/v1/oauth2/token";

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url);

    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            console.log(xhr)
            authComplete(xhr);
        }
    };

    let data = "code=" + authCode + "&client_id=" + clientId.toString() +
        "&client_secret=" + clientSecret.toString() + "&grant_type=authorization_code&" +
        "redirect_uri=" + encodeURIComponent("https://tinyurl.com/digikeyapi")
    console.log(data)
    xhr.send(data);

}

function authComplete(e) {

    let new_access_token;
    let new_refresh_token;
    let access_token_timeout;
    let refresh_token_timeout;

    let access_token_endtime;
    let refresh_token_endtime;

    //<editor-fold desc= "Extracting info from the request response">
    let processing_text = e.responseText;
    processing_text = processing_text.substring(processing_text.indexOf('access_token\":\"') + String('access_token\":\"').length, processing_text.length);
    new_access_token = processing_text.substring(0, processing_text.indexOf('\",'));
    processing_text = processing_text.substring(processing_text.indexOf('\",'));

    processing_text = processing_text.substring(processing_text.indexOf('"refresh_token":"') + String('"refresh_token":"').length, processing_text.length);
    new_refresh_token = processing_text.substring(0, processing_text.indexOf('",'));
    processing_text = processing_text.substring(processing_text.indexOf('",'));

    processing_text = processing_text.substring(processing_text.indexOf('"expires_in":') + String('"expires_in":').length, processing_text.length);
    access_token_timeout = processing_text.substring(0, processing_text.indexOf(','));
    processing_text = processing_text.substring(processing_text.indexOf(','));

    processing_text = processing_text.substring(processing_text.indexOf('"refresh_token_expires_in":') + String('"refresh_token_expires_in":').length, processing_text.length);
    refresh_token_timeout = processing_text.substring(0, processing_text.indexOf(','));
    processing_text = processing_text.substring(processing_text.indexOf(','));
    //</editor-fold>

    accessToken = new_access_token;
    console.log("refresh timeout: " + refresh_token_timeout + "\naccess timeout: " + access_token_timeout + "\nrefresh token: " + new_refresh_token + "\naccess token: " + new_access_token);


}

function rkmList() {

    let output = []
    for(let decade = 10; decade <= 100000; decade *= 10){
        for(let index = 0; index < allValues.length; index ++){
            output.push(rkm(decade * allValues[index]));
        }
    }

    return output;

}


function rkm(input) {
    if(input < 100){
        return(String(Number(input).toFixed(1)).replace(".", "R"))
    }
    else if(input < 1000){
        return(String(Number(input).toFixed(0)) + "R")
    }
    else if(input < 10000){
        return(String(Number(input / 1000).toFixed(2)).replace(".", "K"))
    }
    else if(input < 100000){
        return(String(Number(input / 1000).toFixed(1)).replace(".", "K"))
    }
    else if(input < 1000000){
        return(String(Number(input / 1000).toFixed(0)) + "K")
    }
    else{
        return null;
    }
}

function linkMatcher3000(product, index){
    let url = "https://api.digikey.com/Search/v3/Products/" + product;

    let xhr = new XMLHttpRequest();
    xhr.open("GET", url);

    xhr.setRequestHeader("accept", "application/json");
    xhr.setRequestHeader("Authorization", "Bearer " + accessToken);
    xhr.setRequestHeader("X-DIGIKEY-Client-Id", clientId);

    xhr.onreadystatechange = function (){
        if (xhr.readyState === 4) {
            if ("ProductUrl" in JSON.parse(xhr.responseText)){
                userOutput[index] = JSON.parse(xhr.responseText).ProductUrl;
                console.log("lil dude #" + index + " is good!")
            }
            else{
                userOutput[index] = "ERROR";
                console.log("uh oh! we got a bit of trouble with #" + index)
            }
        }
    };

    xhr.send();
}