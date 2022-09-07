let locations = JSON.parse(decodeURIComponent(getCookie('locations')));
const currentDate = join(new Date, [{ day: 'numeric' }, { month: 'long' }], ' ');
const currentWeekday = join(new Date, [{ weekday: 'short' }], '-');
let currentHour = Number(join(new Date, [{ hour: 'numeric' }], '-'));
let nHours = 26 // Number of hours to display
let leftHours = 24 - currentHour
//TODO: переделать выбор количества дней
var days = (24 - leftHours) < nHours ? 2 : 1;
const slides = document.getElementById('slides');
const menuLocations = document.getElementById('menuLocations');
const containerLocations = document.querySelector('ol#locations-list');
const containerDefaults = document.getElementById('containerLocations').innerHTML;
const locationsEdit = document.getElementById('locationsEdit');

generateSlides(locations)
const locationName = document.getElementById('locationName'); // Name of the location

locationName.innerText = Object.values(locations)[0].name

const detailsToggle = document.querySelector('#details-toggle')
const detailInfo = document.querySelector('#spb-weather-details')
const detailItems = document.querySelectorAll('#spb-weather-details .detail-item')

async function getWeather(location) {
    let latitude = location.latitude
    let longitude = location.longitude

    const options = {
        // method: 'GET',
        // headers: { Accept: 'application/json', 'Accept-Encoding': 'gzip' }
    };
    // const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${latitude}%2C${longitude}?unitGroup=metric&elements=datetime%2CdatetimeEpoch%2Cname%2Caddress%2CresolvedAddress%2Clatitude%2Clongitude%2Ctempmax%2Ctempmin%2Ctemp%2Cfeelslikemax%2Cfeelslikemin%2Cfeelslike%2Chumidity%2Cprecip%2Cprecipprob%2Cwindspeed%2Cwinddir%2Cpressure%2Cconditions%2Cdescription%2Cicon&include=fcst%2Cobs%2Cremote%2Cstatsfcst%2Cstats%2Chours%2Calerts%2Cdays%2Ccurrent&key=6M44EU7ZDRK49GFJHKBCX2JJC&contentType=json&lang=ru`
    const url = 'panteleyki.json'
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
})

HSCollapse.on('open', () => {
    console.log('▼ details opening... ▼')
    detailItems.forEach((el, index) => {
        var interval = 30;
        setTimeout(() => {
            el.classList.remove('opacity-0', '-translate-y-3', '-translate-x-2');
        }, index * interval);
    })
    detailInfo.querySelector('.winddir').classList.add('rotate-[1turn]')
})

