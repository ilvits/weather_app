let locations = JSON.parse(decodeURIComponent(getCookie('locations')));
const currentDate = join(new Date, [{ day: 'numeric' }, { month: 'long' }], ' ');
const currentWeekday = join(new Date, [{ weekday: 'short' }], '-');
let currentHour = Number(join(new Date, [{ hour: 'numeric' }], '-'));
let nHours = 26 // Number of hours to display
let leftHours = 24 - currentHour
//TODO: переделать выбор количества дней
var days = (24 - leftHours) < nHours ? 2 : 1;
const slides = document.querySelector('#slides');
const menuLocations = document.querySelector('#menu-locations');
const containerLocations = document.querySelector('ol#locations-list');
const containerDefaults = document.querySelector('#left-menu-container').innerHTML;
const locationsEdit = document.querySelector('#locations-edit');
const locationName = document.querySelector('#locationName'); // Name of the location
let miniCards
let minmax
let cardLocationName
let weatherIcon
let editButtons



async function getWeather(location) {
    // console.log(location)
    let latitude = location.latitude
    let longitude = location.longitude
    const options = {
        // method: 'GET',
        // headers: { Accept: 'application/json', 'Accept-Encoding': 'gzip' }
    };
    // const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${latitude}%2C${longitude}?unitGroup=metric&elements=datetime%2CdatetimeEpoch%2Cname%2Ctempmax%2Ctempmin%2Ctemp%2Cfeelslike%2Chumidity%2Cprecipprob%2Cpreciptype%2Cwindspeed%2Cwinddir%2Cpressure%2Cuvindex%2Csevererisk%2Csunrise%2Csunset%2Cconditions%2Cdescription%2Cicon&include=days%2Chours%2Ccurrent&key=6M44EU7ZDRK49GFJHKBCX2JJC&contentType=json&lang=ru`
    const url = 'paris.json'
    await fetch(url, options)
        .then(response => response.json())
        .then(weatherData => appendData(location, weatherData))
        .catch(err => console.log(err));
}

HSOverlay.on('open', () => {
    console.log('menu opening =>')
})

HSOverlay.on('close', () => {
    console.log('<= menu closed')
    if ((locations !== null) || locations.length === 0) {
        locationName.innerText = Object.values(locations)[swiper.realIndex].name
    }
})

HSCollapse.on('open', () => {

})

HSCollapse.on('close', () => {

})

HSCollapse.on('hide', () => {
    console.log('▲ details closed ▲')
})

function deleteLocation(locationId, locationN) {
    console.log(locationId, locationN)
    swiper.removeSlide(locationId)
    delete (locations[locationN]);
    setCookie('locations', JSON.stringify(locations), 30);
}

function slideToId(index) {
    HSOverlay.close(menuLocations);
    swiper.slideTo(index, 300);
}

function swapElementsInObject(obj, fromId, toId) {
    // console.log(obj)
    var tempKey = 'test'
    var tempValue = JSON.stringify(Object.values(obj)[fromId])
    // console.log(`
    //     from: ${fromId} to: ${toId}
    //     temp key: ${tempKey}
    //     temp value: ${tempValue}
    // `)
    locations = addToObject(obj, tempKey, tempValue, toId)
    var json = JSON.stringify(locations, null, 4);
    // document.querySelector('#json').innerHTML = json;
    // console.log(locations)
    // console.log(tempValue)
    let location = locations[tempKey]
    // console.log(location)
}

function join(t, a, s) {
    function format(m) {
        let f = new Intl.DateTimeFormat('ru', m);
        return f.format(t);
    }
    return a.map(format).join(s);
}

function setupSlip(list) {
    list.addEventListener('slip:beforereorder', function (e) {
        if (e.target.classList.contains('no-reorder')) {
            e.preventDefault();
        }
    }, false);

    list.addEventListener('slip:beforeswipe', function (e) {
        if (e.target.nodeName == 'INPUT' || e.target.classList.contains('no-swipe')) {
            e.preventDefault();
        }
    }, false);

    list.addEventListener('slip:beforewait', function (e) {
        if (e.target.classList.contains('instant')) e.preventDefault();
    }, false);

    list.addEventListener('slip:afterswipe', function (e) {
        e.target.parentNode.appendChild(e.target);
    }, false);

    list.addEventListener('slip:reorder', function (e) {
        e.target.parentNode.insertBefore(e.target, e.detail.insertBefore);
        return false;
    }, false);
    return new Slip(list);
}

