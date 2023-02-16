let dom_utils = {};
(function (context) {
    /**
     * @param {Object} o - object literal with element properties
    */
    context.createEl = function (o, nest) {
        // set type
        let type = o.type || 'div';
        let el = document.createElement(type);

        // iterate therough properties
        for (const key of (Object.keys(o))) {
            if (key != 'attrs' && key != 'type') {
                el[key] = o[key];

            }
        }
        if (o.attrs) {
            for (let key of (Object.keys(o.attrs))) {
                let value = o.attrs[key];

                if (key != key.toLowerCase) {
                    key = key.replace(/[A-Z]/g, m => "-" + m.toLowerCase());
                }
                el.setAttribute(key, value);
            }
        }
        if (!nest) {
            return el;
        }
        if (typeof nest === "string") {
            var t = document.createTextNode(nest);
            el.appendChild(t);
        } else if (nest instanceof Array) {
            for (var i = 0; i < nest.length; i++) {
                if (typeof nest[i] === "string") {
                    var t = document.createTextNode(nest[i]);
                    el.appendChild(t);
                } else if (nest[i] instanceof Node) {
                    el.appendChild(nest[i]);
                }
            }
        } else if (nest instanceof Node) {
            el.appendChild(nest)
        }
        return el;
    };
})(dom_utils);

function updateInfo() {
    const date = new Date()
    const lastPageUpdate = new Date(localStorage.getItem('lastPageUpdate'))
    const delta = ((date.getTime() - lastPageUpdate.getTime()) / 1000)
    if (delta > 300) {
        for (const loc of Object.values(locations)) {
            const weatherData = JSON.parse(localStorage.getItem(`weatherData-${loc.id}-10`))
            renderCurrentForecast(loc, weatherData);
        }
        localStorage.setItem('lastPageUpdate', new Date())
    }
}

window.onfocus = () => updateInfo();

document.addEventListener('DOMContentLoaded', init())

function init() {
    let slide = window.location.hash.split('#').pop();
    loadSettings();
    // Settings
    s_temp = localStorage.getItem('s-temp') == 'true' ? 'F' : 'C'
    s_wind = localStorage.getItem('s-wind') == 'true' ? 'м/с' : 'км/ч'
    s_lang = localStorage.getItem('s-lang') == 'true' ? 'РУС' : 'ENG'
    s_detail = localStorage.getItem('s-details') == 'true' ? true : false
    s_pressure = localStorage.getItem('s-pressure') == 'true' ? 'гПа' : 'мм'

    // Loading WeatherData
    locations = JSON.parse(localStorage.getItem('locations')) || {};
    Object.values(locations).forEach((el) => {
        getWeatherDataFromAPI(el.id, el.latitude, el.longitude, 10)
        getWeatherDataFromAPI(el.id, el.latitude, el.longitude, 30)
    })
    if (localStorage.getItem('locations') !== null) {
        for (const loc of Object.values(locations)) {
            generateLocationCard(loc);
        }
        for (const loc of Object.values(locations)) {
            weatherData = JSON.parse(localStorage.getItem(`weatherData-${loc.id}-10`))
            generateSlide(loc);
            renderCurrentForecast(loc, weatherData);
        }
    }
    if (!openOverlay && locations && Object.entries(locations).length > 1) {
        document.querySelector('#menu-middle-btn').classList.add('translate-y-8')
        document.querySelector('#menu-middle-btn').classList.remove('-translate-y-[26px]')
    }
    setTimeout(() => {
        mainPage_tapbar__weather_btn.classList.remove('invisible', 'opacity-0')
    }, 300);


    getLocationButton.addEventListener('click', getUserLocation);

    // Initialize Cards List
    setupSlip(location_cards__container);

    // Initialize Swiper
    var swiper = new Swiper(".mainSwiper", {
        enabled: true,
        cssMode: false,
        effect: 'slide',
        grabCursor: true,
        speed: 400,
        spaceBetween: 40,
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
            type: 'bullets',
        },
        hashNavigation: true,
        hashNavigation: {
            replaceState: true,
        },
    });


    // Open hash location on load
    function slideToId(index) {
        if (openOverlay) {
            HSOverlay.close(openOverlay);
        }
        swiper.slideTo(index, 300);
    }

    const card__wrapper = document.querySelectorAll('.card-wrapper')
    card__wrapper.forEach((el) => {
        el.addEventListener('click', () => {
            // console.log(card__wrapper)
            // console.log(el.id)
            // console.log(editLocation_flag)
            if (!editLocation_flag) {
                const loc_id = Object.values(locations).findIndex(item => item.id == el.dataset.name)
                slideToId(loc_id);
            }
        })
    })

    const del_btns = document.querySelectorAll('.location-del')
    const trash_btns = document.querySelectorAll('.trash')

    del_btns.forEach((el) => {
        el.addEventListener('click', () => {
            card = el.closest('.card-wrapper')
            card__wrapper.forEach((e) => {
                el.classList.remove('-translate-x-24')
            })
            setTimeout(() => {
                card.querySelector('.trash').classList.remove('opacity-0')
                card.classList.remove('duration-[0ms]')
                card.classList.add('duration-[700ms]')
                card.classList.add('-translate-x-24')
                delLocation_flag = true
            }, 100)
        })
    })

    trash_btns.forEach((el) => {
        el.addEventListener('click', () => {
            console.log('trash clicked')
            // lname = el.closest('.card-wrapper').dataset.name
            // deleteLocation(Object.keys(locations).find(key => locations[key].id == lname), lname)
        })
        document.addEventListener('click', (event) => {
            if (!el.contains(event.target) && delLocation_flag) {
                trash_btns.forEach((e) => {
                    e.classList.add('opacity-0')
                })
                card__wrapper.forEach((e) => {
                    e.classList.remove('-translate-x-24');
                    setTimeout(() => {
                        e.classList.remove('duration-[700ms]')
                        e.classList.add('duration-[0ms]')
                    }, 50);
                })
                delLocation_flag = false
            }
        });
    })


    if (locations && Object.entries(locations).length > 0) {
        if (slide) {
            console.log('Slide to', slide)
            slide_id = Object.values(locations).findIndex(item => item.id == slide)
            console.log('slide_id: ', slide_id)
            setTimeout(() => {
                slideToId(slide_id)
            }, 0);
        }
    } else {
        mainPage_placeholder.classList.remove('opacity-0')
    }
}

