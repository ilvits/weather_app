let userCountry
let locationDataSet
let resultList
let rawList = new Object()
const previewWindow = document.querySelector(`#preview-window`)
let suggestionList = document.querySelector('#suggestion-list')
const searchInput = document.querySelector('#search-input')
const newLocationPreviewEl = document.querySelector('#new-location-preview')

function setAttributes(el, attrs) {
    for (var key in attrs) {
        el.setAttribute(key, attrs[key]);
    }
}
fetch("https://ipinfo.io/json?token=bf205b8bacf2c5").then(
    (response) => response.json()
).then((jsonResponse) => { userCountry = jsonResponse.country })

function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
};

function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            console.log("User denied the request for Geolocation.")
            break;
        case error.POSITION_UNAVAILABLE:
            console.log("Location information is unavailable.")
            break;
        case error.TIMEOUT:
            console.log("The request to get user location timed out.")
            break;
        case error.UNKNOWN_ERROR:
            console.log("An unknown error occurred.")
            break;
    }
}

function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        x = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {
    // console.log(position)
    var crd = position.coords;
    var url = `https://nominatim.openstreetmap.org/reverse?lat=${crd.latitude}&lon=${crd.longitude}&format=json&accept-language=ru&addressdetails=1`;
    test_lon = 41.778885312309285
    test_lat = 41.80871719114782
    var options = {
        // method: "POST",
        // mode: "cors",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
    }

    fetch(url, options)
        .then(response => response.json())
        .then(result => {
            console.log(`
                Широта: ${crd.latitude}
                Долгота: ${crd.longitude}
                Плюс-минус ${crd.accuracy} метров.
                ${result}
                `);
            previewCurrentLocation(result)
        })
        .catch(error => console.log("error", error));
}

function getGeoData(event) {
    const regex = /^[a-zA-ZАА-Яа-яёЁ.,\d\-_\s]+$/i;
    const str = event.target.value.trim();

    if ((regex.exec(str)) !== null) {
        if (str.length > 2) {
            setTimeout(() => {
                // console.log(str, event.target.value);
                // console.log(str === event.target.value);
                if (str === event.target.value) {
                    getSuggestions(str)
                }
            }, 600)
        } else {
            console.log('недостаточно символов')
        }
    } else {
        console.log('Недопустимые символы')
    }
}

function getSuggestions(str) {
    // console.log(str);
    var url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address";
    var token = "6fdf0cb5e0a5e620935f51adf9e7002993296755";
    var query = str;

    var options = {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": "Token " + token
        },
        body: JSON.stringify({
            query: query,
            locations: [{ "country": "*" }],
            from_bound: { value: "city" },
            to_bound: { value: "settlement" },
            count: 10,
        })
    }

    fetch(url, options)
        .then(response => response.text())
        .then(result => parseSuggestions(result))
        .catch(error => console.log("error", error));
}

