let locations = JSON.parse(decodeURIComponent(getCookie('locations')));
const currentDate = join(new Date, [{ day: 'numeric' }, { month: 'short' }], ' ');
const currentDateLong = join(new Date, [{ day: 'numeric' }, { month: 'long' }], ' ');
const currentWeekday = join(new Date, [{ weekday: 'short' }], '-');
const currentWeekdayLong = join(new Date, [{ weekday: 'long' }], '-');
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

function getTime2Digits(date, offset = 0) {
    return String(date.getHours() + offset).padStart(2, '0') + ":" + String(date.getMinutes()).padStart(2, '0')
}


async function getWeather(location) {
    // console.log(location)
    let latitude = location.latitude
    let longitude = location.longitude
    const options = {
        // method: 'GET',
        // headers: { Accept: 'application/json', 'Accept-Encoding': 'gzip' }
    };
    // const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${latitude}%2C${longitude}?unitGroup=metric&elements=datetime%2CdatetimeEpoch%2Cname%2Ctempmax%2Ctempmin%2Ctemp%2Cfeelslike%2Chumidity%2Cprecipprob%2Cpreciptype%2Cwindspeed%2Cwinddir%2Cpressure%2Cuvindex%2Csevererisk%2CsunriseEpoch%2CsunsetEpoch%2Cconditions%2Cdescription%2Cicon&include=days%2Chours%2Ccurrent&key=6M44EU7ZDRK49GFJHKBCX2JJC&contentType=json&lang=ru`
    const url = 'paris.json'
    await fetch(url, options)
        .then(response => response.json())
        .then(weatherData => appendData(location, weatherData))
        .catch(err => console.log(err));
}

HSOverlay.on('open', ($offcanvasEl) => {
    if ($offcanvasEl.id == "menu-locations") {
        document.querySelector('#fav_btn').classList.add('!text-yellow')
        document.querySelector('#fav_btn_svg').classList.add('!stroke-yellow')
    } else if ($offcanvasEl.id == "menu-settings") {
        document.querySelector('#settings_btn').classList.add('!text-yellow')
        document.querySelector('#settings_btn_svg').classList.add('!stroke-yellow')
    }
})

HSOverlay.on('close', ($offcanvasEl) => {
    // console.log('<= menu closed', $offcanvasEl.id)
    if ((locations !== null) || locations.length === 0) {
        locationName.innerText = Object.values(locations)[swiper.realIndex].name
    }
    if ($offcanvasEl.id == "menu-locations") {
        // console.log('locations')
        // console.log(document.querySelector('#fav_btn').classList)
        document.querySelector('#fav_btn').classList.remove('!text-yellow')
        document.querySelector('#fav_btn_svg').classList.remove('!stroke-yellow')
    } else if ($offcanvasEl.id == "menu-settings") {
        console.log('settings')
        document.querySelector('#settings_btn').classList.remove('!text-yellow')
        document.querySelector('#settings_btn_svg').classList.remove('!stroke-yellow')
    }
})

HSCollapse.on('open', (w) => {
    // toggleTxt = document.querySelectorAll('.collapse_toggle')
    // toggleTxt.forEach((t) => {
    //     t.innerText = 'Свернуть'
    // })
})

HSCollapse.on('close', () => {

})

