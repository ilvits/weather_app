let userCountry
let locationDataSet
function setAttributes(el, attrs) {
    for (var key in attrs) {
        el.setAttribute(key, attrs[key]);
    }
}
fetch("https://ipinfo.io/json?token=bf205b8bacf2c5").then(
    (response) => response.json()
).then((jsonResponse) => { userCountry = jsonResponse.country })

// search location input
const leftMenuHeader = document.querySelector('#left-menu-header')
const listOfLocations = document.querySelector('ol#locations-list')
const cancelSearchButton = document.querySelector('#cancel-button')
const input = document.querySelector('#search-input')
let suggestionList = document.querySelector('#suggestion-list')
const leftMenuContainer = document.querySelector('#left-menu-container')
const newLocationPreviewEl = document.querySelector('#new-location-preview')

input.onfocus = searchFocus;
input.onkeyup = getGeoData;
cancelSearchButton.addEventListener('click', searchCancel);

getLocationButton = document.querySelector('#get-current-location')
getLocationButton.addEventListener('click', getCurrentLocation);

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
    var crd = position.coords;
    var url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/geolocate/address";
    var token = "6fdf0cb5e0a5e620935f51adf9e7002993296755";
    var query = { lat: crd.latitude, lon: crd.longitude };

    var options = {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": "Token " + token
        },
        body: JSON.stringify(query)
    }

    fetch(url, options)
        .then(response => response.json())
        .then(result => {
            console.log(result.suggestions[0])
            console.log(`
                Широта: ${crd.latitude}
                Долгота: ${crd.longitude}
                Плюс-минус ${crd.accuracy} метров.
                `);
            previewCurrentLocation(result.suggestions[0])
        })
        .catch(error => console.log("error", error));
}


function searchFocus() {
    input.placeholder = 'Введите название'
    input.classList.add('w-[calc(100vw-120px)]')
    input.classList.remove('w-full', 'text-white/50')
    leftMenuContainer.classList.remove('overflow-y-scroll', 'overflow-x-hidden')
    cancelSearchButton.classList.remove('-right-20')
    cancelSearchButton.classList.add('right-5')
    input.parentNode.classList.add('-translate-y-16')
    listOfLocations.classList.add('-translate-y-14', 'scale-[0.96]', '-z-10')
    leftMenuHeader.classList.add('opacity-0', 'invisible', '-translate-y-2', 'blur-xl', 'scale-[0.99]')
    document.querySelector('#backdrop').classList.add('backdrop-blur-lg', 'z-0')
    document.querySelector('#backdrop').classList.remove('invisible', 'opacity-0')
    suggestionList.classList.remove('invisible', 'opacity-0')
}
function searchCancel() {
    input.placeholder = 'Найти новое место'
    input.value = ''
    input.classList.remove('w-[calc(100vw-120px)]')
    input.classList.add('w-full', 'text-white/50')
    leftMenuContainer.classList.add('overflow-y-scroll', 'overflow-x-hidden')
    cancelSearchButton.classList.add('-right-20')
    cancelSearchButton.classList.remove('right-5')
    input.parentNode.classList.remove('-translate-y-16')
    listOfLocations.classList.remove('-translate-y-14', 'scale-[0.96]', '-z-10')
    leftMenuHeader.classList.remove('opacity-0', 'invisible', '-translate-y-2', 'blur-xl', 'scale-[0.99]')
    document.querySelector('#backdrop').classList.add('invisible', 'opacity-0')
    document.querySelector('#backdrop').classList.remove('backdrop-blur-lg')
    suggestionList.classList.add('invisible', 'opacity-0')
    suggestionList.innerHTML = ''
}