function parseSuggestions(suggestions) {

    let rawList = JSON.parse(suggestions).suggestions
    // console.log(rawList)
    suggestionList.innerHTML = ''
    suggestionList.classList.remove('invisible', 'opacity-0')
    for (const [key, value] of Object.entries(rawList)) {
        let id = (value.data.fias_id !== null) ? value.data.fias_id : value.data.geoname_id;
        // console.log(id)
        let action = 'previewWeather(this)'
        if (value.data.fias_level === "65") {
            delete (rawList[key]);
            rawList.length -= 1;
        } else {
            let searchText = searchInput.value
            let name = (value.data.settlement !== null)
                ? value.data.settlement_type_full + ' ' + value.data.settlement
                : value.data.city_type_full + ' ' + value.data.city;
            let latitude = value.data.geo_lat;
            let longitude = value.data.geo_lon;
            let countryCode = value.data.country_iso_code
            // let id = (value.data.fias_id !== null) ? value.data.fias_id : value.data.geoname_id;
            let region = value.data.region_with_type;
            let country = value.data.country;
            let capText = searchText[0].toUpperCase() + searchText.slice(1)
            const name_translit = translit((value.data.settlement !== null) ? value.data.settlement : value.data.city)
            let locationLi = document.createElement('li');
            if ((locations) && (Object.values(locations).findIndex(item => item.id == id) != -1)) {
                action = ''
                locationLi.classList.add('pointer-events-none', 'text-slate-500', 'py-2', 'pr-2', 'overflow-hidden', 'overflow-ellipsis', 'whitespace-nowrap')
                text = `${name}, ${region}${(countryCode !== userCountry) ? ', ' + country : ''}`
            } else {
                action = 'previewWeather(this)'
                locationLi.classList.add('py-2', 'pr-2', 'overflow-hidden', 'overflow-ellipsis', 'whitespace-nowrap')
                text = `${name.replace(capText, `<span class="text-[#3377FF] dark:text-yellow">${capText}</span>`)}, <span class="text-[#90929E]">${region}${(countryCode !== userCountry) ? ', ' + country : ''}</span>`
            }

            locationLi.innerHTML = text
            suggestionList.appendChild(locationLi)
            setAttributes(locationLi, {
                'data-id': id,
                'data-name': (value.data.settlement !== null) ? value.data.settlement : value.data.city,
                'data-name_translit': name_translit,
                'data-latitude': latitude,
                'data-longitude': longitude,
                'data-country_code': countryCode,
                'data-region': region,
                'data-country': country,
                'onclick': action,
            });
        }
    }
}

function hideWeatherPreview() {
    newLocationPreviewEl.classList.add('opacity-0', 'translate-y-[600px]', '-z-10');
    newLocationPreviewEl.classList.remove('z-[130]');
    setTimeout(() => {
        newLocationPreviewEl.classList.add('hidden');
        previewWindow.innerHTML = '';
    }, 300);
}

function previewWeather(location) {
    console.log('preview location: ')
    console.log(location)
    locationDataSet = {
        // searchText: searchInput.value,
        name: location.dataset.name,
        original_name: location.dataset.name,
        name_translit: location.dataset.name_translit,
        latitude: location.dataset.latitude,
        longitude: location.dataset.longitude,
        country_code: location.dataset.countryCode,
        id: location.dataset.id,
        region: location.dataset.region,
        country: location.dataset.country,
        current: false,
    }
    getWeatherDataFromAPI(locationDataSet.id, locationDataSet.latitude, locationDataSet.longitude)
        .then(weatherData => generatePreview(locationDataSet, weatherData, false))
}

function previewCurrentLocation(location) {
    // console.log('current location: ')
    // console.log(location)
    locationDataSet = {
        name: location.address.city ? location.address.city : location.address.town,
        original_name: location.address.city ? location.address.city : location.address.town,
        name_translit: translit(location.address.city ? location.address.city : location.address.town),
        latitude: location.lat,
        longitude: location.lon,
        country_code: location.address.country_code,
        id: location.place_id,
        region: location.address.state,
        country: location.address.country,
        current: true,
    }

    getWeatherDataFromAPI(locationDataSet.id, locationDataSet.latitude, locationDataSet.longitude)
        .then(weatherData => generatePreview(locationDataSet, weatherData, true))
}