document.addEventListener("DOMContentLoaded", () => {
    generateSlides(locations);
    miniCards = document.querySelectorAll('.minicard')
    minmax = document.querySelectorAll('.minmax')
    cardLocationName = document.querySelectorAll('.cardLocationName')
    weatherIcon = document.querySelectorAll('.weather-icon')
    editButtons = document.querySelector('.edit-buttons')

    locationsEdit.onclick = () => {
        miniCards.forEach((element) => {
            // console.log(element)
            // console.log(editButtons)
            classToggle(element, 'w-[260px]', 'w-full', 'h-[80px]')
            classToggle(editButtons, 'w-[260px]', 'w-full', 'h-[80px]', 'opacity-0', 'pointer-events-none')
            element.children[0].classList.toggle('translate-y-1')
        })

        cardLocationName.forEach((e) => {
            if (e.innerText.length > 18) {
                e.classList.toggle('text-base')
            }
        })

        weatherIcon.forEach((e) => {
            classToggle(e, 'scale-0', 'opacity-0')
        })

        minmax.forEach((element) => {
            element.classList.toggle('translate-x-5')
            element.classList.toggle('opacity-0')
            // element.classList.toggle('invisible')
            // element.classList.toggle('hidden')
            element.parentElement.classList.toggle('translate-x-6')
            // document.getElementById('conditionEl').classList.toggle('invisible')
            // document.getElementById('conditionEl').classList.toggle('-translate-y-5')
            // document.getElementById('conditionEl').classList.toggle('opacity-0')

        })
    }

    setupSlip(document.getElementById('locations-list'));
    getLocationButton = document.querySelector('#get-current-location');
    getLocationButton.addEventListener('click', getCurrentLocation);
    // swapElementsInObject(locations, 1, 0)
    if (locations) {
        // console.log(locations)
        for (let [name, location] of Object.entries(locations)) {
            locationDataSet = {
                id: location.id,
                name: location.name,
                name_translit: location.name_translit,
                latitude: location.latitude,
                longitude: location.longitude,
                country_code: location.countryCode,
                region: location.region,
                country: location.country,
            }
            if (location.current == true) {
                getLocationButton.classList.add('hidden')
            } else {


            }
            // console.log(location);
            getWeather(locationDataSet);
        }
    }
    // document.getElementById('locationName').onclick = () => {
    //     // alert('vibrate');
    //     window.navigator.vibrate(200);
    //     // Haptics.heartbeat(500);
    // })
});

swiper.on('slideChange', function () {
    // console.log('slide changed');
    // console.log(swiper.realIndex);
    locationName.innerText = Object.values(locations)[swiper.realIndex].name
});

