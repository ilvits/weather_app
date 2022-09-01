const buttonToday = document.getElementById('buttonToday');
const buttonTomorrow = document.getElementById('buttonTomorrow');

const locationName = document.getElementById('locationName'); // Name of the location
const temperature = document.getElementById('temperature');
const conditions = document.getElementById('conditions');
const currentDay = document.getElementById('currentDay');
const weatherIcon = document.getElementById('weather-icon');
const feelslike = document.getElementById('feelslike');
const humidity = document.getElementById('humidity');
const pressure = document.getElementById('pressure');
const precipprob = document.getElementById('precipprob');
const windspeed = document.getElementById('windspeed');
const currentDate = join(new Date, [{ day: 'numeric' }, { month: 'long' }], ' ');
const currentWeekday = join(new Date, [{ weekday: 'short' }], '-');
let currentHour = Number(join(new Date, [{ hour: 'numeric' }], '-'));
let nHours = 26 // Number of hours to display
if (24 - currentHour < nHours) {
    days = 2
}
else {
    days = 1
}

buttonToday.addEventListener('click', () => {
    buttonToday.classList.add('text-yellow')
    buttonTomorrow.classList.remove('text-yellow')
    hourlyTomorrow.classList.add('-translate-y-0', 'opacity-0')
    hourlyTomorrow.classList.remove('-translate-y-[148px]', 'opacity-100')
    hourlyToday.classList.remove('-translate-y-20', 'opacity-0')
    hourlyToday.classList.add('translate-y-0', 'opacity-100')
})

buttonTomorrow.addEventListener('click', () => {
    buttonToday.classList.remove('text-yellow')
    buttonTomorrow.classList.add('text-yellow')
    hourlyToday.classList.add('-translate-y-20', 'opacity-0')
    hourlyToday.classList.remove('translate-y-0', 'opacity-100')
    hourlyTomorrow.classList.remove('-translate-y-0', 'opacity-0')
    hourlyTomorrow.classList.add('-translate-y-[148px]', 'opacity-100')
})

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
        },
        "Zucchelli": {
            "name": "Zucchelli Station",
            "latitude": -74.69399018874958,
            "longitude": 164.11546177709056
        },
    }
);

if (getCookie('locations') === null) {
    setCookie('locations', loc, 30)
}

var locations = JSON.parse(decodeURIComponent(getCookie('locations')));

document.addEventListener("DOMContentLoaded", refreshWeatherData);

function refreshWeatherData() {
    getWeather(locations.panteleyki)
}

function getWeather(city) {
    let latitude = city.latitude
    let longitude = city.longitude
    locationName.innerText = city.name

    const options = {
        // method: 'GET',
        // headers: { Accept: 'application/json', 'Accept-Encoding': 'gzip' }
    };
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${latitude}%2C${longitude}?unitGroup=metric&elements=datetime%2CdatetimeEpoch%2Cname%2Caddress%2CresolvedAddress%2Clatitude%2Clongitude%2Ctempmax%2Ctempmin%2Ctemp%2Cfeelslikemax%2Cfeelslikemin%2Cfeelslike%2Chumidity%2Cprecip%2Cprecipprob%2Cwindspeed%2Cwinddir%2Cpressure%2Cconditions%2Cdescription%2Cicon&include=fcst%2Cobs%2Cremote%2Cstatsfcst%2Cstats%2Chours%2Calerts%2Cdays%2Ccurrent&key=6M44EU7ZDRK49GFJHKBCX2JJC&contentType=json&lang=ru`
    // const url = './panteleyki.json'
    fetch(url, options)
        .then(response => response.json())
        .then(weatherData => appendData(weatherData))
        .catch(err => console.log(err));
}

function printHourlyWeather(days, weatherData, startDay = 0) {
    let leftHours = 24 - currentHour
    days += startDay
    if (startDay === 0) {
        hourlyPlaceholder = document.getElementById('hourlyToday')
    } else {
        hourlyPlaceholder = document.getElementById('hourlyTomorrow')
    }
    for (var day = startDay; day < days; day++) {
        for (let i = 1; i < leftHours; i++) {
            data = weatherData.days[day].hours[currentHour + i]
            if (currentHour + i == 0) {
                nextDayTip = ', ' + join(new Date(0).setUTCSeconds(data.datetimeEpoch), [{ day: 'numeric' }, { month: 'short' }], ' ')
            } else {
                nextDayTip = ''
            }
            hourlyPlaceholder.innerHTML += `
        <div class="flex flex-col justify-end w-28 h-[124px] pl-4 pb-4 pt-3 pr-3 
        bg-gradient-to-br from-cyan/20 to-blue/20 rounded-2xl">
            <div class="flex h-1/2 justify-end">
                <img class="w-12 h-12" src="img/weather-conditions/${data.icon}.svg">
            </div>
            <div class="h-1/2">
                <div class="text-xs text-white/50 pb-1">
                    ${currentHour + i}:00${nextDayTip}
                </div>
                <div class="flex justify-between items-baseline">
                    <div id="hourly-now" class="text-2xl font-semibold">
                        ${Math.ceil(data.temp)}°
                    </div>
                    <div class="text-blue">
                        ${Math.ceil(data.precipprob)}%
                    </div>
                </div>
            </div>
        </div>`;
        }
        leftHours = nHours - leftHours
        currentHour = -1
    }
}

function appendData(weatherData) {
    document.getElementById('loader').classList.add('hidden')
    document.getElementById('main_info').classList.remove('hidden')
    printHourlyWeather(days, weatherData)
    printHourlyWeather(days, weatherData, 1)

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
    }
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
        <img src="img/weather-conditions/${weatherData.currentConditions.icon}.svg">`
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

    for (let i = 1; i < 11; i++) {
        let d = [{ day: 'numeric' }, { month: 'long' }];
        let w = [{ weekday: 'long' }];
        let date = join(new Date(weatherData.days[i].datetime), d, ' ');
        let weekday = join(new Date(weatherData.days[i].datetime), w, '-');
        if (weekday == 'суббота' || weekday == 'воскресенье') {
            color = 'text-orange'
        } else {
            color = 'text-white'
        }
        document.getElementById('daily').innerHTML += `
        <div class="flex px-2 py-2 h-14 items-center">
            <div class="grow shrink-0 w-20 flex flex-col">
                <div class="text-xs text-white/50">${date}</div>
                <div class="text-sm capitalize ${color}">${weekday}</div>
            </div>
            <div class="grow-0 shrink-0 w-32 flex justify-center gap-3 items-center">
                <div class="w-6 h-6">
                    <img src="img/weather-conditions/${weatherData.days[i].icon}.svg">
                </div>
                <div class="text-xs w-12 text-end">${Math.ceil(weatherData.days[i].precipprob)} % 
                <img class="w-3 h-3 inline leading-[14px]" src="img/precip.svg" alt=""></div>
            </div>
            <div class="grow flex gap-6 justify-end items-baseline">
                <div class="text-lg text-white w-6 text-end">${Math.ceil(weatherData.days[i].tempmax)}°</div>
                <div class="text-[13px] text-blue w-5 text-end">${Math.ceil(weatherData.days[i].tempmin)}°</div>
            </div>
        </div>`;
    }
}
