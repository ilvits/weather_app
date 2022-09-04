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
// console.log(containerDefaults)

// const conditionEl = document.querySelector('#conditionEl')
generateSlides(locations)
const locationName = document.getElementById('locationName'); // Name of the location
// const menuLocations = document.getElementById('menuLocations');
// const sidebar = document.getElementById('sidebarLeft');
locationName.innerText = Object.values(locations)[0].name

HSOffcanvas.on('close', () => {
    console.log('hhh')

    // swiper.navigation.init()
    // swiper.navigation.destroy()
})

HSOffcanvas.on('open', () => {
    console.log('sss')
    // swiper.navigation.destroy()
})

function deleteLocation(locationId, locationN) {
    console.log(locationId, locationN)
    swiper.removeSlide(locationId)
    delete (locations[locationN]);
    setCookie('locations', JSON.stringify(locations), 30);
}

function slideToId(index) {
    HSOffcanvas.close(menuLocations);
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
    containerLocations.insertAdjacentHTML('beforeend', `
    <li class="w-full hs-removing:-translate-y-16 hs-removing:scale-50 hs-removing:opacity-0 
    transition-all duration-300 transform-gpu" id="location-${location.slug}">
        <!-- CONTENT-->
        <div class="flex justify-center ">
            <div onclick=(slideToId(Object.keys(locations).indexOf('${location.name}'))) class="minicard2 no-swipe no-reorder absolute w-full 
        bg-bg bg-gradient-to-br from-cyan/20 to-blue/20 z-20 
        p-4 transition-translate duration-300 transform-gpu rounded-2xl h-[85px]">
                <div class="absolute left-4 flex-col transition-translate duration-300 transform-gpu">
                    <div class="text-[10px] text-white/50 leading-3">16:00</div>
                    <div
                        class="cardLocationName text-base leading-5 transition-all duration-300 transform-gpu">
                        ${location.name}
                    </div>
                    <div class="text-xs leading-[14px] transition-translate duration-300 transform-gpu">
                        Без
                        осадков
                    </div>
                </div>
                <div
                    class="absolute right-4 flex flex-row gap-2 transition-translate duration-300 transform-gpu">
                    <div
                        class="grid grid-flow-col gap-1 items-center transition-translate duration-300 transform-gpu">
                        <div
                            class="text-[32px] font-medium transition-translate duration-700 transform-gpu">
                            16°
                        </div>
                        <div class="minmax grid grid-flow-row divide-y divide-white/20 leading-[14px]
                    transition-translate duration-500 transform-gpu">
                            <div class="text-xs transition-translate duration-300 transform-gpu">18°
                            </div>
                            <div class="text-xs transition-translate duration-300 transform-gpu">12°
                            </div>
                        </div>
                    </div>
                    <div class="weather-icon w-12 h-12 transition-translate duration-300 transform-gpu">
                        <img src="/img/weather-conditions/partly-cloudy-day.svg" alt="">
                    </div>
                    <div class="edit-icon absolute right-2 opacity-0 edit-icon w-12 h-12 
                    transition-translate duration-300 transform-gpu">
                        <img src="/img/edit.svg" alt="">
                    </div>
                </div>
            </div>
        </div>
        <!-- BUTTONS-->
        <div class="h-[85px] justify-between grid grid-flow-col">
            <button type="button" data-hs-remove-element="#location-${location.slug}"
                onclick="deleteLocation(Object.keys(locations).indexOf('${location.name}'), '${location.name}')"
                class=" location-del
                 opacity-0 translate-x-6 transition-translate duration-300 transform-gpu pointer-events-none z-10 ease-out">
                <img src="/img/delete.svg" width="40px" height="40px" alt="">
            </button>
            <button type="button"
                class="instant items-center font-light text-3xl text-white/30 location-drag opacity-0 -translate-x-6  transition-translate z-0 duration-300 transform-gpu pointer-events-none">
                ☰
            </button>
        </div>
    </li>`)
    // console.log(locationsList)

    // console.log(`${location}: ${value.name}`);
    slides.insertAdjacentHTML('beforeend', `
    <div id="${location.slug}-slide" data-hash="${location.slug}" class="swiper-slide bg-bg">
                    <!-- Start of Content -->
                    <div class="swiper-pagination !transform !transition !duration-300"></div>
                        <div id="${location.slug}-loader"
                            class="bg-slate-800/50 border-2 border-slate-700/10 rounded-3xl grid gap-4 w-auto h-[338px] mt-4 mx-4 p-5">
                            <div class="animate-pulse">
                                <div class="flex justify-between sm:justify-around items-baseline w-full">
                                    <div class="w-24 h-3 bg-slate-700/50 rounded-md my-1"></div>
                                    <div class="w-24 h-1 bg-slate-700/50 rounded-md mb-1"></div>
                                </div>
                                <div class="flex justify-between sm:justify-around items-center 
                                    pb-4 w-full border-b border-slate-800">
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
                        <div id="${location.slug}-main_info" class="hidden grid gap-4 w-auto h-auto 
                            p-5 mx-4 bg-gradient-to-br from-cyan/20 to-blue/20 rounded-3xl">

                            <div class="flex justify-between items-baseline w-full">
                                <div class="font-semibold text-xl leading-5">Сейчас</div>
                                <div id="${location.slug}-currentDay" class="text-white/70 text-[13px]"></div>
                            </div>
                            <div class="flex justify-between sm:justify-around items-center pb-4 w-full
                            text-white border-b border-white/20">
                                <div class="grid grid-flow-row">
                                    <div id="${location.slug}-temperature" class="font-semibold text-7xl leading-tight"></div>
                                    <div id="${location.slug}-conditions"></div>
                                    <div id="${location.slug}-feelslike" class="flex"></div>
                                </div>
                                <div id="${location.slug}-weather-icon" class="w-[120px] h-[120px]"></div>
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
                            <button type='button' id="${location.slug}-buttonToday"
                                class="z-40 font-semibold text-[15px] transition-all duration-700 text-yellow">
                                Сегодня
                            </button type='button'>
                            <button type='button' id="${location.slug}-buttonTomorrow"
                                class="z-40 font-semibold text-[15px] transition-all duration-500">Завтра
                            </button type='button'>
                        </div>
                        <div class="h-[148px] relative">
                            <div id="${location.slug}-hourlyToday" class="swiper-no-swiping grid grid-flow-col gap-3 
                            overflow-x-scroll no-scrollbar py-3 scroll px-4 transform transition duration-700 ease-[cubic-bezier(0.04,1.35,0.42,0.97)]">
                            </div>
                            <div id="${location.slug}-hourlyTomorrow" class="swiper-no-swiping pointer-events-none grid grid-flow-col gap-3 
                            overflow-x-scroll no-scrollbar py-3 scroll px-4 transform transition duration-700 ease-[cubic-bezier(0.04,1.35,0.42,0.97)] -translate-y-20 opacity-0 ">
                            </div>
                        </div>
                        <div class="block ml-6 mt-5 mb-3 text-xl leading-6 font-semibold">Прогноз на 10 дней</div>
                        <div id="${location.slug}-daily" class="mx-4 grid grid-flow-row divide-y divide-blue/20">
                        </div>
                    <!-- End of content -->
                    </div>`);
    swiper.attachEvents()
}