function generateSlides(locations) {
    // containerLocations.innerHTML = containerDefaults;
    if (locations) {
        for (let [name, location] of Object.entries(locations)) {
            locationName.innerText = Object.values(locations)[0].name
            // console.log(location.current)
            containerLocations.insertAdjacentHTML('beforeend', `
                <li id="card-${location.name_translit}" class="w-full h-[85px] z-[60] flex justify-center 
                hs-removing:-translate-y-16 hs-removing:scale-50 hs-removing:opacity-0 transform-gpu duration-500">
                    <!-- CONTENT-->
                        <div onclick=(slideToId(Object.keys(locations).indexOf('${name}'))) 
                        class="minicard no-swipe no-reorder absolute w-full bg-bg bg-gradient-to-br from-cyan/20 to-blue/20 z-20
                            p-4 transition-translate duration-300 transform-gpu rounded-2xl h-[85px]">
                            <div class="absolute left-4 flex-col transition-translate duration-300 transform-gpu">
                                <div class=" no-swipe no-reorder text-[10px] text-white/50 leading-3"> --:-- </div>
                                <div class="no-swipe no-reorder cardLocationName text-${(location.name.length > 15) ? 'base' : 'xl'} 
                                            flex  leading-5 transition-all duration-300 transform-gpu">
                                    <div>${location.name}</div>
                                </div>
                                <div class="condition no-swipe no-reorder text-xs leading-[14px] transition-translate duration-300 transform-gpu"></div>
                            </div>
                            <div>
                            ${location.current ? '<img class="w-5 absolute right-36" src="img/assets/icons/map-pin.svg">' : ''}
                            </div>
                            <div class="no-swipe no-reorder absolute right-4 flex flex-row gap-2 transition-translate duration-300 transform-gpu">
                                <div class="no-swipe no-reorder grid grid-flow-col gap-1 items-center transition-translate duration-300 transform-gpu">
                                    <div class="no-swipe no-reorder temp text-[32px] font-medium">
                                    </div>
                                    <div class="minmax grid justify-items-center grid-flow-row divide-y divide-white/20 leading-[14px] transition-translate duration-500 transform-gpu">
                                        <div class="no-swipe no-reorder tempmax text-xs ">
                                        </div>
                                        <div class="no-swipe no-reorder tempmin text-xs ">
                                        </div>
                                    </div>
                                </div>
                                <div class="no-swipe no-reorder weather-icon w-12 h-12 transition-translate duration-300 transform-gpu">
                                </div>
                                <div class="edit-icon absolute right-2 opacity-0 edit-icon w-12 h-12 
                                transition-translate duration-300 transform-gpu">
                                    <img class="no-swipe no-reorder" src="img/edit.svg" alt="">
                                </div>
                            </div>
                        </div>
                    <!-- BUTTONS-->
                    <div class="edit-buttons h-[85px] w-[260px] opacity-0 justify-between grid grid-flow-col transition-translate duration-300 transform-gpu">
                        <button type="button" data-hs-remove-element="#card-${location.name_translit}"
                            onclick="deleteLocation(Object.keys(locations).indexOf('${name}'), '${name}')"
                            class="location-del pointer-events-none">
                            <img src="img/delete.svg" width="40px" height="40px" alt="">
                        </button>
                        <button type="button" class="location-drag instant items-center font-light text-3xl text-white/30 pointer-events-none">☰</button>
                    </div>
                </li>
                `)
            // console.log(locationsList)

            // console.log(`${location}: ${value.name}`);
            slides.insertAdjacentHTML('beforeend', `
        <div id="slide-${location.id}" data-hash="${location.id}" class="swiper-slide bg-bg">
                        <!-- Start of Content -->
                        <div class="swiper-pagination"></div>
                            <div id="main_info-${location.id}" class="grid gap-4 
                                p-5 mx-4 mb-[27px] bg-gradient-to-br from-cyan/20 to-blue/20 rounded-3xl">

                                <div class="flex justify-between items-baseline w-full">
                                    <div id="current-time-${location.id}" class="font-semibold text-xl leading-5"></div>
                                    <div id="current-day-${location.id}" class="text-white/70 text-xs"></div>
                                </div>
                                <button type="button" id="details-toggle-${location.name_translit}" class="relative hs-collapse-toggle flex justify-between sm:justify-around items-center w-full
                                text-white" data-hs-collapse="#weather-details-${location.name_translit}">
                                    <div class="grid grid-flow-row justify-items-start">
                                        <div class="grid grid-flow-col">
                                            <div id="temperature-${location.id}" class="font-semibold text-[64px] leading-[75px]"></div>
                                            <div class="grid grid-flow-row divide-y divide-white/20 content-center px-4">
                                                <div></div>
                                                <div></div>
                                            </div>
                                        </div>
                                        <div id="conditions-${location.id}" class="font-light text-sm leading-[18px]"></div>
                                        <div id="feelslike-${location.id}" class="flex font-light text-sm leading-[18px]"></div>
                                    </div>
                                    <div id="weather-icon-${location.id}" class="w-[120px] h-[120px]"></div>
                                    <div id="expand-arrow-d-${location.name_translit}" class="absolute -bottom-2 flex justify-center w-full">
                                        <div class="w-[16px] h-[2px] bg-[rgb(117,155,248)] translate-x-[1px] rotate-[20deg] rounded-sm rounded-tr-none transition-all duration-500 transform-gpu"></div>
                                        <div class="w-[16px] h-[2px] bg-[rgb(117,155,248)] -translate-x-[1px] rotate-[-20deg] rounded-sm rounded-tl-none transition-all duration-500 transform-gpu"></div>
                                    </div>
                                </button>

                                <!--==-=== Weather Details ===-==-->

                                <section id="weather-details-${location.name_translit}" class="hs-collapse hidden grid gap-2 items-center overflow-hidden transition-all transform-gpu">

                                    <div class="flex gap-3 detail-item opacity-0 -translate-y-5 -translate-x-1 items-center transition-all duration-200 ease-in-out transform-gpu">
                                        <div class="flex flex-col">
                                            <img class="w-6 h-6 winddir !transform-gpu transition-all duration-[2s] ease-[cubic-bezier(0.46,2.1,0.36,0.78)]" 
                                                src="img/assets/icons/details/clarity_compass-line.svg" alt="">
                                        </div>
                                        <div class="flex flex-col">
                                            <div id="windspeed-${location.id}"
                                                class="flex text-sm font-semibold gap-1 items-baseline"></div>
                                            <div class="text-white/50 text-xs">Ветер</div>
                                        </div>
                                    </div>

                                    <div class="flex gap-3 detail-item opacity-0 -translate-y-5 -translate-x-1 items-center transition-all duration-200 ease-in-out transform-gpu">
                                        <div class="flex flex-col"><img class="w-6 h-6" src="img/assets/icons/details/precip.svg" alt="">
                                        </div>
                                        <div class="flex flex-col">
                                            <div id="precipprob-${location.id}" class="text-sm font-semibold">
                                            </div>
                                            <div class="text-white/50 text-xs">Осадки</div>
                                        </div>
                                    </div>

                                    <div class="row-start-3 xs:col-start-3 xs:row-start-1 col-start-1 
                                    flex gap-3 detail-item opacity-0 -translate-y-5 -translate-x-1 items-center transition-all duration-200 ease-in-out transform-gpu">
                                        <div class="flex flex-col"><img class="w-6 h-6" src="img/assets/icons/details/sunrise.svg" alt="">
                                        </div>
                                        <div class="flex flex-col">
                                            <div id="sunset-${location.id}" class="text-sm font-semibold">5:00</div>
                                            <div class="text-white/50 text-xs">Восход</div>
                                        </div>
                                    </div>

                                    <div class="flex gap-3 detail-item opacity-0 -translate-y-5 -translate-x-1 items-center transition-all duration-200 ease-in-out transform-gpu">
                                        <div class="flex flex-col"><img class="w-6 h-6" src="img/assets/icons/details/wi_barometer.svg" alt="">
                                        </div>
                                        <div class="flex flex-col">
                                            <div id="pressure-${location.id}" class="text-sm font-semibold"></div>
                                            <div class="text-white/50 text-xs">Давление</div>
                                        </div>
                                    </div>

                                    <div class="flex gap-3 detail-item opacity-0 -translate-y-5 -translate-x-1 items-center transition-all duration-200 ease-in-out transform-gpu">
                                        <div class="flex flex-col"><img class="w-6 h-6" src="img/assets/icons/details/ion_water-humidity.svg" alt="">
                                        </div>
                                        <div class="flex flex-col">
                                            <div id="humidity-${location.id}" class="text-sm font-semibold">
                                            </div>
                                            <div class="text-white/50 text-xs">Влажность</div>
                                        </div>
                                    </div>

                                    <div class="flex gap-3 detail-item opacity-0 -translate-y-5 -translate-x-1 items-center transition-all duration-200 ease-in-out transform-gpu">
                                        <div class="flex flex-col"><img class="w-6 h-6" src="img/assets/icons/details/sunset.svg" alt="">
                                        </div>
                                        <div class="flex flex-col">
                                            <div id="sunset-${location.id}" class="text-sm font-semibold">21:30</div>
                                            <div class="text-white/50 text-xs">Закат</div>
                                        </div>
                                    </div>

                                </section>

                                <!--==-=== Weather Details End ===-==-->

                            </div>
                            <div id="nav-${location.id}" class="flex flex-row gap-10 pl-8 mt-6 mb-1">
                                <button type='button' id="buttonToday-${location.id}"
                                    class="z-40 font-normal text-sm transition-all duration-700 text-white">
                                    Сегодня
                                </button type='button'>
                                <button type='button' id="buttonTomorrow-${location.id}"
                                    class="z-40 font-normal text-sm transition-all duration-500 text-white/50">Завтра
                                </button type='button'>
                            </div>
                            <div class="h-[160px] relative">
                                <div id="hourlyToday-${location.id}" class="swiper-no-swiping grid grid-flow-col gap-2 
                                overflow-x-scroll no-scrollbar pb-3 pt-4 px-4 transform transition-all duration-700 ease-[cubic-bezier(0.04,1.35,0.42,0.97)]">
                                </div>
                                <div id="hourlyTomorrow-${location.id}" class="swiper-no-swiping pointer-events-none grid grid-flow-col gap-3 
                                overflow-x-scroll no-scrollbar pb-3 pt-4 px-4 transform transition-all duration-700 ease-[cubic-bezier(0.04,1.35,0.42,0.97)] -translate-y-20 opacity-0 ">
                                </div>
                            </div>
                        <!-- <div class="block ml-6 mb-3 text-xl leading-6 font-light">Прогноз на 10 дней</div> --->
                            <div id="daily-${location.id}" class="mx-4 grid grid-flow-row divide-y divide-blue/20">
                            </div>
                        <!-- End of content -->
                        </div>`)
        }
    }
}