function generateSlide(loc, preview = false) {
    const template = document.querySelector('#slide-template').text.trim();
    let slide_data = {
        type: 'div',
        id: `slide-${loc.id}`,
        className: `${preview ? '' : 'swiper-slide'} bg-gray-100 dark:bg-cosmic-900`,
        innerHTML: template,
        attrs: {
            dataId: loc.id,
            dataHash: loc.id,
        }
    };
    let slideEl = dom_utils.createEl(slide_data)
    if (preview) {
        document.querySelector('#preview-window').appendChild(slideEl)
        slideEl.firstElementChild.classList.add('hidden')
    } else {
        document.querySelector('#slides').appendChild(slideEl)
    }
    slideEl.querySelector(`.hs-collapse`).setAttribute('id', `detail-weather-info--${loc.id}`)
    slideEl.querySelector(`.detail-weather-toggle`).setAttribute('id', `detail-weather-toggle--${loc.id}`)
    slideEl.querySelector(`.detail-weather-toggle`).setAttribute('data-hs-collapse', `#detail-weather-info--${loc.id}`)
}

function generateLocationCard(loc) {
    const card__wrapper = document.querySelectorAll('.card-wrapper')
    const template = document.querySelector('#card-template').text.trim();
    let card_data = {
        type: 'li',
        id: `card-${loc.id}`,
        className: `card-wrapper no-swipe h-[85px] flex justify-center 
        hs-removing:-translate-x-[500px] hs-removing:h-0 hs-removing:mb-0 
        ease-[cubic-bezier(.23,1,.32,1)] transition-[height,transform] transform-gpu duration-[0ms]`,
        innerHTML: template,
        attrs: {
            dataName: loc.id,
            dataUser_location: loc.is_user_location,
            tabIndex: '-1',
        }
    };
    let cardEl = dom_utils.createEl(card_data)
    cardEl.querySelector('.trash').setAttribute('data-hs-remove-element', `#card-${loc.id}`)
    location_cards__container.appendChild(cardEl)



    // location_cards__container.insertAdjacentHTML('beforeend', `
    //         <li id="card-${loc.id}" data-name="${loc.id}" data-user_location="${loc.is_user_location}" class="card-wrapper no-swipe w-full h-[85px] flex justify-center 
    //         hs-removing:-translate-x-[500px] hs-removing:h-0 hs-removing:mb-0 ease-[cubic-bezier(.23,1,.32,1)] transition-[height,transform] transform-gpu duration-[0ms]">
    //         <!-- BUTTONS-->
    //         <div class="edit-buttons invisible no-swipe no-reorder h-[80px] w-[284px] opacity-0 justify-between grid grid-flow-col transition-all-500">
    //             <div class="edit-icon absolute right-14 opacity-0 no-swipe no-reorder invisible top-4 
    //             transition-opacity-500" data-location_name="${loc.id}">
    //                 <svg class="fill-[#1B2541] dark:fill-white  no-swipe no-reorder" width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    //                     <path class="no-swipe no-reorder" d="M27.5858 17.5858C28.3668 16.8047 29.6332 16.8047 30.4142 17.5858C31.1953 18.3668 31.1953 19.6332 30.4142 20.4142L29.6213 21.2071L26.7929 18.3787L27.5858 17.5858Z"/>
    //                     <path class="no-swipe no-reorder" d="M25.3787 19.7929L17 28.1716V31H19.8284L28.2071 22.6213L25.3787 19.7929Z"/>
    //                 </svg>
    //             </div>
    //             <button type="button" data-hs-remove-element="#card-${loc.id}" class="trash opacity-0 absolute z-50 -right-24 transition-opacity-300 ease-linear ">
    //                 <img class="" src="img/assets/icons/trash.svg">
    //             </button>
    //             <button type="button" class="location-del no-swipe no-reorder">
    //             <img src="img/delete.svg" width="40px" height="40px" alt="">
    //             </button>
    //             <button type="button" class="${loc.is_user_location ? 'no-swipe no-reorder dark:text-cosmic-400/40' : 'location-drag instant dark:text-cosmic-400'} items-center font-light text-3xl w-10">☰</button>
    //         </div>
    //         <section class="card pointer-events-none absolute w-full bg-white dark:bg-cosmic-900 dark:bg-gradient-to-b dark:from-[#192D52] dark:to-[#112645]
    //             p-4 transition-all-500 rounded-2xl h-[85px]">
    //             <div class="name-of-location absolute transition-all-500  w-[calc(100%_-_70px)]">
    //                 <div class="time text-xxs text-gray-300 dark:text-cosmic-400 leading-3"></div>
    //                 <div class="flex location_card__name text-${(loc.name.length > 15) ? 'sm' : 'base'} leading-5 transition duration-300 transform-gpu">
    //                 ${loc.name}
    //                 ${loc.is_user_location ? '<img class="user-location-pin pl-1 transition-all-500" src="img/assets/icons/map-pin.svg">' : ''}
    //                 </div>
    //                 <div class="condition pt-2 text-xs leading-[14px] transition-all-500 truncate "></div>
    //                 </div>
    //                 <div class="absolute right-4 flex flex-row gap-2 transition-all-500">
    //                 <div class="grid grid-flow-row items-center transition-all-500">
    //                     <div class="temp mx-auto text-3xl font-medium transition-all-300"></div>
    //                     <div class="mx-auto minmax items-center flex text-xxs transition-transform duration-150 transform-gpu">
    //                         <svg class="stroke-gray-300 dark:stroke-[#D7F4FE]" width="10" height="11" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg">
    //                             <path d="M3.33334 3.41667L5.00001 1.75M5.00001 1.75L6.66668 3.41667M5.00001 1.75V9.25" stroke-linecap="round" stroke-linejoin="round"/>
    //                         </svg>
    //                         <div class="tempmax"></div>
    //                         <svg class="stroke-gray-300 dark:stroke-[#D7F4FE] ml-1" width="10" height="11" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg">
    //                             <path d="M6.66668 7.58333L5.00001 9.25M5.00001 9.25L3.33334 7.58333M5.00001 9.25L5.00001 1.75" stroke-linecap="round" stroke-linejoin="round"/>
    //                         </svg>
    //                         <div class="tempmin"></div>
    //                     </div>
    //                 </div>
    //                     <div class=" weather-icon w-12 h-12 transition-all-500"></div>
    //             </div>
    //         </section>
    //             </li>
    //             `)
}

