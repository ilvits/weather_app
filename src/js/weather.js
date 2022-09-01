let locations = JSON.parse(decodeURIComponent(getCookie('locations')));
const slides = document.getElementById('slides');
generateSlides(locations)
const locationName = document.getElementById('locationName'); // Name of the location
locationName.innerText = locations[0].name

const currentDate = join(new Date, [{ day: 'numeric' }, { month: 'long' }], ' ');
const currentWeekday = join(new Date, [{ weekday: 'short' }], '-');
let currentHour = Number(join(new Date, [{ hour: 'numeric' }], '-'));
let nHours = 26 // Number of hours to display
var days = (24 - currentHour) < nHours ? 2 : 1;

function join(t, a, s) {
    function format(m) {
        let f = new Intl.DateTimeFormat('ru', m);
        return f.format(t);
    }
    return a.map(format).join(s);
}

document.addEventListener("DOMContentLoaded", () => {
    for (let [name, location] of Object.entries(locations)) {
        // console.log(location);
        getWeather(location);
    }
});

swiper.on('slideChange', function () {
    console.log('slide changed');
    console.log(swiper.realIndex);
    locationName.innerText = locations[swiper.realIndex].name
});

function generateSlides(locations) {
    for (let [name, location] of Object.entries(locations)) {
        // console.log(`${location}: ${value.name}`);
        slides.innerHTML += `
        <div id="${location.slug}-slide" data-hash="${location.slug}" class="swiper-slide bg-bg">
                            <!-- Start of Content -->

                            <div id="${location.slug}-loader"
                                class="bg-slate-800/50 border-2 border-slate-700/10 rounded-3xl grid gap-4 w-auto h-[338px] mt-4 mx-4 p-5">
                                <div class="animate-pulse">
                                    <div class="flex justify-between sm:justify-around items-baseline w-full">
                                        <div class="w-24 h-3 bg-slate-700/50 rounded-md my-1"></div>
                                        <div class="w-24 h-1 bg-slate-700/50 rounded-md mb-1"></div>
                                    </div>
                                    <div
                                        class="flex justify-between sm:justify-around items-center pb-4 w-full text-white border-b border-slate-800">
                                        <div class="grid grid-flow-row">
                                            <div class="w-24 h-16 bg-slate-700/50 rounded-md mb-1 mt-8"></div>
                                            <div class="w-32 h-2 bg-slate-700/50 rounded-md my-2"></div>
                                            <div class="w-32 h-2 bg-slate-700/50 rounded-md my-1"></div>
                                        </div>
                                        <div class="bg-slate-700/20 h-20 w-20 my-8 mr-6 rounded-full"></div>
                                    </div>
                                    <div class="grid gap-x-1 gap-y-2 xs:gap-2 grid-cols-2 xs:p-3 mt-3 items-center">
                                        <div class="flex gap-3 items-center">
                                            <div class="flex flex-col">
                                                <div class=" w-8 h-8 m-2 bg-slate-800/50 rounded-xl"></div>
                                            </div>
                                            <div class="flex flex-col gap-2">
                                                <div class="w-16 h-1 bg-slate-700/50 rounded-xl"></div>
                                                <div class="w-16 h-1 bg-slate-700/50"></div>
                                            </div>
                                        </div>
                                        <div class="flex gap-3 items-center">
                                            <div class="flex flex-col">
                                                <div class=" w-8 h-8 m-2 bg-slate-800/50 rounded-xl"></div>
                                            </div>
                                            <div class="flex flex-col gap-2">
                                                <div class="w-16 h-1 bg-slate-700/50 rounded-xl"></div>
                                                <div class="w-16 h-1 bg-slate-700/50"></div>
                                            </div>
                                        </div>
                                        <div class="flex gap-3 items-center">
                                            <div class="flex flex-col">
                                                <div class=" w-8 h-8 m-2 bg-slate-800/50 rounded-xl"></div>
                                            </div>
                                            <div class="flex flex-col gap-2">
                                                <div class="w-16 h-1 bg-slate-700/50 rounded-xl"></div>
                                                <div class="w-16 h-1 bg-slate-700/50"></div>
                                            </div>
                                        </div>
                                        <div class="flex gap-3 items-center">
                                            <div class="flex flex-col">
                                                <div class=" w-8 h-8 m-2 bg-slate-800/50 rounded-xl"></div>
                                            </div>
                                            <div class="flex flex-col gap-2">
                                                <div class="w-16 h-1 bg-slate-700/50 rounded-xl"></div>
                                                <div class="w-16 h-1 bg-slate-700/50"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div id="${location.slug}-main_info"
                                class="hidden grid gap-4 w-auto h-[338px] p-5 mx-4 bg-gradient-to-br from-cyan/20 to-blue/20 rounded-3xl">

                                <div class="flex justify-between items-baseline w-full">
                                    <div class="font-semibold text-xl leading-5">Сегодня</div>
                                    <div id="${location.slug}-currentDay" class="text-white/70 text-[13px]"></div>
                                </div>
                                <div
                                    class="flex justify-between sm:justify-around items-center pb-4 w-full text-white border-b border-white/20">
                                    <div class="grid grid-flow-row">
                                        <div id="${location.slug}-temperature" class="font-semibold text-7xl leading-tight"></div>
                                        <div id="${location.slug}-conditions"></div>
                                        <div id="${location.slug}-feelslike" class="flex"></div>
                                    </div>
                                    <div id="${location.slug}-weather-icon" class=""></div>
                                </div>
                                <div id="${location.slug}-weather-details"
                                    class="grid gap-x-1 gap-y-2 xs:gap-2 grid-cols-2 xs:p-3 items-center">
                                    <div class="flex gap-3 items-center">
                                        <div class="flex flex-col"><img class="w-6 h-6" src="/img/wind.svg" alt="">
                                        </div>
                                        <div class="flex flex-col">
                                            <div id="${location.slug}-windspeed"
                                                class="flex text-base font-semibold gap-1 items-baseline"></div>
                                            <div class="text-white/50 text-xs">Ветер</div>
                                        </div>
                                    </div>
                                    <div class="flex gap-3 items-center">
                                        <div class="flex flex-col"><img class="w-6 h-6" src="/img/pressure.svg" alt="">
                                        </div>
                                        <div class="flex flex-col">
                                            <div id="${location.slug}-pressure" class="text-base font-semibold"></div>
                                            <div class="text-white/50 text-xs">Давление</div>
                                        </div>
                                    </div>
                                    <div class="flex gap-3 items-center">
                                        <div class="flex flex-col"><img class="w-6 h-6" src="/img/precip.svg" alt="">
                                        </div>
                                        <div class="flex flex-col">
                                            <div id="${location.slug}-precipprob" class="text-base font-semibold">
                                            </div>
                                            <div class="text-white/50 text-xs">Осадки</div>
                                        </div>
                                    </div>
                                    <div class="flex gap-3 items-center">
                                        <div class="flex flex-col"><img class="w-6 h-6" src="/img/humidity.svg" alt="">
                                        </div>
                                        <div class="flex flex-col">
                                            <div id="${location.slug}-humidity" class="text-base font-semibold"></div>
                                            <div class="text-white/50 text-xs">Влажность</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div id="${location.slug}-nav" class="flex flex-row gap-10 pl-8 mt-6 mb-2">
                                <div id="${location.slug}-buttonToday"
                                    class="z-50 font-semibold text-[15px] transition-all duration-700 text-yellow">
                                    Сегодня
                                </div>
                                <div id="${location.slug}-buttonTomorrow"
                                    class="z-50 font-semibold text-[15px] transition-all duration-500">Завтра
                                </div>
                            </div>
                            <div class="h-[148px] grow-0 relative">
                            <div id="hContainer" class="left-0 z-50 mt-3 mb-10 absolute bg-gradient-to-r from-bg w-5 h-full"></div>
                            <div id="hContainer2" class="right-0 z-50 mt-3 mb-10 absolute bg-gradient-to-l from-bg w-5 h-full"></div>
                                <div id="${location.slug}-hourlyToday" class="swiper-no-swiping grid grid-flow-col gap-3 
                                overflow-x-scroll no-scrollbar py-3 scroll px-4 transform transition duration-500 ease-[cubic-bezier(0.15,1.01,0.49,1.13)]">
                                </div>
                                <div id="${location.slug}-hourlyTomorrow" class="swiper-no-swiping pointer-events-none grid grid-flow-col gap-3 
                                overflow-x-scroll no-scrollbar py-3 scroll px-4 transform transition duration-500 ease-[cubic-bezier(0.15,1.01,0.49,1.13)] -translate-y-20 opacity-0 ">
                                </div>
                            </div>
                            <div class="block ml-6 mt-5 mb-3 text-xl leading-6 font-semibold">Прогноз на 10 дней</div>
                            <div id="${location.slug}-daily" class="mx-4 grid grid-flow-row divide-y divide-blue/20">
                            </div>
                            <!-- End of content -->
                        </div>`
    }
}