const classToggle = (el, ...args) => {
    args.map(e => el.classList.toggle(e))
}

function printHourlyWeather(id, days, weatherData, startDay = 0) {
    // console.log(weatherData)
    days += startDay
    if (startDay === 0) {
        hourlyPlaceholder = document.getElementById('hourlyToday-' + id)
    } else {
        hourlyPlaceholder = document.getElementById('hourlyTomorrow-' + id)
    }

    for (var day = startDay; day < days; day++) {
        if (day > 0) {
            currentHour = -1
        } else {
            currentHour = Number(join(new Date, [{ hour: 'numeric' }], '-'))
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
                nextDayTip = join(new Date(0).setUTCSeconds(data.datetimeEpoch), [{ day: 'numeric' }, { month: 'short' }], ' ')
            } else {
                nextDayTip = ''
            }

            hourlyPlaceholder.innerHTML += `
                <div class="relative grid grid-flow-row justify-items-center w-[58px] h-[98px] p-2 mb-4  rounded-lg">
                    <div class="-top-[18px] absolute text-xs text-white/50">${nextDayTip}</div>
                    <div class="font-light text-xs text-white">
                        ${time}
                    </div>
                    <div class="">
                        <img class="w-10 h-10" src="img/assets/icons/weather-conditions/${data.icon}.svg">
                    </div>
                    <div class="grid grid-flow-row justify-items-center justify-center">
                        <div id="hourly-now" class="text-xl leading-6 font-semibold">
                            ${Math.round(data.temp)}°
                        </div>
                    </div>
                    <div class="absolute -bottom-[22px] text-[10px] leading-3 text-[rgb(111,210,250)] text-white/50 w-full flex justify-center gap-1">
                        ${Math.round(data.precipprob) > 20 ? ('<img class="w-3 h-3" src="img/precip.svg">' + Math.ceil((data.precipprob / 10)) * 10 + '%') : ''}
                    </div>
                </div>`;
        }
        leftHours = nHours - leftHours
    }
}