function getGeoData(event) {
    const regex = /^[a-zA-ZАА-Яа-яёЁ.,\d\-_\s]+$/i;
    const str = event.target.value;

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

let resultList
let rawList = new Object()

function parseSuggestions(suggestions) {

    let rawList = JSON.parse(suggestions).suggestions
    // console.log(rawList)
    suggestionList.innerHTML = ''
    suggestionList.classList.remove('invisible', 'opacity-0')
    for (const [key, value] of Object.entries(rawList)) {
        // console.log(value)
        let id = (value.data.fias_id !== null) ? value.data.fias_id : value.data.geoname_id;
        let action = 'previewWeather(this)'
        if (value.data.fias_level === "65") {
            delete (rawList[key]);
            rawList.length -= 1;
        } else {
            let searchText = input.value
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
            if ((locations) && (Object.keys(locations).includes(id))) {
                action = ''
                locationLi.classList.add('pointer-events-none', 'text-slate-500', 'py-2', 'pr-2', 'overflow-hidden', 'overflow-ellipsis', 'whitespace-nowrap')
                text = `${name}, ${region}${(countryCode !== userCountry) ? ', ' + country : ''}`
            } else {
                action = 'previewWeather(this)'
                locationLi.classList.add('py-2', 'pr-2', 'overflow-hidden', 'overflow-ellipsis', 'whitespace-nowrap')
                text = `${name.replace(capText, `<span class="text-yellow">${capText}</span>`)}, <span class="text-white/50">${region}${(countryCode !== userCountry) ? ', ' + country : ''}</span>`
            }

            locationLi.innerHTML = text
            suggestionList.appendChild(locationLi)
            setAttributes(locationLi, {
                'data-id': id,
                'data-name': (value.data.settlement !== null) ? value.data.settlement : value.data.city,
                'data-name_translit': name_translit,
                'data-latitude': latitude,
                'data-longitude': longitude,
                'data-countrycode': countryCode,
                'data-region': region,
                'data-country': country,
                'onclick': action,
            });
            // console.log(locationLi)
            // console.log(suggestionList)
            // let text = `
            // <li class="py-2 pr-2 overflow-hidden overflow-ellipsis whitespace-nowrap" data-countryCode="${countryCode}" 
            //     data-id="${id}" 
            //     data-name="${name}" 
            //     data-latitude="${latitude}"
            //     data-longitude="${longitude}" 
            //     onclick="previewWeather(this)">
            //     ${locationName.replace(capText, `<span class="text-yellow">${capText}</span>`)}, <span class="text-white/50">${region}${(countryCode !== userCountry) ? ', ' + country : ''}</span>
            // </li>`
            // suggestionList.innerHTML += text
        }
    }
}

const previewWindow = document.querySelector(`#preview-window`)

function hideWeatherPreview() {
    newLocationPreviewEl.classList.add('opacity-0', 'translate-y-[600px]', '-z-10');
    newLocationPreviewEl.classList.remove('z-[130]');
    setTimeout(() => {
        newLocationPreviewEl.classList.add('hidden');
        previewWindow.innerHTML = '';
    }, 300);
}

function previewWeather(location) {
    console.log('location: ')
    console.log(location)
    locationDataSet = {
        searchText: input.value,
        name: location.dataset.name,
        name_translit: location.dataset.name_translit,
        latitude: location.dataset.latitude,
        longitude: location.dataset.longitude,
        countryCode: location.dataset.countryCode,
        id: location.dataset.id,
        region: location.dataset.region,
        country: location.dataset.country,
    }

    const options = {
        method: 'GET',
        // headers: { Accept: 'application/json', 'Accept-Encoding': 'gzip' }
    };

    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${latitude}%2C${longitude}?unitGroup=metric&elements=datetime%2CdatetimeEpoch%2Cname%2Ctempmax%2Ctempmin%2Ctemp%2Cfeelslike%2Chumidity%2Cprecipprob%2Cpreciptype%2Cwindspeed%2Cwinddir%2Cpressure%2Cuvindex%2Csevererisk%2Csunrise%2Csunset%2Cconditions%2Cdescription%2Cicon&include=days%2Chours%2Ccurrent&key=6M44EU7ZDRK49GFJHKBCX2JJC&contentType=json&lang=ru`
    // const url = 'paris.json'
    fetch(url, options)
        .then(response => response.json())
        .then(weatherData => generatePreview(locationDataSet, weatherData))
        .catch(err => console.log(err));
}

function previewCurrentLocation(location) {
    //
    // geo_lat: "59.890297"
    // ​​​
    // geo_lon: "30.419237"
    // ​​​
    // geoname_id: "498817"

    console.log('location: ')
    console.log(location)
    locationDataSet = {
        name: location.data.city,
        name_translit: translit((location.data.settlement !== null) ? location.data.settlement : location.data.city),
        latitude: location.data.geo_lat,
        longitude: location.data.geo_lon,
        countryCode: location.data.country_iso_code,
        id: location.data.fias_id,
        region: location.data.region,
        country: location.data.country,
    }

    const options = {
        method: 'GET',
        // headers: { Accept: 'application/json', 'Accept-Encoding': 'gzip' }
    };

    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${latitude}%2C${longitude}?unitGroup=metric&elements=datetime%2CdatetimeEpoch%2Cname%2Ctempmax%2Ctempmin%2Ctemp%2Cfeelslike%2Chumidity%2Cprecipprob%2Cpreciptype%2Cwindspeed%2Cwinddir%2Cpressure%2Cuvindex%2Csevererisk%2Csunrise%2Csunset%2Cconditions%2Cdescription%2Cicon&include=days%2Chours%2Ccurrent&key=6M44EU7ZDRK49GFJHKBCX2JJC&contentType=json&lang=ru`
    // const url = 'paris.json'
    fetch(url, options)
        .then(response => response.json())
        .then(weatherData => generatePreview(locationDataSet, weatherData))
        .catch(err => console.log(err));
}

function generatePreview(location, weatherData) {
    console.log(location)
    name_translit = location.name_translit
    id = location.id
    addButton = document.querySelector('#add-weather-preview')
    addButton.dataset.locationId = id
    // console.log(name_translit)
    // console.log(locations.name_translit)
    // const name_translit = translit((location.data.settlement !== null) ? location.data.settlement : location.data.city)
    // const name_translit = location.data.name_translit
    const conditions = weatherData.currentConditions.conditions
    const datetime = weatherData.currentConditions.datetime
    const temp = weatherData.currentConditions.temp
    const feelslike = weatherData.currentConditions.feelslike
    const icon = weatherData.currentConditions.icon
    const pressure = weatherData.currentConditions.pressure
    const precipprob = weatherData.currentConditions.precipprob
    const tempmax = weatherData.days[0].tempmax
    const tempmin = weatherData.days[0].tempmin
    const humidity = weatherData.currentConditions.humidity
    const windspeed = weatherData.currentConditions.windspeed
    const winddir = weatherData.currentConditions.winddir
    const sunrise = weatherData.currentConditions.sunrise
    const sunset = weatherData.currentConditions.sunset

    previewWindow.innerHTML = `
            <div id="id-${name_translit}" data-hash="${id}" data-id="${id}" class="preview-window">
                        <!-- Start of Content -->
                            <div id="main_info-${id}" class="grid gap-4 
                                p-5 mx-4 mb-[27px] bg-gradient-to-br from-cyan/20 to-blue/20 rounded-3xl">

                                <div class="flex justify-between items-baseline w-full">
                                    <div id="current-time-${id}" class="font-semibold text-xl leading-5">${datetime}</div>
                                    <div id="current-day-${id}" class="text-white/70 text-xs"></div>
                                </div>
                                <button type="button" id="details-toggle-${name_translit}" class="relative hs-collapse-toggle flex justify-between sm:justify-around items-center w-full
                                text-white" data-hs-collapse="#weather-details-${name_translit}">
                                    <div class="grid grid-flow-row justify-items-start">
                                        <div id="temperature-${id}" class="font-semibold text-[64px] leading-[75px]">${temp}</div>
                                        <div id="conditions-${id}" class="font-light text-sm leading-[18px]">${conditions}</div>
                                    </div>
                                    <div id="weather-icon-${id}" class="w-[120px] h-[120px]"><img src="img/assets/icons/weather-conditions/${icon}.svg"></div>
                                    <div id="expand-arrow-d-${name_translit}" class="absolute -bottom-2 flex justify-center w-full">
                                        <div class="w-[16px] h-[2px] bg-[rgb(117,155,248)] translate-x-[1px] rotate-[20deg] rounded-sm rounded-tr-none transition-all duration-500 transform-gpu"></div>
                                        <div class="w-[16px] h-[2px] bg-[rgb(117,155,248)] -translate-x-[1px] rotate-[-20deg] rounded-sm rounded-tl-none transition-all duration-500 transform-gpu"></div>
                                    </div>
                                </button>

                                <!--==-=== Weather Details ===-==-->

                                <section id="weather-details-${name_translit}" class="hs-collapse hidden grid gap-2 items-center overflow-hidden transition-all transform-gpu">

                                    <div class="flex gap-3 detail-item  opacity-0 -translate-y-5 -translate-x-1  items-center transition-all duration-200 ease-in-out transform-gpu">
                                        <div class="flex flex-col">
                                            <img class="w-6 h-6 winddir !transform-gpu transition-all duration-[2s] ease-[cubic-bezier(0.46,2.1,0.36,0.78)]" 
                                                src="img/assets/icons/details/clarity_compass-line.svg" alt="">
                                        </div>
                                        <div class="flex flex-col">
                                            <div id="windspeed-${id}"
                                                class="flex text-sm font-semibold gap-1 items-baseline">${windspeed}</div>
                                            <div class="text-white/50 text-xs">Ветер</div>
                                        </div>
                                    </div>

                                    <div class="flex gap-3 detail-item  opacity-0 -translate-y-5 -translate-x-1  items-center transition-all duration-200 ease-in-out transform-gpu">
                                        <div class="flex flex-col"><img class="w-6 h-6" src="img/assets/icons/details/precip.svg" alt="">
                                        </div>
                                        <div class="flex flex-col">
                                            <div id="precipprob-${id}" class="text-sm font-semibold">${precipprob}
                                            </div>
                                            <div class="text-white/50 text-xs">Осадки</div>
                                        </div>
                                    </div>

                                    <div class="row-start-3 xs:col-start-3 xs:row-start-1 col-start-1 
                                    flex gap-3 detail-item  opacity-0 -translate-y-5 -translate-x-1  items-center transition-all duration-200 ease-in-out transform-gpu">
                                        <div class="flex flex-col"><img class="w-6 h-6" src="img/assets/icons/details/sunrise.svg" alt="">
                                        </div>
                                        <div class="flex flex-col">
                                            <div id="sunset-${id}" class="text-sm font-semibold">${sunrise}</div>
                                            <div class="text-white/50 text-xs">Восход</div>
                                        </div>
                                    </div>

                                    <div class="flex gap-3 detail-item  opacity-0 -translate-y-5 -translate-x-1  items-center transition-all duration-200 ease-in-out transform-gpu">
                                        <div class="flex flex-col"><img class="w-6 h-6" src="img/assets/icons/details/wi_barometer.svg" alt="">
                                        </div>
                                        <div class="flex flex-col">
                                            <div id="pressure-${id}" class="text-sm font-semibold">${pressure}</div>
                                            <div class="text-white/50 text-xs">Давление</div>
                                        </div>
                                    </div>

                                    <div class="flex gap-3 detail-item  opacity-0 -translate-y-5 -translate-x-1  items-center transition-all duration-200 ease-in-out transform-gpu">
                                        <div class="flex flex-col"><img class="w-6 h-6" src="img/assets/icons/details/ion_water-humidity.svg" alt="">
                                        </div>
                                        <div class="flex flex-col">
                                            <div id="humidity-${id}" class="text-sm font-semibold">${humidity}
                                            </div>
                                            <div class="text-white/50 text-xs">Влажность</div>
                                        </div>
                                    </div>

                                    <div class="flex gap-3 detail-item  opacity-0 -translate-y-5 -translate-x-1  items-center transition-all duration-200 ease-in-out transform-gpu">
                                        <div class="flex flex-col"><img class="w-6 h-6" src="img/assets/icons/details/sunset.svg" alt="">
                                        </div>
                                        <div class="flex flex-col">
                                            <div id="sunset-${id}" class="text-sm font-semibold">${sunset}</div>
                                            <div class="text-white/50 text-xs">Закат</div>
                                        </div>
                                    </div>

                                </section>

                                <!--==-=== Weather Details End ===-==-->

                            </div>
                            <div id="nav-${id}" class="flex flex-row gap-10 pl-8 mt-6 mb-1">
                                <button type='button' id="buttonToday-${id}"
                                    class="z-40 font-normal text-sm transition-all duration-700 text-white">
                                    Сегодня
                                </button type='button'>
                                <button type='button' id="buttonTomorrow-${id}"
                                    class="z-40 font-normal text-sm transition-all duration-500 text-white/50">
                                    Завтра
                                </button type='button'>
                            </div>
                            <div class="h-[160px] relative">
                                <div id="hourlyToday-${id}" class="swiper-no-swiping grid grid-flow-col gap-2 
                                overflow-x-scroll no-scrollbar pb-3 pt-4 px-4 transform transition-all duration-700 ease-[cubic-bezier(0.04,1.35,0.42,0.97)]">
                                </div>
                                <div id="hourlyTomorrow-${id}" class="swiper-no-swiping pointer-events-none grid grid-flow-col gap-3 
                                overflow-x-scroll no-scrollbar pb-3 pt-4 px-4 transform transition-all duration-700 ease-[cubic-bezier(0.04,1.35,0.42,0.97)] -translate-y-20 opacity-0 ">
                                </div>
                            </div>
                        <!-- <div class="block ml-6 mb-3 text-xl leading-6 font-light">Прогноз на 10 дней</div> --->
                            <div id="daily-${id}" class="mx-4 grid grid-flow-row divide-y divide-blue/20">
                            </div>
                        <!-- End of content -->`

    const buttonTomorrow = document.getElementById('buttonTomorrow-' + id);
    const buttonToday = document.getElementById('buttonToday-' + id);
    const hourlyToday = document.getElementById('hourlyToday-' + id);
    const hourlyTomorrow = document.getElementById('hourlyTomorrow-' + id);

    buttonToday.onclick = () => {
        buttonToday.classList.add('text-white')
        hourlyToday.classList.add('translate-y-0', 'opacity-100')
        buttonToday.classList.remove('text-white/50')
        hourlyToday.classList.remove('-translate-y-20', 'opacity-0', 'z-0', 'pointer-events-none')
        buttonTomorrow.classList.add('text-white/50')
        hourlyTomorrow.classList.add('-translate-y-20', 'opacity-0', 'z-0', 'pointer-events-none')
        buttonTomorrow.classList.remove('text-white')
        hourlyTomorrow.classList.remove('-translate-y-[142px]', 'opacity-100')
    }

    buttonTomorrow.onclick = () => {
        buttonToday.classList.add('text-white/50')
        hourlyToday.classList.add('-translate-y-20', 'opacity-0', 'z-0', 'pointer-events-none')
        buttonToday.classList.remove('text-white')
        hourlyToday.classList.remove('translate-y-0', 'opacity-100')
        buttonTomorrow.classList.add('text-white')
        hourlyTomorrow.classList.add('-translate-y-[142px]', 'opacity-100')
        buttonTomorrow.classList.remove('text-white/50')
        hourlyTomorrow.classList.remove('-translate-y-20', 'opacity-0', 'z-0', 'pointer-events-none')
    }
    printHourlyWeather(id, days, weatherData)
    printHourlyWeather(id, days, weatherData, 1)

    // console.log(name_translit)
    const weatherDetailsToggle = document.querySelector(`#details-toggle-${name_translit}`)
    const detailInfo = document.querySelector(`#weather-details-${name_translit}`)
    const detailItems = document.querySelectorAll(`#weather-details-${name_translit} .detail-item`)

    weatherDetailsToggle.onclick = () => {
        if (detailInfo.clientHeight > 0) {
            console.log('▲ details closing... ▲')

            document.querySelector(`#expand-arrow-d-${name_translit}`).children[0].classList.remove('rotate-[-20deg]')
            document.querySelector(`#expand-arrow-d-${name_translit}`).children[1].classList.remove('rotate-[20deg]')
            document.querySelector(`#expand-arrow-d-${name_translit}`).children[0].classList.add('rotate-[20deg]')
            document.querySelector(`#expand-arrow-d-${name_translit}`).children[1].classList.add('rotate-[-20deg]')

            detailItems.forEach((el) => {
                el.classList.add('opacity-0', '-translate-y-5', '-translate-x-1');
            })

            detailInfo.querySelector('.winddir').classList.remove('rotate-[1turn]')
        } else {
            console.log('▼ details opening... ▼')
            document.querySelector(`#expand-arrow-d-${name_translit}`).children[0].classList.remove('rotate-[20deg]')
            document.querySelector(`#expand-arrow-d-${name_translit}`).children[1].classList.remove('rotate-[-20deg]')
            document.querySelector(`#expand-arrow-d-${name_translit}`).children[0].classList.add('rotate-[-20deg]')
            document.querySelector(`#expand-arrow-d-${name_translit}`).children[1].classList.add('rotate-[20deg]')
            detailItems.forEach((el, index) => {
                var interval = 35;
                setTimeout(() => {
                    el.classList.remove('opacity-0', '-translate-y-5', '-translate-x-1');
                }, index * interval);
            })
            detailInfo.querySelector('.winddir').classList.add('rotate-[1turn]')
        }
    }

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
        document.getElementById('daily-' + id).innerHTML += `
                <div class="flex px-2 py-2 items-center">
                    <div class="grow shrink-0 w-20 flex flex-col">
                        <div class="text-xs text-white/50">${date}</div>
                        <div class="text-[15] leading-[18px] font-normal capitalize ${color}">${weekday}</div>
                    </div>
                    <div class="grow-0 shrink-0 w-32 gap-4 flex justify-center items-center">

                        <div class="text-xs leading-3 text-[#6A9CFF] text-white/50 flex justify-center gap-1">
                        ${Math.round(data.precipprob) > 20 ? ('<img class="w-3 h-3" src="img/precip.svg">' + Math.ceil((data.precipprob / 10)) * 10 + '%') : ''}
                    </div>
                    <div >
                        <img class="w-6 h-6" src="img/assets/icons/weather-conditions/small/${weatherData.days[i].icon}.svg">
                    </div>
                    </div>
                    <div class="grow flex gap-2 justify-end items-baseline">
                        <div class="font-normal text-lg text-white w-6 text-end">${Math.round(weatherData.days[i].tempmax)}°</div>
                        <div class="text-xs text-violet w-5 text-end">${Math.round(weatherData.days[i].tempmin)}°</div>
                    </div>
                </div>`;
    }
    const locationPreviewHeader = document.querySelector('#location-name')
    setTimeout(() => {
        newLocationPreviewEl.classList.remove('opacity-0', 'translate-y-[600px]')
        newLocationPreviewEl.classList.add('z-[130]')
        locationPreviewHeader.innerHTML = location.name
    }, 1);
    newLocationPreviewEl.classList.remove('hidden', '-z-10');

}


function addNewLocation() {
    // add to object
    const id = locationDataSet.id
    const name = locationDataSet.name;
    const name_translit = locationDataSet.name_translit;
    const region = locationDataSet.region;
    const country = locationDataSet.country;
    const latitude = locationDataSet.latitude;
    const longitude = locationDataSet.longitude;
    const countryCode = locationDataSet.countrycode;

    console.log(id, longitude, latitude, country, name, countryCode, region, name_translit)
    locations = addToObject(locations, id, {
        "name": name,
        "name_translit": name_translit,
        "id": id,
        "latitude": latitude,
        "longitude": longitude,
        "region": region,
        "country": country,
        "countryCode": countryCode,
    })

    // add to cookies
    setCookie('locations', JSON.stringify(locations), 30);
    document.location.reload();
}