detailsToggle.addEventListener('click', () => {
    if (detailInfo.clientHeight > 0) {
        console.log('▲ details closing... ▲')
        detailItems.forEach((el) => {
            el.classList.add('opacity-0', '-translate-y-3', '-translate-x-2');
        })
        detailInfo.querySelector('.winddir').classList.remove('rotate-[1turn]')
    }
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
    console.log(obj)
    var tempKey = 'test'
    var tempValue = JSON.stringify(Object.values(obj)[fromId])
    console.log(`
        from: ${fromId} to: ${toId}
        temp key: ${tempKey}
        temp value: ${tempValue}
    `)
    locations = addToObject(obj, tempKey, tempValue, toId)
    var json = JSON.stringify(locations, null, 4);
    // document.querySelector('#json').innerHTML = json;
    console.log(locations)
    console.log(tempValue)
    let location = locations[tempKey]
    console.log(location)
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
    // swapElementsInObject(locations, 1, 0)
    for (let [name, location] of Object.entries(locations)) {
        // console.log(location);
        getWeather(location);
    }
    // document.getElementById('locationName').addEventListener('click', () => {
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
    for (let [name, location] of Object.entries(locations)) {
        console.log(name)
        containerLocations.insertAdjacentHTML('beforeend', `
        <li id="card-${location.slug}" class="w-full h-[85px] z-[999999]
        hs-removing:-translate-y-16 hs-removing:scale-50 hs-removing:opacity-0 transform-gpu" id="location-${location.slug}">
            <!-- CONTENT-->
            <div class="flex justify-center ">
                <div onclick=(slideToId(Object.keys(locations).indexOf('${name}'))) class="minicard no-swipe no-reorder absolute w-full 
            bg-bg bg-gradient-to-br from-cyan/20 to-blue/20 z-20
            p-4 transition-translate duration-300 transform-gpu rounded-2xl h-[85px]">
                    <div class="absolute left-4 flex-col transition-translate duration-300 transform-gpu">
                        <div class=" no-swipe no-reorder text-[10px] text-white/50 leading-3">16:00</div>
                        <div
                            class=" no-swipe no-reorder cardLocationName text-${(location.name.length > 15) ? 'lg' : 'xl'} leading-5 transition-all duration-300 transform-gpu">
                            ${location.name}
                        </div>
                        <div class="condition no-swipe no-reorder text-xs leading-[14px] transition-translate duration-300 transform-gpu">
                        </div>
                    </div>
                    <div class="no-swipe no-reorder absolute right-4 flex flex-row gap-2 transition-translate duration-300 transform-gpu">
                        <div class="no-swipe no-reorder grid grid-flow-col gap-1 items-center transition-translate duration-300 transform-gpu">
                            <div class="no-swipe no-reorder temp text-[32px] font-medium transition-translate duration-700 transform-gpu">
                            </div>
                            <div class="minmax grid grid-flow-row divide-y divide-white/20 leading-[14px]
                        transition-translate duration-500 transform-gpu">
                                <div class="no-swipe no-reorder tempmax text-xs transition-translate duration-300 transform-gpu">
                                </div>
                                <div class="no-swipe no-reorder tempmin text-xs transition-translate duration-300 transform-gpu">
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
            </div>
            <!-- BUTTONS-->
            <div class="h-[85px] justify-between grid grid-flow-col">
                <button type="button" data-hs-remove-element="#location-${location.slug}"
                    onclick="deleteLocation(Object.keys(locations).indexOf('${name}'), '${name}')"
                    class=" location-del
                     opacity-0 translate-x-6 transition-translate duration-300 transform-gpu pointer-events-none z-10 ease-out">
                    <img src="img/delete.svg" width="40px" height="40px" alt="">
                </button>
                <button type="button" class="instant items-center font-light text-3xl text-white/30
                            location-drag opacity-0 -translate-x-6  transition-translate z-0 duration-300 
                            transform-gpu pointer-events-none">
                    ☰
                </button>
            </div>
        </li>`)
        // console.log(locationsList)

        // console.log(`${location}: ${value.name}`);
        slides.insertAdjacentHTML('beforeend', `
        <div id="${location.slug}-slide" data-hash="${location.slug}" class="swiper-slide bg-bg">
                        <!-- Start of Content -->
                        <div class="swiper-pagination"></div>
                            <div id="${location.slug}-main_info" class="grid gap-4 
                                p-5 mx-4 mb-[27px] bg-gradient-to-br from-cyan/20 to-blue/20 rounded-3xl">

                                <div class="flex justify-between items-baseline w-full">
                                    <div id=${location.slug}-current-time" class="font-semibold text-xl leading-5">18:10</div>
                                    <div id="${location.slug}-current-day" class="text-white/70 text-xs"></div>
                                </div>
                                <button type="button" id="details-toggle" class="hs-collapse-toggle flex justify-between sm:justify-around items-center w-full
                                text-white" data-hs-collapse="#${location.slug}-weather-details">
                                    <div class="grid grid-flow-row justify-items-start">
                                        <div class="grid grid-flow-col">
                                            <div id="${location.slug}-temperature" class="font-semibold text-[64px] leading-[75px]"></div>
                                            <div class="grid grid-flow-row divide-y divide-white/20 content-center px-4">
                                                <div>18</div>
                                                <div>12</div>
                                            </div>
                                        </div>
                                        <div id="${location.slug}-conditions" class="font-light text-sm leading-[18px]"></div>
                                        <div id="${location.slug}-feelslike" class="flex font-light text-sm leading-[18px]"></div>
                                    </div>
                                    <div id="${location.slug}-weather-icon" class="w-[120px] h-[120px]"></div>
                                </button>

                                <!--==-=== Weather Details ===-==-->

                                <div id="${location.slug}-weather-details" class="hs-collapse hidden grid gap-2
                                items-center overflow-hidden transition-all transform-gpu">
                                    <div class="flex gap-3 detail-item opacity-0 -translate-y-3 -translate-x-2 items-center
                                    transition-all duration-200 ease-in-out transform-gpu">
                                        <div class="flex flex-col">
                                            <img class="w-6 h-6 winddir !transform-gpu transition-all duration-[2s] ease-[cubic-bezier(0.46,2.1,0.36,0.78)]" 
                                                src="img/assets/icons/details/clarity_compass-line.svg" alt="">
                                        </div>
                                        <div class="flex flex-col">
                                            <div id="${location.slug}-windspeed"
                                                class="flex text-sm font-semibold gap-1 items-baseline"></div>
                                            <div class="text-white/50 text-xs">Ветер</div>
                                        </div>
                                    </div>

                                    <div class="flex gap-3 detail-item opacity-0 -translate-y-3 -translate-x-2 items-center transition-all duration-200 ease-in-out transform-gpu">
                                        <div class="flex flex-col"><img class="w-6 h-6" src="img/assets/icons/details/precip.svg" alt="">
                                        </div>
                                        <div class="flex flex-col">
                                            <div id="${location.slug}-precipprob" class="text-sm font-semibold">
                                            </div>
                                            <div class="text-white/50 text-xs">Осадки</div>
                                        </div>
                                    </div>

                                    <div class="row-start-3 xs:col-start-3 xs:row-start-1 col-start-1 
                                    flex gap-3 detail-item opacity-0 -translate-y-3 -translate-x-2 items-center transition-all duration-200 ease-in-out transform-gpu">
                                        <div class="flex flex-col"><img class="w-6 h-6" src="img/assets/icons/details/sunrise.svg" alt="">
                                        </div>
                                        <div class="flex flex-col">
                                            <div id="${location.slug}-sunset" class="text-sm font-semibold">5:00</div>
                                            <div class="text-white/50 text-xs">Восход</div>
                                        </div>
                                    </div>

                                    <div class="flex gap-3 detail-item opacity-0 -translate-y-3 -translate-x-2 items-center transition-all duration-200 ease-in-out transform-gpu">
                                        <div class="flex flex-col"><img class="w-6 h-6" src="img/assets/icons/details/wi_barometer.svg" alt="">
                                        </div>
                                        <div class="flex flex-col">
                                            <div id="${location.slug}-pressure" class="text-sm font-semibold"></div>
                                            <div class="text-white/50 text-xs">Давление</div>
                                        </div>
                                    </div>

                                    <div class="flex gap-3 detail-item opacity-0 -translate-y-3 -translate-x-2 items-center transition-all duration-200 ease-in-out transform-gpu">
                                        <div class="flex flex-col"><img class="w-6 h-6" src="img/assets/icons/details/ion_water-humidity.svg" alt="">
                                        </div>
                                        <div class="flex flex-col">
                                            <div id="${location.slug}-humidity" class="text-sm font-semibold">
                                            </div>
                                            <div class="text-white/50 text-xs">Влажность</div>
                                        </div>
                                    </div>

                                    <div class="flex gap-3 detail-item opacity-0 -translate-y-3 -translate-x-2 items-center transition-all duration-200 ease-in-out transform-gpu">
                                        <div class="flex flex-col"><img class="w-6 h-6" src="img/assets/icons/details/sunset.svg" alt="">
                                        </div>
                                        <div class="flex flex-col">
                                            <div id="${location.slug}-sunset" class="text-sm font-semibold">21:30</div>
                                            <div class="text-white/50 text-xs">Закат</div>
                                        </div>
                                    </div>

                                </div>

                                <!--==-=== Weather Details End ===-==-->

                            </div>
                            <div id="${location.slug}-nav" class="flex flex-row gap-10 pl-8 mt-6 mb-1">
                                <button type='button' id="${location.slug}-buttonToday"
                                    class="z-40 font-normal text-sm transition-all duration-700 text-white">
                                    Сегодня
                                </button type='button'>
                                <button type='button' id="${location.slug}-buttonTomorrow"
                                    class="z-40 font-normal text-sm transition-all duration-500 text-white/50">Завтра
                                </button type='button'>
                            </div>
                            <div class="h-[160px] relative">
                                <div id="${location.slug}-hourlyToday" class="swiper-no-swiping grid grid-flow-col gap-2 
                                overflow-x-scroll no-scrollbar pb-3 pt-4 px-4 transform transition-all duration-700 ease-[cubic-bezier(0.04,1.35,0.42,0.97)]">
                                </div>
                                <div id="${location.slug}-hourlyTomorrow" class="swiper-no-swiping pointer-events-none grid grid-flow-col gap-3 
                                overflow-x-scroll no-scrollbar pb-3 pt-4 px-4 transform transition-all duration-700 ease-[cubic-bezier(0.04,1.35,0.42,0.97)] -translate-y-20 opacity-0 ">
                                </div>
                            </div>
                        <!-- <div class="block ml-6 mb-3 text-xl leading-6 font-light">Прогноз на 10 дней</div> --->
                            <div id="${location.slug}-daily" class="mx-4 grid grid-flow-row divide-y divide-blue/20">
                            </div>
                        <!-- End of content -->
                        </div>`)
    }
    setupSlip(document.getElementById('locations-list'));
}

const classToggle = (el, ...args) => {
    args.map(e => el.classList.toggle(e))
}

// const miniCards = document.querySelectorAll('.mini-card')
const minmax = document.querySelectorAll('.minmax')
locationsEdit.addEventListener('click', () => {

    let minicards = document.querySelectorAll('.minicard')
    minicards.forEach((element) => {
        classToggle(element, 'w-[260px]', 'w-full', 'h-[80px]')
        element.children[0].classList.toggle('translate-y-1')
        element.children[1].children[0].classList.toggle('translate-x-16')
        element.children[1].children[0].classList.toggle('opacity-0')
        element.children[1].classList.toggle('right-0')
        element.children[1].classList.toggle('right-4')
        element.children[0].children[2].classList.toggle('opacity-0')
    })

    let cardLocationName = document.querySelectorAll('.cardLocationName')
    cardLocationName.forEach((e) => {
        if (e.innerText.length > 18) {
            e.classList.toggle('text-base')
        }
    })

    let weatherIcon = document.querySelectorAll('.weather-icon')
    weatherIcon.forEach((e) => {
        classToggle(e, 'scale-0', 'opacity-0')
    })

    let editIcon = document.querySelectorAll('.edit-icon')
    editIcon.forEach((e) => {
        classToggle(e, 'opacity-0')
    })

    let del = document.querySelectorAll('.location-del')
    del.forEach((element) => {
        classToggle(element, 'translate-x-6', 'opacity-0', 'pointer-events-none')
    })

    let drag = document.querySelectorAll('.location-drag')
    drag.forEach((element) => {
        classToggle(element, '-translate-x-6', 'opacity-0', 'pointer-events-none')
    })

    minmax.forEach((element) => {
        element.classList.toggle('translate-x-5')
        element.classList.toggle('opacity-0')
        // element.classList.toggle('invisible')
        // element.classList.toggle('hidden')
        element.parentElement.classList.toggle('translate-x-6')
        // document.getElementById('conditionEl').classList.toggle('invisible')
        // document.getElementById('conditionEl').classList.toggle('-translate-y-3')
        // document.getElementById('conditionEl').classList.toggle('opacity-0')

    })
})

function printHourlyWeather(location, days, weatherData, startDay = 0) {
    days += startDay
    if (startDay === 0) {
        hourlyPlaceholder = document.getElementById(location.slug + '-hourlyToday')
    } else {
        hourlyPlaceholder = document.getElementById(location.slug + '-hourlyTomorrow')
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
            // console.log('hour = ' + (currentHour + i))
            // console.log(`data = ${data}`)
            // console.log('icon:' + data.icon)
            hourlyPlaceholder.innerHTML += `
                <div class="relative grid grid-flow-row justify-items-center w-[58px] h-[98px] p-2 mb-4 bg-gradient-to-br from-cyan/20 to-blue/20 rounded-lg">
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
                    <div class="absolute -bottom-[22px] text-[10px] leading-3 text-[#6A9CFF] text-white/50 w-full flex justify-center gap-1">
                        ${Math.round(data.precipprob) > 20 ? ('<img class="w-3 h-3" src="img/precip.svg">' + Math.ceil((data.precipprob / 10)) * 10 + '%') : ''}
                    </div>
                </div>`;
        }
        leftHours = nHours - leftHours
    }
}