function appendData(location, weatherData) {
    // console.log(weatherData)

    const buttonTomorrow = document.getElementById('buttonTomorrow-' + location.id);
    const buttonToday = document.getElementById('buttonToday-' + location.id);
    const temperature = document.getElementById('temperature-' + location.id);
    const weatherIcon = document.getElementById('weather-icon-' + location.id);
    const conditions = document.getElementById('conditions-' + location.id);
    const currentDay = document.getElementById('current-day-' + location.id);
    const feelslike = document.getElementById('feelslike-' + location.id);
    const humidity = document.getElementById('humidity-' + location.id);
    const pressure = document.getElementById('pressure-' + location.id);
    const windspeed = document.getElementById('windspeed-' + location.id);
    const precipprob = document.getElementById('precipprob-' + location.id);
    const hourlyToday = document.getElementById('hourlyToday-' + location.id);
    const hourlyTomorrow = document.getElementById('hourlyTomorrow-' + location.id);

    printHourlyWeather(location.id, days, weatherData)
    printHourlyWeather(location.id, days, weatherData, 1)

    // console.log(locations)
    // console.log(location.name)
    // console.log(location)
    const weatherDetailsToggle = document.querySelector(`#details-toggle-${location.name_translit}`)
    const detailInfo = document.querySelector(`#weather-details-${location.name_translit}`)
    const detailItems = document.querySelectorAll(`#weather-details-${location.name_translit} .detail-item`)

    weatherDetailsToggle.onclick = () => {
        if (detailInfo.clientHeight > 0) {
            console.log('▲ details closing... ▲')

            document.querySelector(`#expand-arrow-d-${location.name_translit}`).children[0].classList.remove('rotate-[-20deg]')
            document.querySelector(`#expand-arrow-d-${location.name_translit}`).children[1].classList.remove('rotate-[20deg]')
            document.querySelector(`#expand-arrow-d-${location.name_translit}`).children[0].classList.add('rotate-[20deg]')
            document.querySelector(`#expand-arrow-d-${location.name_translit}`).children[1].classList.add('rotate-[-20deg]')

            detailItems.forEach((el) => {
                el.classList.add('opacity-0', '-translate-y-5', '-translate-x-1');
            })

            detailInfo.querySelector('.winddir').classList.remove('rotate-[1turn]')
        } else {
            console.log('▼ details opening... ▼')
            document.querySelector(`#expand-arrow-d-${location.name_translit}`).children[0].classList.remove('rotate-[20deg]')
            document.querySelector(`#expand-arrow-d-${location.name_translit}`).children[1].classList.remove('rotate-[-20deg]')
            document.querySelector(`#expand-arrow-d-${location.name_translit}`).children[0].classList.add('rotate-[-20deg]')
            document.querySelector(`#expand-arrow-d-${location.name_translit}`).children[1].classList.add('rotate-[20deg]')
            detailItems.forEach((el, index) => {
                var interval = 35;
                setTimeout(() => {
                    el.classList.remove('opacity-0', '-translate-y-5', '-translate-x-1');
                }, index * interval);
            })
            detailInfo.querySelector('.winddir').classList.add('rotate-[1turn]')
        }
    }


    buttonToday.onclick = () => {
        buttonTomorrow.classList.remove('text-white')
        buttonTomorrow.classList.add('text-white/50')
        buttonToday.classList.add('text-white')
        buttonToday.classList.remove('text-white/50')
        hourlyTomorrow.classList.add('-translate-y-20', 'opacity-0', 'z-0', 'pointer-events-none')
        hourlyTomorrow.classList.remove('-translate-y-[142px]', 'opacity-100')
        hourlyToday.classList.remove('-translate-y-20', 'opacity-0', 'z-0', 'pointer-events-none')
        hourlyToday.classList.add('translate-y-0', 'opacity-100')
    }

    buttonTomorrow.onclick = () => {
        buttonToday.classList.remove('text-white')
        buttonToday.classList.add('text-white/50')
        buttonTomorrow.classList.add('text-white')
        buttonTomorrow.classList.remove('text-white/50')
        hourlyToday.classList.add('-translate-y-20', 'opacity-0', 'z-0', 'pointer-events-none')
        hourlyToday.classList.remove('translate-y-0', 'opacity-100')
        hourlyTomorrow.classList.remove('-translate-y-20', 'opacity-0', 'z-0', 'pointer-events-none')
        hourlyTomorrow.classList.add('-translate-y-[142px]', 'opacity-100')
    }
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
    }
    let style = document.createElement('style');
    let rotate = `
        .winddir {
            transform: rotate(-${winddir}deg);
        }`;
    style.innerHTML = rotate;
    document.getElementsByTagName('head')[0].appendChild(style);

    temperature.innerHTML = `${Math.round(currentWeather.temp)}°`
    conditions.innerHTML = currentWeather.conditions
    currentDay.innerHTML = `${currentWeekday}, ${currentDate}`
    weatherIcon.innerHTML = `<img src="img/assets/icons/weather-conditions/${currentWeather.icon}.svg">`
    feelslike.innerHTML = `Ощущается как
        <div class="font-semibold pl-1">
            ${Math.round(currentWeather.feelslike)}°
        </div>`
    humidity.innerHTML = `
        ${Math.round(currentWeather.humidity)}
        <span class="text-sm font-medium">%</span>`
    pressure.innerHTML = `
        ${Math.round(Number(currentWeather.pressure) * 0.1 / 0.1333223684)}
        <span class="text-sm font-medium">мм</span>`
    precipprob.innerHTML = `${Math.round(currentWeather.precipprob)}
        <span class="text-sm font-medium">%</span>`
    windspeed.innerHTML = `
        ${Math.round(currentWeather.windspeed)} 
        <span class="text-sm font-medium">км/ч</span>`

    document.querySelector(`#card-${location.name_translit} .temp`).innerText = Math.round(todayWeather.temp)
    document.querySelector(`#card-${location.name_translit} .condition`).innerText = todayWeather.conditions
    document.querySelector(`#card-${location.name_translit} .tempmax`).innerText = Math.round(todayWeather.tempmax)
    document.querySelector(`#card-${location.name_translit} .tempmin`).innerText = Math.round(todayWeather.tempmin)
    document.querySelector(`#card-${location.name_translit} .weather-icon`).innerHTML = `
    <img no-swipe no-reorder src="img/assets/icons/weather-conditions/${todayWeather.icon}.svg">`

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
        document.getElementById('daily-' + location.id).innerHTML += `
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
}
