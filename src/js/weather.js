const locationName = document.getElementById('locationName');
const temperature = document.getElementById('temperature')
const conditions = document.getElementById('conditions')
const currentDay = document.getElementById('currentDay')
const weatherIcon = document.getElementById('weather-icon')
const feelslike = document.getElementById('feelslike')
const humidity = document.getElementById('humidity')
const pressure = document.getElementById('pressure')
const precipprob = document.getElementById('precipprob')
const windspeed = document.getElementById('windspeed')
const currentDate = join(new Date, [{ day: 'numeric' }, { month: 'long' }], ' ');
const currentWeekday = join(new Date, [{ weekday: 'short' }], '-');
const currentHour = Number(join(new Date, [{ hour: 'numeric' }], '-'));

function join(t, a, s) {
    function format(m) {
        let f = new Intl.DateTimeFormat('ru', m);
        return f.format(t);
    }
    return a.map(format).join(s);
}
function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (encodeURIComponent(value) || "") + expires + "; path=/";
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

let loc = JSON.stringify(
    {
        'panteleyki': {
            "name": 'Пантелейки',
            "latitude": 55.6743,
            "longitude": 27.0192
        },
        "torrevieja": {
            "name": "Торревьеха",
            "latitude": 37.9815,
            "longitude": -0.6753
        }
    }
);

if (getCookie('locations') === null) {
    setCookie('locations', loc, 30)
}

var locations = JSON.parse(decodeURIComponent(getCookie('locations')));
console.log(locations.torrevieja);

document.addEventListener("DOMContentLoaded", refreshWeatherData);

function refreshWeatherData() {
    getWeather(locations.torrevieja)
}

function getWeather(city) {
    let latitude = city.latitude
    let longitude = city.longitude
    locationName.innerText = city.name

    const options = {
        // method: 'GET',
        // headers: { Accept: 'application/json', 'Accept-Encoding': 'gzip' }
    };
    // const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${latitude}%2C${longitude}?unitGroup=metric&elements=datetime%2CdatetimeEpoch%2Cname%2Caddress%2CresolvedAddress%2Clatitude%2Clongitude%2Ctempmax%2Ctempmin%2Ctemp%2Cfeelslikemax%2Cfeelslikemin%2Cfeelslike%2Chumidity%2Cprecip%2Cprecipprob%2Cwindspeed%2Cwinddir%2Cpressure%2Cconditions%2Cdescription%2Cicon&include=fcst%2Cobs%2Cremote%2Cstatsfcst%2Cstats%2Chours%2Calerts%2Cdays%2Ccurrent&key=6M44EU7ZDRK49GFJHKBCX2JJC&contentType=json&lang=ru`
    fetch('./panteleyki.json', options)
        .then(response => response.json())
        .then(weatherData => appendData(weatherData))
        .catch(err => console.log(err));
}

function appendData(weatherData) {
    let winddir = Math.ceil(Number(weatherData.currentConditions.winddir));

    switch (true) {
        case (0 < winddir && winddir <= 90):
            dir = 'СВ'
            break;
        case (90 < winddir && winddir < 180):
            dir = 'СЗ'
            break;
        case (180 < winddir && winddir < 270):
            dir = 'ЮЗ'
            break;
        case (270 < winddir && winddir < 360):
            dir = 'ЮВ'
        // default:
        //     dir = ''
    }
    console.log('dir = ' + dir)
    let style = document.createElement('style');
    let rotate = `
        #arrow {
            transform: rotate(${winddir}deg);
        }`;
    style.innerHTML = rotate;
    document.getElementsByTagName('head')[0].appendChild(style);


    temperature.innerHTML = `${Math.ceil(weatherData.currentConditions.temp)}°`
    conditions.innerHTML = weatherData.currentConditions.conditions
    currentDay.innerHTML = `${currentWeekday}, ${currentDate}`
    weatherIcon.innerHTML = `
        <img src="img/weather-conditions/${weatherData.currentConditions.icon}.png">`
    feelslike.innerHTML = `Ощущается как
        <div class="font-semibold pl-1">
            ${Math.ceil(weatherData.currentConditions.feelslike)}°
        </div>`
    humidity.innerHTML = `
        ${Math.ceil(weatherData.currentConditions.humidity)}
        <span class="text-[15px] font-medium">%</span>`
    pressure.innerHTML = `
        ${Math.ceil(Number(weatherData.currentConditions.pressure) * 0.1 / 0.1333223684)}
        <span class="text-[15px] font-medium">мм рт. ст.</span>`
    precipprob.innerHTML = `${Math.ceil(weatherData.currentConditions.precipprob)}
        <span class="text-[15px] font-medium">%</span>`
    windspeed.innerHTML = `
        ${Math.ceil(weatherData.currentConditions.windspeed)} 
        <span class="text-[15px] font-medium">км/ч, ${dir}</span><img id="arrow" src="img/arrow.svg"
        class="w-4 h-4">`

    for (i = 1; i < 24 - currentHour; i++) {
        document.getElementById('hourly').innerHTML += `
        <div class="flex flex-col justify-end w-[110px] h-[124px] pl-4 pb-4 pt-3 pr-3 
        bg-gradient-to-br from-cyan/20 to-blue/20 rounded-2xl">
            <div class="flex h-1/2 justify-end">
                <img class="w-12 h-12" src="img/weather-conditions/${weatherData.days[0].hours[currentHour + i].icon}.png">
            </div>
            <div class="h-1/2">
                <div class="text-xs text-white/50 pb-1">
                ${currentHour + i}:00
                </div>
                <div id="hourly-now" class="text-2xl font-semibold">
                    ${Math.ceil(weatherData.days[0].hours[currentHour + i].temp)}°
                </div>
            </div>
        </div>`;
    }

    for (let i = 1; i < 11; i++) {
        let d = [{ day: 'numeric' }, { month: 'long' }];
        let w = [{ weekday: 'long' }];
        let date = join(new Date(weatherData.days[i].datetime), d, ' ');
        let weekday = join(new Date(weatherData.days[i].datetime), w, '-');

        document.getElementById('daily').innerHTML += `
        <div class="flex px-2 py-2 h-14 items-center">
            <div class="grow shrink-0 w-20 flex flex-col">
                <div class="text-xs text-white/50">${date}</div>
                <div class="text-sm capitalize">${weekday}</div>
            </div>
            <div class="grow-0 shrink-0 w-32 flex justify-center gap-3 items-center">
                <div class="w-6 h-6">
                    <img src="img/weather-conditions/${weatherData.days[i].icon}.png">
                </div>
                <div class="text-xs">${Math.ceil(weatherData.days[i].precipprob)} % 
                <img class="w-3 h-3 inline leading-[14px]" src="img/precip.svg" alt=""></div>
            </div>
            <div class="grow flex gap-6 justify-end items-baseline">
                <div class="text-lg text-white w-6 text-end">${Math.ceil(weatherData.days[i].tempmax)}°</div>
                <div class="text-[13px] text-blue w-5 text-end">${Math.ceil(weatherData.days[i].tempmin)}°</div>
            </div>
        </div>`;
    }
}