function generatePreview(l, weatherData, current = false) {
    id = l.id
    setTimeout(() => {
        newLocationPreviewEl.classList.remove('opacity-0', 'translate-y-[600px]')
        newLocationPreviewEl.classList.add('z-[130]')
    }, 50);
    newLocationPreviewEl.classList.remove('hidden', '-z-10');
    addButton = document.querySelector('#add-weather-preview')
    addButton.dataset.locationId = l.id
    addButton.dataset.current = current
    document.querySelector('#location-name').innerText = l.name

    previewWindow.innerHTML = `
            <div id="id-${l.id}" data-hash="${l.id}" data-id="${l.id}" class="preview-window">
                        <!-- Start of Content -->
                        <section id="general-weather-info--${l.id}" data-hash="${l.id}" class="px-4 max-w-md mx-auto swiper-slide dark:bg-bg swiper-slide-active">
                        <div class="w-full p-5 rounded-2xl bg-white dark:bg-gradient-to-br dark:from-[#192D52] dark:to-[#112645]">
                            <div class="flex flex-row justify-between">
                                <div class="flex flex-col gap-2">
                                    <div id="current-day-${l.id}" class="text-[#90929E] dark:text-[#ACD8E7] text-xs font-light capitalize"></div>
                                    <div id="temperature-${l.id}" class="text-[64px] leading-[68px] align-text-top">--</div>
                                    <div class="text-sm leading-4 flex flex-col gap-1">
                                    <div id="conditions-${l.id}">--</div>
                                    <div id="feelslike-${l.id}">--</div>
                                    </div>
                                </div>
                                <div id="weather-icon-${l.id}">
                                </div>
                            </div>
                            <div id="detail-weather-info-${l.id}"
                                class="hs-collapse will-change-transform hidden w-full grid grid-flow-row gap-5 overflow-hidden transition-[height] duration-300">
                                <div id="details-1" class="relative h-[100px] w-full grid grid-flow-col justify-around items-end">
                                    <div class="absolute detail-item opacity-0 -translate-y-5 -translate-x-1 transform-gpu transition-all w-full h-full flex justify-center">
                                        <div class="absolute w-[150px] h-[75px] bottom-0">
                                            <div class="w-full h-full border border-b-0 border-dashed rounded-t-full border-[#6390F0]/60 dark:border-cyan/60">
                                            </div>
                                            <div
                                                class="sun absolute top-0 w-full h-full origin-bottom -rotate-[120deg]
                                            border border-b-0 border-solid rounded-t-full border-[#ACD8E7] dark:border-cyan bg-gradient-to-b from-[#EDF8FF] dark:from-[#0F3C5C] to-transparent">
                                            </div>
                                            <div class="w-[150px] h-[75px] bg-white dark:bg-[#132846] absolute"></div>
                                            <div class="w-2 h-2 rounded-full bg-[#ACD8E7] dark:bg-cyan -bottom-[4px] -left-[4px] absolute"></div>
                                            <div class="w-2 h-2 rounded-full bg-[#ACD8E7] dark:bg-cyan -bottom-[4px] -right-[4px] absolute">
                                            </div>
                                            <div class="sky left-1/2 w-1/2 origin-left absolute -rotate-[120deg]">
                                                <div
                                                    class="w-2 h-2 rounded-full bg-[#6390F0] dark:bg-white outline-2 outline outline-white dark:outline-bg outline-offset-0 -bottom-[4px] -right-[4px] absolute">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
    
                                    <div class="detail-item text-center opacity-0 -translate-y-5 -translate-x-1 transform-gpu transition-all w-full grid grid-flow-row gap-[6px]">
                                        <div class="text-xs text-[#90929E] dark:text-[#ACD8E7]">Восход</div>
                                        <div id="sunrise-${l.id}" class="font-semibold ">--</div>
                                    </div>
                                    <div class="w-full text-center detail-item opacity-0 -translate-y-5 -translate-x-1 transform-gpu transition-all grid grid-flow-row gap-[6px] justify-center  z-10">
                                        <div class="text-xs text-[#90929E] dark:text-[#ACD8E7]">Световой день</div>
                                        <div id="daylight-${l.id}" class="font-semibold">--</div>
                                    </div>
                                    <div class="w-full text-center detail-item opacity-0 -translate-y-5 -translate-x-1 transform-gpu transition-all grid grid-flow-row gap-[6px]">
                                        <div class="text-xs text-[#90929E] dark:text-[#ACD8E7]">Закат</div>
                                        <div id="sunset-${l.id}" class="font-semibold ">--</div>
                                    </div>
                                </div>
                                <div id="details-2" class="relative h-[100px] grid grid-cols-3 gap-1">
                                    <div class="detail-item opacity-0 -translate-y-5 -translate-x-1 transform-gpu transition-all grid grid-flow-row text-center">
                                        <div class="">
                                            <div class="text-xs text-[#90929E] dark:text-[#ACD8E7]">t° максимум</div>
                                            <div id="tempmax-${l.id}">--</div>
                                        </div>
                                        <div class="">
                                            <div class="text-xs text-[#90929E] dark:text-[#ACD8E7]">t° минимум</div>
                                            <div id="tempmin-${l.id}">--</div>
                                        </div>
                                    </div>
                                    <div class="detail-item opacity-0 -translate-y-5 -translate-x-1 transform-gpu transition-all grid grid-flow-row text-center">
                                        <div class="grid grid-flow-row">
                                            <div class="text-xs text-[#90929E] dark:text-[#ACD8E7]">Осадки</div>
                                            <div id="precipprob-${l.id}">--</div>
                                        </div>
                                        <div class="">
                                            <div class="text-xs text-[#90929E] dark:text-[#ACD8E7]">Влажность</div>
                                            <div id="humidity-${l.id}">--</div>
                                        </div>
                                    </div>
                                    <div class="detail-item opacity-0 -translate-y-5 -translate-x-1 transform-gpu transition-all grid grid-flow-row text-center">
                                        <div class="">
                                            <div class="text-xs text-[#90929E] dark:text-[#ACD8E7]">Давление</div>
                                            <div id="pressure-${l.id}">--</div>
                                        </div>
                                        <div class="">
                                            <div class="text-xs text-[#90929E] dark:text-[#ACD8E7]">Ветер</div>
                                            <div id="windspeed-${l.id}">--</div>
                                        </div>
    
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
    
                    <section id="hourlyToday-${l.id}" class="hourly swiper-no-swiping will-change-scroll pt-4 gap-2 flex overflow-hidden overflow-x-scroll 
                    no-scrollbar px-3 scroll-smooth snap-x snap-mandatory">
                    </section>
    
                    <section id="daily-${l.id}" class="py-6 mx-4 grid grid-flow-row">
                    </section>
    

                    <section id="monthly-${l.id}-btn" class="mx-4 pb-24 font-light flex flex-nowrap gap-5 items-center hidden
                    hs-overlay-toggle" data-hs-overlay="#monthly-forecast" aria-controls="sidebarLeft" aria-label="Toggle locations menu"
                    data-id="${l.id}">
                        <div class="small-icon w-[52px] h-[52px] grow-0 bg-white dark:bg-[#192D52] rounded-2xl py-1">
                            <img class="w-[44px] h-[44px] mx-auto" src="img/assets/icons/monthly.svg" alt="">
                        </div>
                        <div class="grow text-base leading-5 dark:text-[#FFFFFF]">Прогноз на месяц</div>
                        <div class="grow-0"><img class="w-[7px] h-[14px] mx-auto" src="img/assets/icons/arrow-right.svg" alt=""></div>
                    </section>
                        <!-- End of content -->`
    appendData(l, weatherData, true)
    renderHourlyWeather(l.id, weatherData)
    renderDailyWeather(l.id, weatherData, 10)

}