function join(t, a, s) {
    function format(m) {
        let f = new Intl.DateTimeFormat('ru', m);
        return f.format(t);
    }
    return a.map(format).join(s);
}

document.addEventListener("DOMContentLoaded", () => {
    // swapElementsInObject(locations, 1, 0)
    for (let [name, location] of Object.entries(locations)) {
        // console.log(location);
        getWeather(location);
    }
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
        <li id="card-${location.slug}" class="w-full hs-removing:-translate-y-16 hs-removing:scale-50 hs-removing:opacity-0 
        transition-all duration-300 transform-gpu" id="location-${location.slug}">
            <!-- CONTENT-->
            <div class="flex justify-center ">
                <div onclick=(slideToId(Object.keys(locations).indexOf('${name}'))) class="minicard2 no-swipe no-reorder absolute w-full 
            bg-bg bg-gradient-to-br from-cyan/20 to-blue/20 z-20 
            p-4 transition-translate duration-300 transform-gpu rounded-2xl h-[85px]">
                    <div class="absolute left-4 flex-col transition-translate duration-300 transform-gpu">
                        <div class="text-[10px] text-white/50 leading-3">16:00</div>
                        <div
                            class="cardLocationName text-${(location.name.length > 15) ? 'lg' : 'xl'} leading-5 transition-all duration-300 transform-gpu">
                            ${location.name}
                        </div>
                        <div class="text-xs leading-[14px] transition-translate duration-300 transform-gpu">
                            Без
                            осадков
                        </div>
                    </div>
                    <div
                        class="absolute right-4 flex flex-row gap-2 transition-translate duration-300 transform-gpu">
                        <div
                            class="grid grid-flow-col gap-1 items-center transition-translate duration-300 transform-gpu">
                            <div
                                class="temp text-[32px] font-medium transition-translate duration-700 transform-gpu">
                                16°
                            </div>
                            <div class="minmax grid grid-flow-row divide-y divide-white/20 leading-[14px]
                        transition-translate duration-500 transform-gpu">
                                <div class="text-xs transition-translate duration-300 transform-gpu">18°
                                </div>
                                <div class="text-xs transition-translate duration-300 transform-gpu">12°
                                </div>
                            </div>
                        </div>
                        <div class="weather-icon w-12 h-12 transition-translate duration-300 transform-gpu">
                            <img src="/img/weather-conditions/partly-cloudy-day.svg" alt="">
                        </div>
                        <div class="edit-icon absolute right-2 opacity-0 edit-icon w-12 h-12 
                        transition-translate duration-300 transform-gpu">
                            <img src="/img/edit.svg" alt="">
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
                    <img src="/img/delete.svg" width="40px" height="40px" alt="">
                </button>
                <button type="button"
                    class="instant items-center font-light text-3xl text-white/30 location-drag opacity-0 -translate-x-6  transition-translate z-0 duration-300 transform-gpu pointer-events-none">
                    ☰
                </button>
            </div>
        </li>`)
        // console.log(locationsList)

        // console.log(`${location}: ${value.name}`);
        slides.insertAdjacentHTML('beforeend', `
        <div id="${location.slug}-slide" data-hash="${location.slug}" class="swiper-slide bg-bg">
                        <!-- Start of Content -->
                        <div class="swiper-pagination !transform !transition !duration-300"></div>
                            <div id="${location.slug}-loader"
                                class="bg-slate-800/50 border-2 border-slate-700/10 rounded-3xl grid gap-4 w-auto h-[338px] mt-4 mx-4 p-5">
                                <div class="animate-pulse">
                                    <div class="flex justify-between sm:justify-around items-baseline w-full">
                                        <div class="w-24 h-3 bg-slate-700/50 rounded-md my-1"></div>
                                        <div class="w-24 h-1 bg-slate-700/50 rounded-md mb-1"></div>
                                    </div>
                                    <div class="flex justify-between sm:justify-around items-center 
                                        pb-4 w-full border-b border-slate-800">
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
                            <div id="${location.slug}-main_info" class="hidden grid gap-4 w-auto h-auto 
                                p-5 mx-4 bg-gradient-to-br from-cyan/20 to-blue/20 rounded-3xl">

                                <div class="flex justify-between items-baseline w-full">
                                    <div class="font-semibold text-xl leading-5">Сейчас</div>
                                    <div id="${location.slug}-currentDay" class="text-white/70 text-[13px]"></div>
                                </div>
                                <div class="flex justify-between sm:justify-around items-center pb-4 w-full
                                text-white border-b border-white/20">
                                    <div class="grid grid-flow-row">
                                        <div id="${location.slug}-temperature" class="font-semibold text-7xl leading-tight"></div>
                                        <div id="${location.slug}-conditions"></div>
                                        <div id="${location.slug}-feelslike" class="flex"></div>
                                    </div>
                                    <div id="${location.slug}-weather-icon" class="w-[120px] h-[120px]"></div>
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
                                <button type='button' id="${location.slug}-buttonToday"
                                    class="z-40 font-semibold text-[15px] transition-all duration-700 text-yellow">
                                    Сегодня
                                </button type='button'>
                                <button type='button' id="${location.slug}-buttonTomorrow"
                                    class="z-40 font-semibold text-[15px] transition-all duration-500">Завтра
                                </button type='button'>
                            </div>
                            <div class="h-[148px] relative">
                                <div id="${location.slug}-hourlyToday" class="swiper-no-swiping grid grid-flow-col gap-3 
                                overflow-x-scroll no-scrollbar py-3 scroll px-4 transform transition duration-700 ease-[cubic-bezier(0.04,1.35,0.42,0.97)]">
                                </div>
                                <div id="${location.slug}-hourlyTomorrow" class="swiper-no-swiping pointer-events-none grid grid-flow-col gap-3 
                                overflow-x-scroll no-scrollbar py-3 scroll px-4 transform transition duration-700 ease-[cubic-bezier(0.04,1.35,0.42,0.97)] -translate-y-20 opacity-0 ">
                                </div>
                            </div>
                            <div class="block ml-6 mt-5 mb-3 text-xl leading-6 font-semibold">Прогноз на 10 дней</div>
                            <div id="${location.slug}-daily" class="mx-4 grid grid-flow-row divide-y divide-blue/20">
                            </div>
                        <!-- End of content -->
                        </div>`)
    }
}

const classToggle = (el, ...args) => {
    args.map(e => el.classList.toggle(e))
}

const miniCards = document.querySelectorAll('.mini-card')
const minmax = document.querySelectorAll('.minmax')
locationsEdit.addEventListener('click', () => {

    let miniCards2 = document.querySelectorAll('.minicard2')
    miniCards2.forEach((element) => {
        classToggle(element, 'w-[260px]', 'w-full', 'pointer-events-none', 'h-[80px]')
        element.children[0].classList.toggle('translate-y-2')
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


    miniCards.forEach((element) => {
        classToggle(element, 'w-[260px]', '-z-10', 'pointer-events-none', 'w-full')



        // element.classList.toggle('w-full')
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
                nextDayTip = ', ' + join(new Date(0).setUTCSeconds(data.datetimeEpoch), [{ day: 'numeric' }, { month: 'short' }], ' ')
            } else {
                nextDayTip = ''
            }
            // console.log('hour = ' + (currentHour + i))
            // console.log(`data = ${data}`)
            // console.log('icon:' + data.icon)
            hourlyPlaceholder.innerHTML += `
        <div class="flex flex-col justify-end w-28 h-[124px] pl-4 pb-4 pt-3 pr-3 
        bg-gradient-to-br from-cyan/20 to-blue/20 rounded-2xl">
            <div class="flex h-1/2 justify-end">
                <img class="w-12 h-12" src="/img/weather-conditions/${data.icon}.svg">
            </div>
            <div class="h-1/2">
                <div class="text-xs text-white/50 pb-1">
                    ${time}${nextDayTip}
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
    }
}