function renderCurrentForecast(loc, weatherData, preview = false) {

    // CURRENT WEATHER RENDER
    user_date = new Date();
    const slide = document.querySelector(`#slide-${loc.id}`)
    const todayWeather = weatherData.days[0]

    const detailInfo = slide.querySelector(`.hs-collapse`)
    const detailItems = slide.querySelectorAll(`.detail-item`)
    const locationSlide_headerTemp = slide.querySelector(`.location-slide--header-temp`);
    const weatherDetailsToggle = slide.querySelector(`#detail-weather-toggle--${loc.id}`)
    const weatherDetailsToggleLabel = weatherDetailsToggle.querySelector(`.detail-weather-toggle--label`)
    const weatherDetailsToggleImg = weatherDetailsToggle.querySelector(`.detail-weather-toggle--img`)
    const time_offset = weatherData.tzoffset + user_date.getTimezoneOffset() / 60
    let location_date = new Date(user_date);
    location_date.setHours(location_date.getHours() + time_offset)
    const location_time = getTime2Digits(location_date)
    let currentDate = join(location_date, [{ day: 'numeric' }, { month: 'short' }], ' ');
    const currentWeekday = capitalize(join(location_date, [{ weekday: 'long' }], '-'));
    let sunrise_date = new Date(weatherData.currentConditions.sunriseEpoch * 1000)
    sunrise_date = new Date(sunrise_date);
    sunrise_date.setHours(sunrise_date.getHours() + time_offset)
    let sunset_date = new Date(weatherData.currentConditions.sunsetEpoch * 1000)
    sunset_date = new Date(sunset_date);
    sunset_date.setHours(sunset_date.getHours() + time_offset)
    const dayLight_date = new Date(sunset_date);
    dayLight_date.setTime(sunset_date.getTime() - sunrise_date.getTime())
    dayLight_date.setHours(dayLight_date.getHours() + user_date.getTimezoneOffset() / 60)
    const currentWeather = weatherData.days[0].hours[Number(join(location_date, [{ hour: 'numeric' }], '-'))]
    const current_temperature = Math.round(tempConverter(currentWeather.temp))
    if ((location_date.getHours() > sunset_date.getHours() || location_date.getHours() < sunrise_date.getHours()) && currentWeather.icon.search('-night') == -1) {
        currentWeather.icon = currentWeather.icon + '-night'
    }
    if (locationSlide_headerTemp) {
        locationSlide_headerTemp.innerHTML = `${current_temperature}° 
        <img class="w-6 h-6" src="img/assets/icons/weather-conditions/small/${currentWeather.icon}.svg" alt="" srcset="">`
    }

    function toggleDetailInfo() {
        if (detailInfo.clientHeight > 0) {
            // console.log('▲ details closing... ▲')
            weatherDetailsToggleLabel.innerText = 'Подробнее';
            weatherDetailsToggleImg.classList.remove('rotate-180')
            detailItems.forEach((el) => {
                el.classList.add('opacity-0', '-translate-y-5', '-translate-x-1');
            })
        } else {
            // console.log('▼ details opening... ▼')
            weatherDetailsToggleLabel.innerText = 'Свернуть';
            weatherDetailsToggleImg.classList.add('rotate-180')
            detailItems.forEach((el, index) => {
                var interval = 35;
                setTimeout(() => {
                    el.classList.remove('opacity-0', '-translate-y-5', '-translate-x-1');
                }, index * interval);
            })
        }
    }

    // sun position in degrees
    function sunPosition() {
        const daytimeInMinutes = dayLight_date.getHours() * 60 + dayLight_date.getMinutes();
        const sunriseInMinutes = sunrise_date.getHours() * 60 + sunrise_date.getMinutes();
        const currentTimeInMinutes = location_date.getHours() * 60 + location_date.getMinutes();
        const deltaInMinutes = currentTimeInMinutes - sunriseInMinutes
        const deltaInPersentage = deltaInMinutes * 100 / daytimeInMinutes
        let deltaDegrees = Math.round(-180 + (180 * deltaInPersentage / 100))
        if (deltaDegrees < -180) {
            deltaDegrees = -180
        } else if (deltaDegrees > 0) {
            deltaDegrees = -180
        }
        return deltaDegrees
    }

    // Wind direction calc
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

    if (s_detail) {
        HSCollapse.show(detailInfo)
        toggleDetailInfo()
    }

    // Header
    slide.querySelector('.location-slide--header-title').innerText = loc.name
    slide.querySelector('.current-day').innerHTML = `${currentWeekday}, ${currentDate} ${location_time}`;
    // General info
    slide.querySelector('.temperature').innerHTML = `${current_temperature}<span class="text-2xl absolute font-bold leading-9">°${s_temp}</span>`
    slide.querySelector('.conditions').innerHTML = currentWeather.conditions
    slide.querySelector('.feelslike').innerHTML = `Ощущается как <span class="font-bold"> ${Math.round(tempConverter(currentWeather.feelslike))}°`
    slide.querySelector('.weather-icon').innerHTML = `<img class="${currentWeather.icon == 'clear-day' ? 'animate-wiggle-3' : ''}" src="img/assets/icons/weather-conditions/${currentWeather.icon}.svg">`
    // Detail Info
    slide.querySelector('.sunrise').innerHTML = getTime2Digits(sunrise_date)
    // slide.querySelector('.sun').classList.add(`-rotate-[${sunPosition()}deg]`)
    slide.querySelector('.sun').style.webkitTransform = 'rotate(' + sunPosition() + 'deg)';
    slide.querySelector('.sun').style.mozTransform = 'rotate(' + sunPosition() + 'deg)';
    slide.querySelector('.sun').style.msTransform = 'rotate(' + sunPosition() + 'deg)';
    slide.querySelector('.sun').style.oTransform = 'rotate(' + sunPosition() + 'deg)';
    slide.querySelector('.sun').style.transform = 'rotate(' + sunPosition() + 'deg)';
    // slide.querySelector('.sky').classList.add(`-rotate-[${sunPosition()}deg]`)
    slide.querySelector('.sky').style.webkitTransform = 'rotate(' + sunPosition() + 'deg)';
    slide.querySelector('.sky').style.mozTransform = 'rotate(' + sunPosition() + 'deg)';
    slide.querySelector('.sky').style.msTransform = 'rotate(' + sunPosition() + 'deg)';
    slide.querySelector('.sky').style.oTransform = 'rotate(' + sunPosition() + 'deg)';
    slide.querySelector('.sky').style.transform = 'rotate(' + sunPosition() + 'deg)';
    slide.querySelector('.sunset').innerHTML = getTime2Digits(sunset_date)
    slide.querySelector('.daylight').innerHTML = `${dayLight_date.getHours()} ч ${dayLight_date.getMinutes()} мин`
    slide.querySelector('.humidity').innerHTML = `${Math.round(currentWeather.humidity)}<span class="text-sm font-medium">%</span>`
    slide.querySelector('.pressure').innerHTML = `${Math.round(pressureConverter(Number(currentWeather.pressure)))}<span class="text-sm font-medium"> ${s_pressure}</span>`
    slide.querySelector('.windspeed').innerHTML = `${Math.round(windConverter(currentWeather.windspeed))} <span class="text-sm font-medium">${s_wind}</span>, ${dir}`
    slide.querySelector('.precipprob').innerHTML = `${Math.round(currentWeather.precipprob)}<span class="text-sm font-medium">%</span>`
    slide.querySelector('.tempmax').innerText = `${Math.round(tempConverter(todayWeather.tempmax))}°`
    slide.querySelector('.tempmin').innerText = `${Math.round(tempConverter(todayWeather.tempmin))}°`

    // HOURLY FORECAST RENDER
    renderHourlyForecast(loc.id, weatherData)

    // DAILY FORECAST RENDER
    renderDailyForecast(loc.id, weatherData)

    monthly_forecast_btn = slide.querySelector(`.monthly-forecast-btn`)
    monthly_forecast_btn.addEventListener('click', () => {
        // console.log('Monthly forecast', loc.id)
        renderMonthlyForecast(loc.id)
    })
    monthly_forecast_btn.classList.remove('hidden')
    if (!preview) {
        weatherDetailsToggle.onclick = () => {
            toggleDetailInfo()
        }
        // Change Header on scroll
        var toggleHeader = function (direction, curScroll) {
            if (direction === 2 && curScroll > 200) {
                //replace 52 with the height of your header in px
                weatherDetailsToggle.classList.add('opacity-0', 'pointer-events-none');
                locationSlide_headerTemp.classList.remove('opacity-0');
                prevDirection = direction;
            } else if (direction === 1 && curScroll <= 200) {
                weatherDetailsToggle.classList.remove('opacity-0', 'pointer-events-none');
                locationSlide_headerTemp.classList.add('opacity-0');
                prevDirection = direction;
            }
        };

        let doc = document.documentElement;
        let w = window;
        let prevScroll = w.scrollY || doc.scrollTop;
        let curScroll;
        let direction = 0;
        let prevDirection = 0;
        window.addEventListener('scroll', () => {
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
        }, passiveIfSupported);

        // LOCATIONS CARDS RENDER
        console.log(loc.name.length)
        if (loc.name.length > 18) {
            document.querySelector(`#card-${loc.id} .location-card--name`).classList.add('text-sm')
        }
        document.querySelector(`#card-${loc.id} .location-card--name`).innerText = loc.name
        if (loc.is_user_location) {
            console.log(loc.is_user_location)
            document.querySelector(`#card-${loc.id} .user-location-pin`).innerHTML = `
            <svg class="fill-cosmic-900 dark:fill-white" width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 4.5C7.50555 4.5 7.0222 4.64662 6.61107 4.92133C6.19995 5.19603 5.87952 5.58648 5.6903 6.04329C5.50108 6.50011 5.45157 7.00277 5.54804 7.48773C5.6445 7.97268 5.8826 8.41814 6.23223 8.76777C6.58186 9.1174 7.02732 9.3555 7.51227 9.45196C7.99723 9.54843 8.49989 9.49892 8.95671 9.3097C9.41352 9.12048 9.80397 8.80005 10.0787 8.38893C10.3534 7.9778 10.5 7.49445 10.5 7C10.4992 6.33719 10.2356 5.70175 9.76693 5.23307C9.29825 4.7644 8.66281 4.50076 8 4.5ZM8 8.5C7.70333 8.5 7.41332 8.41203 7.16664 8.2472C6.91997 8.08238 6.72771 7.84811 6.61418 7.57403C6.50065 7.29994 6.47094 6.99834 6.52882 6.70736C6.5867 6.41639 6.72956 6.14912 6.93934 5.93934C7.14912 5.72956 7.41639 5.5867 7.70736 5.52882C7.99834 5.47094 8.29994 5.50065 8.57403 5.61418C8.84811 5.72771 9.08238 5.91997 9.2472 6.16664C9.41203 6.41332 9.5 6.70333 9.5 7C9.49955 7.39769 9.34138 7.77896 9.06017 8.06017C8.77896 8.34137 8.39769 8.49955 8 8.5ZM8 1.5C6.54182 1.50165 5.14383 2.08165 4.11274 3.11274C3.08165 4.14383 2.50165 5.54182 2.5 7C2.5 8.96225 3.40687 11.0424 5.12269 13.0156C5.89481 13.9072 6.76367 14.7101 7.71325 15.4096C7.7973 15.4685 7.89741 15.5 8 15.5C8.10259 15.5 8.2027 15.4685 8.28675 15.4096C9.23633 14.7101 10.1052 13.9072 10.8773 13.0156C12.5931 11.0424 13.5 8.96231 13.5 7C13.4983 5.54182 12.9184 4.14383 11.8873 3.11274C10.8562 2.08165 9.45818 1.50165 8 1.5ZM8 14.3737C6.96669 13.5632 3.5 10.5769 3.5 7C3.5 5.80653 3.97411 4.66193 4.81802 3.81802C5.66193 2.97411 6.80653 2.5 8 2.5C9.19347 2.5 10.3381 2.97411 11.182 3.81802C12.0259 4.66193 12.5 5.80653 12.5 7C12.5 10.577 9.03312 13.5634 8 14.3737Z"/>
            </svg>`
        }
        document.querySelector(`#card-${loc.id} .location-card--time`).innerText = location_time
        document.querySelector(`#card-${loc.id} .location-card--temp`).innerText = Math.round(currentWeather.temp) + '°'
        document.querySelector(`#card-${loc.id} .location-card--condition`).innerText = todayWeather.conditions
        document.querySelector(`#card-${loc.id} .location-card--tempmax`).innerText = Math.round(todayWeather.tempmax) + '°'
        document.querySelector(`#card-${loc.id} .location-card--tempmin`).innerText = Math.round(todayWeather.tempmin) + '°'
        document.querySelector(`#card-${loc.id} .location-card--weather-icon`).innerHTML = `<img class="w-12 h-12" src="img/assets/icons/weather-conditions/${currentWeather.icon}.svg">`
        document.querySelector(`#card-${loc.id} .location-card--edit-icon`).addEventListener('click', (event) => {
            openLocationEditModal(event.target)
        })
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

function renderHourlyForecast(id, weatherData) {
    // console.log(weatherData)
    const slide = document.querySelector(`#slide-${id}`)
    const hourlyPlaceholder = slide.querySelector('.hourlyToday')
    const time_offset = weatherData.tzoffset + user_date.getTimezoneOffset() / 60
    const location_date = new Date(user_date)
    location_date.setHours(location_date.getHours() + time_offset)
    let sunrise_date = new Date(weatherData.currentConditions.sunriseEpoch * 1000)
    sunrise_date = new Date(sunrise_date);
    sunrise_date.setHours(sunrise_date.getHours() + time_offset)
    let sunset_date = new Date(weatherData.currentConditions.sunsetEpoch * 1000)
    sunset_date = new Date(sunset_date);
    sunset_date.setHours(sunset_date.getHours() + time_offset)

    let currentHour = location_date.getHours()
    let nHours = 26 // Number of hours to display
    let leftHours = 24 - currentHour

    for (var day = 0; day < 2; day++) {
        if (day > 0) {
            currentHour = -1
        } else {
            currentHour = location_date.getHours()
        }
        for (let i = 0; i < leftHours; i++) {
            data = weatherData.days[day].hours[currentHour + i]
            if (i == 0 && day == 0) {
                time = 'Сейчас'
                if ((currentHour + i > sunset_date.getHours() || currentHour + i < sunrise_date.getHours()) && data.icon.search('-night') == -1) {
                    if (data.icon.search('day') != -1) {
                        data.icon = data.icon.replace(/day/g, "night")
                    } else {
                        data.icon = data.icon + '-night'
                    }
                }
            }
            else if (day === 1 && i === 0) {
                continue;
            }
            else if (i > 0) {
                time = `${currentHour + i}:00`
                if ((currentHour + i > sunset_date.getHours() || currentHour + i < sunrise_date.getHours()) && data.icon.search('-night') == -1) {
                    // console.log(data.icon.search('day'))
                    if (data.icon.search('day') !== -1) {
                        data.icon = data.icon.replace(/day/g, "night")
                    } else {
                        data.icon = data.icon + '-night'
                    }
                }
            }
            if (currentHour + i == 0 && day != 0) {
                new_date = new Date(location_date)
                new_date.setHours(location_date.getHours() + 24)
                nextDayTip = join(new_date, [{ day: 'numeric' }, { month: 'short' }], ' ')
            } else {
                nextDayTip = ''
            }
            // card
            hourlyPlaceholder.innerHTML += `
        <div class="flex flex-col justify-end items-center px-2  scroll-ml-3 snap-start">
            <div class="date text-xs text-white/50 pb-1 truncate">${nextDayTip}</div>
            <div class="icon w-11 h-11 bg-white dark:bg-cosmic-900 dark:bg-gradient-to-br dark:from-[#192D52] dark:to-[#112645] rounded-xl flex justify-center items-center relative">
                <img class="w-6 h-6" src="img/assets/icons/weather-conditions/small/${data.icon}.svg" alt="" srcset="">
                ${Math.round(data.precipprob) > 20 ?
                    ('<div class="absolute bg-gray-100 dark:bg-cosmic-900 p-[5px] -bottom-2 -right-2 text-xxs text-cyan rounded-3xl">'
                        + Math.ceil((data.precipprob / 10)) * 10 + '%</div>') : ''}
            </div>
            <div class="time font-light text-xs text-gray-300 dark:text-[#ACD8E7] pt-3">${time}</div>
            <div class="temp font-semibold text-lg leading-5 pt-1">${Math.round(tempConverter(data.temp))}°</div>
        </div>`;
        }
        leftHours = nHours - leftHours
    }

}

function renderDailyForecast(id, weatherData, days = 10, monthly = false) {
    const section_id = monthly ? '#monthly' : '.daily';
    if (monthly) {
        slideDailyForecastContainer = document.querySelector(section_id)
    } else {
        slideDailyForecastContainer = document.querySelector(`#slide-${id}`).querySelector(section_id)
    }
    slideDailyForecastContainer.innerHTML = ``
    const time_offset = weatherData.tzoffset + user_date.getTimezoneOffset() / 60
    const location_date = new Date(user_date);
    location_date.setHours(location_date.getHours() + time_offset)
    const currentWeather = weatherData.days[0].hours[Number(join(location_date, [{ hour: 'numeric' }], '-'))]
    const currentTemperature = Math.round(tempConverter(currentWeather.temp))
    let tempRange = minMax(weatherData.days, days)
    let weekTempdelta = tempRange.tempmax - tempRange.tempmin
    // console.log(weatherData)
    // console.log(tempRange)

    for (let i = 0; i < days; i++) {
        if (weatherData.days[i].temp) {
            let tempmin = Math.round(tempConverter(weatherData.days[i].tempmin))
            let tempmax = Math.round(tempConverter(weatherData.days[i].tempmax))
            let currentDayTempDelta = tempmax - tempmin
            let currentTempShift = currentTemperature - tempmin

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
            let gradientWidth = Math.round(100 * (tempmax - tempmin) / weekTempdelta)
            let dot = ''
            if (i == 0) {
                dot = `
                            <div class="absolute h-[12px] w-[12px] -top-[4px] rounded-full bg-[#6390F0] dark:bg-white border-[3px] border-gray-100 dark:border-cosmic-900"
                            style="left: calc(${Math.round(100 * currentTempShift / currentDayTempDelta)}%);">
                            </div>`
            };
            slideDailyForecastContainer.innerHTML += `
                <div class="w-full py-[2px] font-light flex flex-nowrap gap-5 items-center">
                    <div class="small-icon w-[52px] h-[52px] shrink-0 bg-white dark:bg-cosmic-900 dark:bg-gradient-to-br dark:from-[#192D52] dark:to-[#112645] rounded-2xl py-1 relative">
                        <img class="w-[44px] h-[44px] mx-auto" src="img/assets/icons/weather-conditions/${weatherData.days[i].icon}.svg" alt="">
                        ${Math.round(weatherData.days[i].precipprob) > 20 ?
                    ('<div class="absolute bg-gray-100 dark:bg-cosmic-900 p-[5px] -bottom-2 -right-2 text-xxs text-gray-300 dark:text-cyan rounded-3xl">'
                        + Math.ceil((weatherData.days[i].precipprob / 10)) * 10 + '%</div>') : ''}
                    </div>
                    <div class="w-28 shrink-0 flex flex-col gap-1 justify-center">
                        <div class="text-sm leading-[17px]  dark:text-white">
                            <span class="capitalize">${data}</span>
                        </div>
                        <div class="text-xs leading-[14px] text-gray-300 dark:text-cosmic-400">${weatherData.days[i].conditions}
                        </div>
                    </div>
                    <div class="my-4 w-full">
                        <div id="labels" class="flex justify-between mx-auto pb-2 leading-5">
                            <div class="text-gray-300 dark:text-cosmic-400">${tempmin}°</div>
                            <div>${tempmax}°</div>
                        </div>
                        <div class="relative h-1 rounded-md bg-[#D4D4D4]/40 dark:bg-cosmic-800">
                            <div class="absolute h-full rounded-md bg-gradient-to-l from-[#647DFF] to-[#14CDFF] dark:from-[#DEDEDE] dark:to-[#3FD5FE]"
                                style="left: ${(100 * (tempmin - tempRange.tempmin)) / weekTempdelta}%; 
                                width: ${gradientWidth}%">
                                ` + dot + `
                            </div>
                        </div>
                    </div>
                </div>`;
        } else {
            slideDailyForecastContainer.innerHTML += `<div>Прогноз на следующие дни недоступен для данной локации</div>`
            i = days;
        }

    }
}

function renderMonthlyForecast(id) {
    weatherData = JSON.parse(localStorage.getItem(`weatherData-${id}-30`))
    renderDailyForecast(id, weatherData, 30, true)

}