function appendData(location, weatherData, preview = false) {
    var doc = document.documentElement;
    var w = window;
    var prevScroll = w.scrollY || doc.scrollTop;
    var curScroll;
    var direction = 0;
    var prevDirection = 0;
    const sunrise = document.getElementById('sunrise-' + location.id);
    const sunset = document.getElementById('sunset-' + location.id);
    const dayLight = document.getElementById('daylight-' + location.id);
    const temperature = document.getElementById('temperature-' + location.id);
    const weatherIcon = document.getElementById('weather-icon-' + location.id);
    const conditions = document.getElementById('conditions-' + location.id);
    const currentDay = document.getElementById('current-day-' + location.id);
    const feelslike = document.getElementById('feelslike-' + location.id);
    const humidity = document.getElementById('humidity-' + location.id);
    const pressure = document.getElementById('pressure-' + location.id);
    const windspeed = document.getElementById('windspeed-' + location.id);
    const precipprob = document.getElementById('precipprob-' + location.id);
    const tempmax = document.getElementById('tempmax-' + location.id);
    const tempmin = document.getElementById('tempmin-' + location.id);
    const weatherDetailsToggle = document.querySelector(`#detail-weather-toggle--${location.id}`)
    const weatherDetailsToggleImg = document.querySelector(`#detail-weather-toggle-img--${location.id}`)
    const detailInfo = document.querySelector(`#detail-weather-info-${location.id}`)
    const detailItems = document.querySelectorAll(`#detail-weather-info-${location.id} .detail-item`)
    const headerTemp = document.querySelector(`#header-${location.id} .header-temp`);
    // const headerTemp_current = document.querySelector(`#header-${location.id} .header-temp`);

    let todayWeather = weatherData.days[0]
    let currentWeather = weatherData.days[0].hours[Number(join(new Date, [{ hour: 'numeric' }], '-'))]

    let winddir = Math.round(Number(currentWeather.winddir));
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
        case (winddir == 0):
            dir = 'В'
        case (winddir == 90):
            dir = 'С'
        case (winddir == 180):
            dir = 'З'
        case (winddir == 270):
            dir = 'Ю'
    }

    // console.log(tempConverter(currentWeather.temp))


    if (getCookie('s-details') == 'true') {
        HSCollapse.show(detailInfo)
        if (detailInfo.clientHeight > 0) {
            // console.log('▲ details closing... ▲')
            weatherDetailsToggle.firstElementChild.innerText = 'Подробнее';
            weatherDetailsToggleImg.classList.remove('rotate-180')
            detailItems.forEach((el) => {
                el.classList.add('opacity-0', '-translate-y-5', '-translate-x-1');
            })
        } else {
            // console.log('▼ details opening... ▼')
            weatherDetailsToggle.firstElementChild.innerText = 'Свернуть';
            weatherDetailsToggleImg.classList.add('rotate-180')
            detailItems.forEach((el, index) => {
                var interval = 35;
                setTimeout(() => {
                    el.classList.remove('opacity-0', '-translate-y-5', '-translate-x-1');
                }, index * interval);
            })
        }
    }
    const current_temperature = Math.round(tempConverter(currentWeather.temp))

    // CURRENT WEATHER RENDER
    const time_offset = weatherData.tzoffset + user_date.getTimezoneOffset() / 60
    const location_date = new Date(user_date)
    location_date.setHours(location_date.getHours() + time_offset)
    const location_time = getTime2Digits(location_date)
    const currentDate = join(location_date, [{ day: 'numeric' }, { month: 'short' }], ' ');
    const currentWeekday = join(location_date, [{ weekday: 'long' }], '-');
    const sunrise_date = new Date(weatherData.currentConditions.sunriseEpoch * 1000)
    const sunrise_time = new Date(sunrise_date)
    sunrise_time.setHours(sunrise_date.getHours() + time_offset)
    const sunset_date = new Date(weatherData.currentConditions.sunsetEpoch * 1000)
    const sunset_time = new Date(sunset_date)
    sunset_time.setHours(sunset_date.getHours() + time_offset)
    const dayLight_date = new Date(sunset_date)
    dayLight_date.setTime(sunset_date.getTime() - sunrise_date.getTime())
    dayLight_date.setHours(dayLight_date.getHours() + user_date.getTimezoneOffset() / 60)
    if (headerTemp) {
        headerTemp.innerHTML = `${current_temperature}° 
        <img class="w-6 h-6" src="img/assets/icons/weather-conditions/small/${currentWeather.icon}.svg" alt="" srcset="">`
    }
    currentDay.innerHTML = `${currentWeekday}, <span class="normal-case">${currentDate}</span> ${location_time}`
    temperature.innerHTML = `${current_temperature}<span class="text-2xl absolute font-bold leading-9">°${s_temp}</span>`
    feelslike.innerHTML = `Ощущается как <span class="font-bold"> ${Math.round(tempConverter(currentWeather.feelslike))}°`
    sunrise.innerHTML = getTime2Digits(sunrise_time)
    sunset.innerHTML = getTime2Digits(sunset_time)
    dayLight.innerHTML = `${dayLight_date.getHours()} ч ${dayLight_date.getMinutes()} мин`
    tempmax.innerText = `${Math.round(tempConverter(todayWeather.tempmax))}°`
    tempmin.innerText = `${Math.round(tempConverter(todayWeather.tempmin))}°`
    conditions.innerHTML = currentWeather.conditions
    weatherIcon.innerHTML = `<img src="img/assets/icons/weather-conditions/${currentWeather.icon}.svg">`
    humidity.innerHTML = `${Math.round(currentWeather.humidity)}<span class="text-sm font-medium">%</span>`
    pressure.innerHTML = `${Math.round(pressureConverter(Number(currentWeather.pressure)))}<span class="text-sm font-medium"> ${s_pressure}</span>`
    precipprob.innerHTML = `${Math.round(currentWeather.precipprob)}<span class="text-sm font-medium">%</span>`
    windspeed.innerHTML = `${Math.round(windConverter(currentWeather.windspeed))} <span class="text-sm font-medium">${s_wind}</span>, ${dir}`

    // HOURLY FORECAST RENDER

    renderHourlyWeather(location.id, weatherData)

    // DAILY FORECAST

    renderDailyWeather(location.id, weatherData)

    monthly_forecast_btn = document.querySelector(`#monthly-${location.id}-btn`)
    monthly_forecast_btn.addEventListener('click', () => {
        // console.log('Monthly forecast', location.id)
        renderMonthlyForecast(location)
    })
    monthly_forecast_btn.classList.remove('hidden')
    if (!preview) {
        toggle = document.querySelectorAll('.detail-weather-toggle');

        var checkScroll = function () {

            /*
             ** Find the direction of scroll
             ** 0 - initial, 1 - up, 2 - down
             */

            curScroll = w.scrollY || doc.scrollTop;
            if (curScroll > prevScroll) {
                //scrolled up
                direction = 2;
            } else if (curScroll < prevScroll) {
                //scrolled down
                direction = 1;
            }

            if (direction !== prevDirection) {
                toggleHeader(direction, curScroll);
            }

            prevScroll = curScroll;
        };
        var toggleHeader = function (direction, curScroll) {
            if (direction === 2 && curScroll > 200) {

                //replace 52 with the height of your header in px
                toggle.forEach((t) => {
                    t.classList.add('opacity-0', 'pointer-events-none');
                })
                headerTemp.classList.remove('opacity-0');
                prevDirection = direction;
            } else if (direction === 1 && curScroll <= 200) {
                toggle.forEach((t) => {
                    t.classList.remove('opacity-0', 'pointer-events-none');
                })
                headerTemp.classList.add('opacity-0');
                prevDirection = direction;
            }
        };
        window.addEventListener('scroll', checkScroll);

        // MY LOCATIONS CARDS RENDER

        document.querySelector(`#card-${location.id} .time`).innerText = location_time
        document.querySelector(`#card-${location.id} .temp`).innerText = Math.round(todayWeather.temp) + '°'
        document.querySelector(`#card-${location.id} .condition`).innerText = todayWeather.conditions
        document.querySelector(`#card-${location.id} .tempmax`).innerText = Math.round(todayWeather.tempmax) + '°'
        document.querySelector(`#card-${location.id} .tempmin`).innerText = Math.round(todayWeather.tempmin) + '°'
        document.querySelector(`#card-${location.id} .weather-icon`).innerHTML = `
        <img  src="img/assets/icons/weather-conditions/${todayWeather.icon}.svg">`

        document.querySelector(`#card-${location.id} .edit-icon`).addEventListener('click', (event) => {
            openLocationEditModal(event.target)
        })

        weatherDetailsToggle.onclick = () => {
            if (detailInfo.clientHeight > 0) {
                // console.log('▲ details closing... ▲')
                weatherDetailsToggle.firstElementChild.innerText = 'Подробнее';
                weatherDetailsToggleImg.classList.remove('rotate-180')
                detailItems.forEach((el) => {
                    el.classList.add('opacity-0', '-translate-y-5', '-translate-x-1');
                })
            } else {
                // console.log('▼ details opening... ▼')
                weatherDetailsToggle.firstElementChild.innerText = 'Свернуть';
                weatherDetailsToggleImg.classList.add('rotate-180')
                detailItems.forEach((el, index) => {
                    var interval = 35;
                    setTimeout(() => {
                        el.classList.remove('opacity-0', '-translate-y-5', '-translate-x-1');
                    }, index * interval);
                })
            }
        }
    } else {
        HSCollapse.show(detailInfo)
        detailItems.forEach((el, index) => {
            var interval = 35;
            setTimeout(() => {
                el.classList.remove('opacity-0', '-translate-y-5', '-translate-x-1');
            }, index * interval);
        })
    }

}