function appendData(location, weatherData) {
    console.log(weatherData)
    const buttonTomorrow = document.getElementById(location.slug + '-buttonTomorrow');
    const buttonToday = document.getElementById(location.slug + '-buttonToday');
    const temperature = document.getElementById(location.slug + '-temperature');
    const weatherIcon = document.getElementById(location.slug + '-weather-icon');
    const conditions = document.getElementById(location.slug + '-conditions');
    const currentDay = document.getElementById(location.slug + '-current-day');
    const feelslike = document.getElementById(location.slug + '-feelslike');
    const humidity = document.getElementById(location.slug + '-humidity');
    const pressure = document.getElementById(location.slug + '-pressure');
    const windspeed = document.getElementById(location.slug + '-windspeed');
    const precipprob = document.getElementById(location.slug + '-precipprob');
    const hourlyToday = document.getElementById(location.slug + '-hourlyToday');
    const hourlyTomorrow = document.getElementById(location.slug + '-hourlyTomorrow');

    printHourlyWeather(location, days, weatherData)
    printHourlyWeather(location, days, weatherData, 1)

    // console.log(locations)

    buttonToday.addEventListener('click', () => {
        buttonTomorrow.classList.remove('text-white')
        buttonTomorrow.classList.add('text-white/50')
        buttonToday.classList.add('text-white')
        buttonToday.classList.remove('text-white/50')
        hourlyTomorrow.classList.add('-translate-y-20', 'opacity-0', 'z-0', 'pointer-events-none')
        hourlyTomorrow.classList.remove('-translate-y-[142px]', 'opacity-100')
        hourlyToday.classList.remove('-translate-y-20', 'opacity-0', 'z-0', 'pointer-events-none')
        hourlyToday.classList.add('translate-y-0', 'opacity-100')
    })

    buttonTomorrow.addEventListener('click', () => {
        buttonToday.classList.remove('text-white')
        buttonToday.classList.add('text-white/50')
        buttonTomorrow.classList.add('text-white')
        buttonTomorrow.classList.remove('text-white/50')
        hourlyToday.classList.add('-translate-y-20', 'opacity-0', 'z-0', 'pointer-events-none')
        hourlyToday.classList.remove('translate-y-0', 'opacity-100')
        hourlyTomorrow.classList.remove('-translate-y-20', 'opacity-0', 'z-0', 'pointer-events-none')
        hourlyTomorrow.classList.add('-translate-y-[142px]', 'opacity-100')
    })
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

    document.querySelector(`#card-${location.slug} .temp`).innerText = Math.round(todayWeather.temp)
    document.querySelector(`#card-${location.slug} .condition`).innerText = todayWeather.conditions
    document.querySelector(`#card-${location.slug} .tempmax`).innerText = Math.round(todayWeather.tempmax)
    document.querySelector(`#card-${location.slug} .tempmin`).innerText = Math.round(todayWeather.tempmin)
    document.querySelector(`#card-${location.slug} .weather-icon`).innerHTML = `
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
        document.getElementById(location.slug + '-daily').innerHTML += `
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