function getWeather(location) {
    let latitude = location.latitude
    let longitude = location.longitude

    const options = {
        // method: 'GET',
        // headers: { Accept: 'application/json', 'Accept-Encoding': 'gzip' }
    };
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${latitude}%2C${longitude}?unitGroup=metric&elements=datetime%2CdatetimeEpoch%2Cname%2Caddress%2CresolvedAddress%2Clatitude%2Clongitude%2Ctempmax%2Ctempmin%2Ctemp%2Cfeelslikemax%2Cfeelslikemin%2Cfeelslike%2Chumidity%2Cprecip%2Cprecipprob%2Cwindspeed%2Cwinddir%2Cpressure%2Cconditions%2Cdescription%2Cicon&include=fcst%2Cobs%2Cremote%2Cstatsfcst%2Cstats%2Chours%2Calerts%2Cdays%2Ccurrent&key=6M44EU7ZDRK49GFJHKBCX2JJC&contentType=json&lang=ru`
    // const url = '/panteleyki.json'
    fetch(url, options)
        .then(response => response.json())
        .then(weatherData => appendData(location, weatherData))
        .catch(err => console.log(err));
}

function printHourlyWeather(location, days, weatherData, startDay = 0) {
    let leftHours = 24 - currentHour
    days += startDay
    if (startDay === 0) {
        hourlyPlaceholder = document.getElementById(location.slug + '-hourlyToday')
    } else {
        hourlyPlaceholder = document.getElementById(location.slug + '-hourlyTomorrow')
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
                <img class="w-12 h-12" src="/img/weather-conditions/${data.icon}.svg">
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

function appendData(location, weatherData) {
    const buttonTomorrow = document.getElementById(location.slug + '-buttonTomorrow');
    const buttonToday = document.getElementById(location.slug + '-buttonToday');
    const temperature = document.getElementById(location.slug + '-temperature');
    const weatherIcon = document.getElementById(location.slug + '-weather-icon');
    const conditions = document.getElementById(location.slug + '-conditions');
    const currentDay = document.getElementById(location.slug + '-currentDay');
    const feelslike = document.getElementById(location.slug + '-feelslike');
    const humidity = document.getElementById(location.slug + '-humidity');
    const pressure = document.getElementById(location.slug + '-pressure');
    const windspeed = document.getElementById(location.slug + '-windspeed');
    const precipprob = document.getElementById(location.slug + '-precipprob');
    const hourlyToday = document.getElementById(location.slug + '-hourlyToday');
    const hourlyTomorrow = document.getElementById(location.slug + '-hourlyTomorrow');
    document.getElementById(location.slug + '-loader').classList.add('hidden')
    document.getElementById(location.slug + '-main_info').classList.remove('hidden')

    printHourlyWeather(location, days, weatherData)
    printHourlyWeather(location, days, weatherData, 1)
    // console.log(locations)
    buttonToday.addEventListener('click', () => {
        buttonToday.classList.add('text-yellow')
        buttonTomorrow.classList.remove('text-yellow')
        hourlyTomorrow.classList.add('-translate-y-20', 'opacity-0', 'z-0', 'pointer-events-none')
        hourlyTomorrow.classList.remove('-translate-y-[148px]', 'opacity-100')
        hourlyToday.classList.remove('-translate-y-20', 'opacity-0', 'z-0', 'pointer-events-none')
        hourlyToday.classList.add('translate-y-0', 'opacity-100')
    })

    buttonTomorrow.addEventListener('click', () => {
        buttonToday.classList.remove('text-yellow')
        buttonTomorrow.classList.add('text-yellow')
        hourlyToday.classList.add('-translate-y-20', 'opacity-0', 'z-0', 'pointer-events-none')
        hourlyToday.classList.remove('translate-y-0', 'opacity-100')
        hourlyTomorrow.classList.remove('-translate-y-20', 'opacity-0', 'z-0', 'pointer-events-none')
        hourlyTomorrow.classList.add('-translate-y-[148px]', 'opacity-100')
    })

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
        <img src="/img/weather-conditions/${weatherData.currentConditions.icon}.svg">`
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
        <span class="text-[15px] font-medium">км/ч, ${dir}</span><img id="arrow" src="/img/arrow.svg"
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
        document.getElementById(location.slug + '-daily').innerHTML += `
        <div class="flex px-2 py-2 h-14 items-center">
            <div class="grow shrink-0 w-20 flex flex-col">
                <div class="text-xs text-white/50">${date}</div>
                <div class="text-sm capitalize ${color}">${weekday}</div>
            </div>
            <div class="grow-0 shrink-0 w-32 flex justify-center gap-3 items-center">
                <div class="w-6 h-6">
                    <img src="/img/weather-conditions/small/${weatherData.days[i].icon}.svg">
                </div>
                <div class="text-xs w-12 text-end">${Math.ceil(weatherData.days[i].precipprob)} % 
                <img class="w-3 h-3 inline leading-[14px]" src="/img/precip.svg" alt=""></div>
            </div>
            <div class="grow flex gap-6 justify-end items-baseline">
                <div class="text-lg text-white w-6 text-end">${Math.ceil(weatherData.days[i].tempmax)}°</div>
                <div class="text-[13px] text-blue w-5 text-end">${Math.ceil(weatherData.days[i].tempmin)}°</div>
            </div>
        </div>`;
    }
}