function renderHourlyWeather(id, weatherData) {
    // console.log(weatherData)

    hourlyPlaceholder = document.getElementById('hourlyToday-' + id)
    const time_offset = weatherData.tzoffset + user_date.getTimezoneOffset() / 60
    const location_date = new Date(user_date)
    location_date.setHours(location_date.getHours() + time_offset)

    currentHour = location_date.getHours()
    let nHours = 26 // Number of hours to display
    let leftHours = 24 - currentHour

    for (var day = 0; day < 2; day++) {
        if (day > 0) {
            currentHour = -1
        } else {
            currentHour = location_date.getHours()
        }
        for (let i = 0; i < leftHours; i++) {
            if (i == 0 && day == 0) {
                time = 'Сейчас'
                data = weatherData.days[day].hours[currentHour + i]
                // console.log(currentHour + i)
            }
            else if (day === 1 && i === 0) {
                continue;
            }
            else if (i > 0) {
                time = `${currentHour + i}:00`
                data = weatherData.days[day].hours[currentHour + i]
            }
            if (currentHour + i == 0) {
                new_date = new Date(location_date)
                new_date.setHours(location_date.getHours() + 24)
                nextDayTip = join(new_date, [{ day: 'numeric' }, { month: 'short' }], ' ')
            } else {
                nextDayTip = ''
            }

            hourlyPlaceholder.innerHTML += `
        <div class="flex flex-col justify-end items-center px-2  scroll-ml-3 snap-start">
            <div class="date text-xs text-white/50 pb-1">${nextDayTip}</div>
            <div class="icon w-11 h-11 bg-white dark:bg-gradient-to-br dark:from-[#192D52] dark:to-[#112645] rounded-xl flex justify-center items-center relative">
                <img class="w-6 h-6" src="img/assets/icons/weather-conditions/small/${data.icon}.svg" alt="" srcset="">
                ${Math.round(data.precipprob) > 20 ?
                    ('<div class="absolute bg-[#F3F4F7] dark:bg-bg p-[5px] leading-[9px] -bottom-2 -right-2 text-[10px] text-cyan rounded-3xl">'
                        + Math.ceil((data.precipprob / 10)) * 10 + '%</div>') : ''}
            </div>
            <div class="time font-light text-[11px] text-[#90929E] dark:text-[#ACD8E7] pt-3">${time}</div>
            <div class="temp font-semibold text-lg leading-5 pt-1">${Math.round(tempConverter(data.temp))}°</div>
        </div>`;
        }
        leftHours = nHours - leftHours
    }

}