function appendData(location, weatherData) {
    // console.log(weatherData)
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
    let currentWeather = weatherData.days[0].hours[Number(join(new Date, [{ hour: 'numeric' }], '-'))]
    // console.log(currentWeather)
    let winddir = Math.ceil(Number(currentWeather.winddir));

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
        .arrow {
            transform: rotate(${winddir}deg);
        }`;
    style.innerHTML = rotate;
    document.getElementsByTagName('head')[0].appendChild(style);

    temperature.innerHTML = `${Math.ceil(currentWeather.temp)}°`
    conditions.innerHTML = currentWeather.conditions
    currentDay.innerHTML = `${currentWeekday}, ${currentDate}`
    weatherIcon.innerHTML = `<img src="/img/weather-conditions/${currentWeather.icon}.svg">`
    feelslike.innerHTML = `Ощущается как
        <div class="font-semibold pl-1">
            ${Math.ceil(currentWeather.feelslike)}°
        </div>`
    humidity.innerHTML = `
        ${Math.ceil(currentWeather.humidity)}
        <span class="text-[15px] font-medium">%</span>`
    pressure.innerHTML = `
        ${Math.ceil(Number(currentWeather.pressure) * 0.1 / 0.1333223684)}
        <span class="text-[15px] font-medium">мм рт. ст.</span>`
    precipprob.innerHTML = `${Math.ceil(currentWeather.precipprob)}
        <span class="text-[15px] font-medium">%</span>`
    windspeed.innerHTML = `
        ${Math.ceil(currentWeather.windspeed)} 
        <span class="text-[15px] font-medium">км/ч, ${dir}</span><img class="arrow" src="/img/arrow.svg"
        class="w-4 h-4">`

    document.querySelector(`#card-${location.slug} .temp`).innerText = currentWeather.temp
    document.querySelector(`#card-${location.slug} .weather-icon`).innerHTML = `
    <img src="/img/weather-conditions/${currentWeather.icon}.svg">`



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