HSCollapse.on('hide', () => {
    // console.log('▲ details closed ▲')
    // toggleTxt = document.querySelectorAll('.collapse_toggle')
    // toggleTxt.forEach((t) => {
    //     t.innerText = 'Подробнее'
    // })
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
    generateFavourites(locations);
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


function generateFavourites(locations) {
    if (locations) {
        for (let [name, location] of Object.entries(locations)) {
            // locationName.innerText = Object.values(locations)[0].name
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
        }
    }
}

function generateSlides(locations) {
    // containerLocations.innerHTML = containerDefaults;
    if (locations) {
        for (let [name, location] of Object.entries(locations)) {
            // locationName.innerText = Object.values(locations)[0].name
            console.log('current location:')
            console.log(location)

            // console.log(`${location}: ${value.name}`);
            slides.insertAdjacentHTML('beforeend', `
            <div id="slide-${location.id}" data-hash="${location.id}" class="relative swiper-slide bg-bg">
                <div id="header-${location.id}" class="sticky_header sticky bg-bg/80
                backdrop-blur-xl top-0 w-full px-6 py-4 flex justify-between items-baseline z-50">
                    <label class="font-semibold text-xl leading-5">${location.name}</label>
                    <span class="absolute header-temp text-[#798C9F] opacity-0 right-6 transform-gpu transition-opacity duration-300">16°
                        |
                        Небольшой
                        дождь</span>
                    <button id="detail-weather-toggle--${location.name_translit}" 
                    class="detail-weather-toggle flex items-end gap-1 text-[#798C9F] text-sm font-light hs-collapse-toggle transform-gpu 
                    transition-opacity duration-300" data-hs-collapse="#detail-weather-info-${location.name_translit}">
                    <div>
                    Подробнее 
                    </div>
                    <img id="detail-weather-toggle-img--${location.name_translit}" src="img/assets/icons/down.svg">
                    </button>
                </div>
                <section id="general-weather-info--${location.id}" data-hash="${location.id}" class="px-4 max-w-md mx-auto swiper-slide bg-bg swiper-slide-active">
                    <div class="w-full p-5 rounded-2xl bg-[#132846]">
                        <div class="flex flex-row justify-between">
                            <div class="flex flex-col gap-2">
                                <div id="current-day-${location.id}" class="text-[#798C9F] text-xs font-light capitalize">${currentWeekdayLong}, ${currentDate} 9:23</div>
                                <div id="temperature-${location.id}" class="text-[64px] leading-[68px] align-text-top">--</div>
                                <div class="text-sm leading-4 flex flex-col gap-1">
                                <div id="conditions-${location.id}">--</div>
                                    <div>Ощущается как <span id="feelslike-${location.id}" class="font-bold">--</span></div>
                                </div>
                            </div>
                            <div id="weather-icon-${location.id}"><img class="w-36 h-36" src="img/assets/icons/weather-conditions/clear-day.svg" alt="" srcset="">
                            </div>
                        </div>
                        <div id="detail-weather-info-${location.name_translit}"
                            class="hs-collapse will-change-transform hidden w-full grid grid-flow-row gap-5 overflow-hidden transition-[height] duration-300">
                            <div id="details-1" class="relative h-[100px] w-full grid grid-flow-col justify-around items-end">
                                <div class="absolute detail-item opacity-0 -translate-y-5 -translate-x-1 transform-gpu transition-all w-full h-full flex justify-center">
                                    <div class="absolute w-[150px] h-[75px] bottom-0">
                                        <div class="w-full h-full border border-b-0 border-dashed rounded-t-full border-cyan/60">
                                        </div>
                                        <div
                                            class="sun absolute top-0 w-full h-full origin-bottom -rotate-[38deg]
                                        border border-b-0 border-solid rounded-t-full border-cyan bg-gradient-to-b from-[#0F3C5C] to-transparent">
                                        </div>
                                        <div class="w-[150px] h-[75px] bg-[#132846] absolute"></div>
                                        <div class="w-2 h-2 rounded-full bg-cyan -bottom-[4px] -left-[4px] absolute"></div>
                                        <div class="w-2 h-2 rounded-full bg-cyan -bottom-[4px] -right-[4px] absolute">
                                        </div>
                                        <div class="sky left-1/2 w-1/2 origin-left absolute -rotate-[38deg]">
                                            <div
                                                class="w-2 h-2 rounded-full bg-white outline-2 outline outline-bg outline-offset-0 -bottom-[4px] -right-[4px] absolute">
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="detail-item opacity-0 -translate-y-5 -translate-x-1transform-gpu transition-all w-full grid grid-flow-row gap-[6px]">
                                    <div class="text-xs text-[#798C9F]">Восход</div>
                                    <div id="sunrise-${location.id}" class="font-semibold ">--</div>
                                </div>
                                <div class="w-full detail-item opacity-0 -translate-y-5 -translate-x-1 transform-gpu transition-all grid grid-flow-row gap-[6px] justify-center  z-10">
                                    <div class="text-xs text-[#798C9F]">Световой день</div>
                                    <div id="daylight-${location.id}" class="font-semibold">--</div>
                                </div>
                                <div class="w-full detail-item opacity-0 -translate-y-5 -translate-x-1 transform-gpu transition-all grid grid-flow-row gap-[6px]">
                                    <div class="text-xs text-[#798C9F]">Закат</div>
                                    <div id="sunset-${location.id}" class="font-semibold ">--</div>
                                </div>
                            </div>
                            <div id="details-2" class="relative h-[100px] grid grid-cols-3 gap-1">
                                <div class="detail-item opacity-0 -translate-y-5 -translate-x-1 transform-gpu transition-all grid grid-flow-row text-center">
                                    <div class="">
                                        <div class="text-xs text-[#798C9F]">t° минимум</div>
                                        <div id="tempmax-${location.id}">--</div>
                                    </div>
                                    <div class="">
                                        <div class="text-xs text-[#798C9F]">t° максимум</div>
                                        <div id="tempmin-${location.id}">--</div>
                                    </div>
                                </div>
                                <div class="detail-item opacity-0 -translate-y-5 -translate-x-1 transform-gpu transition-all grid grid-flow-row text-center">
                                    <div class="grid grid-flow-row">
                                        <div class="text-xs text-[#798C9F]">Осадки</div>
                                        <div id="precipprob-${location.id}">--</div>
                                    </div>
                                    <div class="">
                                        <div class="text-xs text-[#798C9F]">Влажность</div>
                                        <div id="humidity-${location.id}">--</div>
                                    </div>
                                </div>
                                <div class="detail-item opacity-0 -translate-y-5 -translate-x-1 transform-gpu transition-all grid grid-flow-row text-center">
                                    <div class="">
                                        <div class="text-xs text-[#798C9F]">Давление</div>
                                        <div id="pressure-${location.id}">--</div>
                                    </div>
                                    <div class="">
                                        <div class="text-xs text-[#798C9F]">Ветер</div>
                                        <div id="windspeed-${location.id}">--</div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="hourlyToday-${location.id}" class="hourly swiper-no-swiping will-change-scroll pt-4 gap-2 flex overflow-hidden overflow-x-scroll 
                no-scrollbar px-3 scroll-smooth snap-x snap-mandatory">
                </section>

                <section id="daily-${location.id}" class="py-6 mx-4 grid grid-flow-row">
                </section>

                <section id="monthly-${location.id}" class="mx-4 pb-24 font-light flex flex-nowrap gap-5 items-center">
                    <div class="small-icon w-[52px] h-[52px] grow-0 bg-[#192D52] rounded-2xl py-1">
                        <img class="w-[44px] h-[44px] mx-auto" src="img/assets/icons/weather-conditions/monthly.svg" alt="">
                    </div>
                    <div class="grow text-base leading-5 text-[#D7E3FA]">Прогноз на месяц</div>
                    <div class="grow-0"><img class="w-[7px] h-[14px] mx-auto" src="img/assets/icons/arrow-right.svg" alt=""></div>
                </section>
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
            <div class="flex flex-col justify-end items-center px-2  scroll-ml-3 snap-start">
                <div class="date text-xs text-white/50 pb-1">${nextDayTip}</div>
                <div class="icon w-11 h-11 bg-gradient rounded-xl flex justify-center items-center relative">
                    <img class="w-6 h-6" src="img/assets/icons/weather-conditions/${data.icon}.svg" alt="" srcset="">
                    ${Math.round(data.precipprob) > 20 ?
                    ('<div class="absolute bg-bg p-[5px] leading-[9px] -bottom-2 -right-2 text-[10px] text-cyan rounded-3xl">'
                        + Math.ceil((data.precipprob / 10)) * 10 + '%</div>') : ''}
                </div>
                <div class="time font-light text-[11px] text-[#798C9F] pt-3">${time}</div>
                <div class="temp font-semibold text-lg leading-5 pt-1">${Math.round(data.temp)}°</div>
            </div>`;
        }
        leftHours = nHours - leftHours
    }
}

function appendData(location, weatherData) {
    // console.log(weatherData)

    var doc = document.documentElement;
    var w = window;

    var prevScroll = w.scrollY || doc.scrollTop;
    var curScroll;
    var direction = 0;
    var prevDirection = 0;

    toggle = document.querySelectorAll('.detail-weather-toggle');
    headerTemp = document.querySelectorAll('.header-temp');
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
        if (direction === 2 && curScroll > 120) {

            //replace 52 with the height of your header in px
            toggle.forEach((t) => {
                t.classList.add('opacity-0', 'pointer-events-none');
            })
            headerTemp.forEach((h) => {
                h.classList.remove('opacity-0');
            })
            prevDirection = direction;
        } else if (direction === 1 && curScroll <= 120) {
            toggle.forEach((t) => {
                t.classList.remove('opacity-0', 'pointer-events-none');
            })
            headerTemp.forEach((h) => {
                h.classList.add('opacity-0');
            })
            prevDirection = direction;
        }
    };
    window.addEventListener('scroll', checkScroll);


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


    // HOURLY FORECAST

    printHourlyWeather(location.id, days, weatherData)
    // printHourlyWeather(location.id, days, weatherData, 1)

    // console.log(locations)
    // console.log(location.name)
    // console.log(location)
    const weatherDetailsToggle = document.querySelector(`#detail-weather-toggle--${location.name_translit}`)
    const weatherDetailsToggleImg = document.querySelector(`#detail-weather-toggle-img--${location.name_translit}`)
    const detailInfo = document.querySelector(`#detail-weather-info-${location.name_translit}`)
    const detailItems = document.querySelectorAll(`#detail-weather-info-${location.name_translit} .detail-item`)
    const sunrise_date = new Date(weatherData.currentConditions.sunriseEpoch * 1000)
    const sunset_date = new Date(weatherData.currentConditions.sunsetEpoch * 1000)
    const dayLight_date = new Date(sunset_date - sunrise_date)

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

    let todayWeather = weatherData.days[0]
    let currentWeather = weatherData.days[0].hours[Number(join(new Date, [{ hour: 'numeric' }], '-'))]


    temperature.innerHTML = `${Math.round(currentWeather.temp)}<span class="text-2xl absolute font-bold leading-9">°C</span>`
    feelslike.innerHTML = ` ${Math.round(currentWeather.feelslike)}°`
    sunrise.innerHTML = getTime2Digits(sunrise_date)
    sunset.innerHTML = getTime2Digits(sunset_date)
    dayLight.innerHTML = `${(dayLight_date.getHours() + dayLight_date.getTimezoneOffset() / 60)} ч ${dayLight_date.getMinutes()} мин`
    tempmax.innerText = `${Math.round(todayWeather.tempmax)}°`
    tempmin.innerText = `${Math.round(todayWeather.tempmin)}°`
    conditions.innerHTML = currentWeather.conditions
    currentDay.innerHTML = `${currentWeekday}, ${currentDateLong}`
    weatherIcon.innerHTML = `<img src="img/assets/icons/weather-conditions/${currentWeather.icon}.svg">`
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

    function minMax(obj) {
        var keys = Object.keys(obj);
        var i;
        var minMin = keys[0]; // ignoring case of empty obj for conciseness
        var maxMax = keys[0];
        for (i = 0; i < 10; i++) {
            var value = keys[i];
            if (obj[value].tempmin < obj[minMin].tempmin) minMin = value;
            if (obj[value].tempmax > obj[maxMax].tempmax) maxMax = value;
        }
        var tempRange = {
            'tempmin': Math.round(obj[minMin].tempmin),
            'tempmax': Math.round(obj[maxMax].tempmax)
        }
        return tempRange
    }

    tempRange = minMax(weatherData.days)
    console.log(tempRange)


    // DAILY FORECAST

    for (let i = 0; i < 10; i++) {
        let d = [{ day: 'numeric' }, { month: 'short' }];
        let w = [{ weekday: 'short' }];
        let date = join(new Date(weatherData.days[i].datetime), d, ' ');
        let weekday = join(new Date(weatherData.days[i].datetime), w, '-');
        if (weekday == 'суббота' || weekday == 'воскресенье') {
            color = 'text-orange'
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
        let tempmin = Math.round(weatherData.days[i].tempmin)
        let tempmax = Math.round(weatherData.days[i].tempmax)
        let delta = tempRange.tempmax - tempRange.tempmin
        // console.log(document.getElementById('daily-' + location.id))
        document.getElementById('daily-' + location.id).innerHTML += `
        <div class="w-full py-[2px] font-light flex flex-nowrap gap-5 items-center">
            <div class="small-icon w-[52px] h-[52px] shrink-0 bg-[#192D52] rounded-2xl py-1 relative">
                <img class="w-[44px] h-[44px] mx-auto" src="img/assets/icons/weather-conditions/temp2/${weatherData.days[i].icon}.svg" alt="">
                ${Math.round(weatherData.days[i].precipprob) > 20 ?
                ('<div class="absolute bg-bg p-[5px] leading-[9px] -bottom-2 -right-2 text-[10px] text-cyan rounded-3xl">'
                    + Math.ceil((weatherData.days[i].precipprob / 10)) * 10 + '%</div>') : ''}
            </div>
            <div class="text w-28 shrink-0 flex flex-col gap-1">
                <div class="text-sm leading-3 text-[#D7E3FA]">
                    <span class="capitalize">${data}</span>
                </div>
                <div class="text-xs leading-3 text-[#44729D]">${weatherData.days[i].conditions}</div>
            </div>
            <div class="my-4 w-full">
                <div id="labels" class="flex justify-between mx-auto pb-2 leading-5">
                    <div class="text-[#44729D]">${tempmin}°</div>
                    <div>${tempmax}°</div>
                </div>
                <div class="relative h-1 rounded-md bg-slate-600">
                    <div class="absolute h-full rounded-md bg-gradient-to-r from-[#DEDEDE] to-[#3FD5FE]"
                        style="left: ${(100 * (tempmin - tempRange.tempmin)) / delta}%; 
                        width: ${(100 * (tempmax - tempmin)) / delta}%">
                    </div>
                </div>
        </div>
        </div>`;
    }
}