function renderDailyWeather(id, weatherData, days = 10, monthly = false) {
    section_id = monthly ? 'monthly' : 'daily-' + id;
    document.getElementById(section_id).innerHTML = ``
    let tempRange = minMax(weatherData.days, days)
    let delta = tempRange.tempmax - tempRange.tempmin
    // console.log(weatherData)
    // console.log(tempRange)

    for (let i = 0; i < days; i++) {
        let tempmin = Math.round(tempConverter(weatherData.days[i].tempmin))
        let tempmax = Math.round(tempConverter(weatherData.days[i].tempmax))
        let d = [{ day: 'numeric' }, { month: 'short' }];
        let w = [{ weekday: 'short' }];
        let date = join(new Date(weatherData.days[i].datetime), d, ' ');
        let weekday = join(new Date(weatherData.days[i].datetime), w, '-');
        if (weekday == 'сб' || weekday == 'вс') {
            color = 'text-yellow'
        } else {
            color = 'text-white'
        }
        if (i === 0) {
            data = "Сегодня";
        } else if (i === 1) {
            data = "Завтра";
        } else {
            data = weekday + "</span><span>, " + date + "</span>"
        }

        document.getElementById(section_id).innerHTML += `
            <div class="w-full py-[2px] font-light flex flex-nowrap gap-5 items-center">
                <div class="small-icon w-[52px] h-[52px] shrink-0 bg-white dark:bg-gradient-to-br dark:from-[#192D52] dark:to-[#112645] rounded-2xl py-1 relative">
                    <img class="w-[44px] h-[44px] mx-auto" src="img/assets/icons/weather-conditions/${weatherData.days[i].icon}.svg" alt="">
                    ${Math.round(weatherData.days[i].precipprob) > 20 ?
                ('<div class="absolute bg-[#F3F4F7] dark:bg-bg p-[5px] leading-[9px] -bottom-2 -right-2 text-[10px] text-[#90929E] dark:text-cyan rounded-3xl">'
                    + Math.ceil((weatherData.days[i].precipprob / 10)) * 10 + '%</div>') : ''}
                </div>
                <div class="w-28 shrink-0 flex flex-col gap-1 justify-center">
                    <div class="text-sm leading-[17px]  dark:text-[#FFFFFF]">
                        <span class="capitalize">${data}</span>
                    </div>
                    <div class="text-xs leading-[14px] text-[#90929E] dark:text-[#B6CBF4]">${weatherData.days[i].conditions}
                    </div>
                </div>
                <div class="my-4 w-full">
                    <div id="labels" class="flex justify-between mx-auto pb-2 leading-5">
                        <div class="text-[#90929E] dark:text-[#B6CBF4]">${tempmin}°</div>
                        <div>${tempmax}°</div>
                    </div>
                    <div class="relative h-1 rounded-md bg-[#D4D4D4] dark:bg-[#545B70]/40">
                        <div class="absolute h-full rounded-md bg-gradient-to-l from-[#DEDEDE] to-[#3FD5FE]"
                            style="left: ${(100 * (tempmin - tempRange.tempmin)) / delta}%; 
                            width: ${(100 * (tempmax - tempmin)) / delta}%">
                        </div>
                    </div>
                </div>
            </div>`;

    }
}

function renderMonthlyForecast(l) {
    getWeatherDataFromAPI(l.id, l.latitude, l.longitude, 30)
        .then(weatherData => {
            // console.log(weatherData)
            renderDailyWeather(l.id, weatherData, 30, true)
        })
}