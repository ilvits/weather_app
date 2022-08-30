function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}
function eraseCookie(name) {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}
var loc = JSON.stringify(
    {

        "panteleyki": { "name": "Пантелейки", "latitude": 55.6743, "longitude": 27.0192 },
        "torrevieja": { "name": "Торревьеха", "latitude": 37.9815, "longitude": -0.6753 }

    }
);

setCookie('locations', loc)
var locations = JSON.parse(decodeURIComponent(getCookie('locations')));
console.log(locations.panteleyki);

document.addEventListener("DOMContentLoaded", refreshWeatherData);

function refreshWeatherData() {
    getWeather(locations.panteleyki)
}

function getWeather(city) {
    let latitude = city.latitude
    let longitude = city.longitude
    condition = document.getElementById("condition-torrevieja");

    const options = {
        method: 'GET',
        headers: { Accept: 'application/json', 'Accept-Encoding': 'gzip' }
    };
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${latitude}%2C${longitude}?unitGroup=metric&elements=datetime%2CdatetimeEpoch%2Cname%2Caddress%2CresolvedAddress%2Clatitude%2Clongitude%2Ctempmax%2Ctempmin%2Ctemp%2Cfeelslikemax%2Cfeelslikemin%2Cfeelslike%2Chumidity%2Cprecip%2Cprecipprob%2Cwindspeed%2Cwinddir%2Cpressure%2Cconditions%2Cdescription%2Cicon&include=fcst%2Cobs%2Cremote%2Cstatsfcst%2Cstats%2Chours%2Calerts%2Cdays%2Ccurrent&key=6M44EU7ZDRK49GFJHKBCX2JJC&contentType=json`
    fetch(url, options)
        .then(response => response.json())
        .then(weatherData => appendData(weatherData))
        .catch(err => console.log(err));
}

function appendData(weatherData) {
    console.log(weatherData);

    document.getElementById('temperature').innerHTML = Math.ceil(weatherData.currentConditions.temp)
    document.getElementById('humidity').innerHTML = Math.ceil(weatherData.currentConditions.humidity)
    document.getElementById('feelslike').innerHTML = Math.ceil(weatherData.currentConditions.feelslike)
    document.getElementById('windspeed').innerHTML = Math.ceil(weatherData.currentConditions.windspeed)
    var style = document.createElement('style');
    var keyFrames = `
    #arrow {
        animation: rotate 1s;
    }
    @keyframes rotate {
         from {
             transform: rotate(0deg);
         }
         to {
             transform: rotate(${Math.ceil(weatherData.currentConditions.winddir)}deg);
         }
     }`;
    style.innerHTML = keyFrames;
    document.getElementsByTagName('head')[0].appendChild(style);
}
