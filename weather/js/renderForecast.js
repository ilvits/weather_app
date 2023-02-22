// Current Weather Data Append
function renderCurrentForecast(loc, weatherData, preview = false) {

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
    if (weatherData.currentConditions.windgust) {
        slide.querySelector('.windgust').classList.remove('hidden');
        slide.querySelector('.windgust').innerHTML = `  Порывы ветра до <strong> ${Math.round(windConverter(weatherData.currentConditions.windgust))} ${s_wind}</strong>`
    }
    slide.querySelector('.feelslike').innerHTML = `Ощущается как <strong> ${Math.round(tempConverter(currentWeather.feelslike))}°</strong>`
    slide.querySelector('.weather-icon').innerHTML = `<img class="${currentWeather.icon == 'clear-day' ? 'animate-wiggle-3' : ''}" src="img/assets/icons/weather-conditions/${currentWeather.icon}.svg">`
    // Detail Info
    slide.querySelector('.sunrise').innerHTML = getTime2Digits(sunrise_date)
    slide.querySelector('.sun').style.webkitTransform = 'rotate(' + sunPosition() + 'deg)';
    slide.querySelector('.sun').style.mozTransform = 'rotate(' + sunPosition() + 'deg)';
    slide.querySelector('.sun').style.msTransform = 'rotate(' + sunPosition() + 'deg)';
    slide.querySelector('.sun').style.oTransform = 'rotate(' + sunPosition() + 'deg)';
    slide.querySelector('.sun').style.transform = 'rotate(' + sunPosition() + 'deg)';
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
        window.addEventListener('scroll', (el) => {
            // console.log(el.target)
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
        // console.log(loc.name.length)
        if (loc.name.length > 18) {
            document.querySelector(`#card-${loc.id} .card__location-name`).classList.add('text-sm')
        }
        document.querySelector(`#card-${loc.id} .card__location-name`).innerText = loc.name
        if (loc.is_user_location) {
            // console.log(loc.is_user_location)
            document.querySelector(`#card-${loc.id} .card__location-pin`).innerHTML = `
            <svg class="ml-2 fill-cosmic-900 dark:fill-white" width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 4.5C7.50555 4.5 7.0222 4.64662 6.61107 4.92133C6.19995 5.19603 5.87952 5.58648 5.6903 6.04329C5.50108 6.50011 5.45157 7.00277 5.54804 7.48773C5.6445 7.97268 5.8826 8.41814 6.23223 8.76777C6.58186 9.1174 7.02732 9.3555 7.51227 9.45196C7.99723 9.54843 8.49989 9.49892 8.95671 9.3097C9.41352 9.12048 9.80397 8.80005 10.0787 8.38893C10.3534 7.9778 10.5 7.49445 10.5 7C10.4992 6.33719 10.2356 5.70175 9.76693 5.23307C9.29825 4.7644 8.66281 4.50076 8 4.5ZM8 8.5C7.70333 8.5 7.41332 8.41203 7.16664 8.2472C6.91997 8.08238 6.72771 7.84811 6.61418 7.57403C6.50065 7.29994 6.47094 6.99834 6.52882 6.70736C6.5867 6.41639 6.72956 6.14912 6.93934 5.93934C7.14912 5.72956 7.41639 5.5867 7.70736 5.52882C7.99834 5.47094 8.29994 5.50065 8.57403 5.61418C8.84811 5.72771 9.08238 5.91997 9.2472 6.16664C9.41203 6.41332 9.5 6.70333 9.5 7C9.49955 7.39769 9.34138 7.77896 9.06017 8.06017C8.77896 8.34137 8.39769 8.49955 8 8.5ZM8 1.5C6.54182 1.50165 5.14383 2.08165 4.11274 3.11274C3.08165 4.14383 2.50165 5.54182 2.5 7C2.5 8.96225 3.40687 11.0424 5.12269 13.0156C5.89481 13.9072 6.76367 14.7101 7.71325 15.4096C7.7973 15.4685 7.89741 15.5 8 15.5C8.10259 15.5 8.2027 15.4685 8.28675 15.4096C9.23633 14.7101 10.1052 13.9072 10.8773 13.0156C12.5931 11.0424 13.5 8.96231 13.5 7C13.4983 5.54182 12.9184 4.14383 11.8873 3.11274C10.8562 2.08165 9.45818 1.50165 8 1.5ZM8 14.3737C6.96669 13.5632 3.5 10.5769 3.5 7C3.5 5.80653 3.97411 4.66193 4.81802 3.81802C5.66193 2.97411 6.80653 2.5 8 2.5C9.19347 2.5 10.3381 2.97411 11.182 3.81802C12.0259 4.66193 12.5 5.80653 12.5 7C12.5 10.577 9.03312 13.5634 8 14.3737Z"/>
            </svg>`
        } else {
            document.querySelector(`#card-${loc.id} .card__location-pin`).classList.add('hidden')
        }
        document.querySelector(`#card-${loc.id} .card__current-time`).innerText = location_time
        document.querySelector(`#card-${loc.id} .card__current-temp`).innerText = Math.round(currentWeather.temp) + '°'
        document.querySelector(`#card-${loc.id} .card__current-condition`).innerText = todayWeather.conditions
        document.querySelector(`#card-${loc.id} .card__max-temp`).innerText = Math.round(todayWeather.tempmax) + '°'
        document.querySelector(`#card-${loc.id} .card__min-temp`).innerText = Math.round(todayWeather.tempmin) + '°'
        document.querySelector(`#card-${loc.id} .card__weather-icon`).innerHTML = `<img class="w-12 h-12 shrink-0" src="img/assets/icons/weather-conditions/${currentWeather.icon}.svg">`
        document.querySelector(`#card-${loc.id} .card__edit-btn`).addEventListener('click', (event) => {
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
            <div class="date text-xs text-gray- dark:text-cosmic-500 pb-1 truncate">${nextDayTip}</div>
            <div class="icon w-11 h-11 bg-white dark:bg-cosmic-900 dark:bg-gradient-to-br dark:from-[#192D52] dark:to-[#112645] rounded-xl flex justify-center items-center relative">
                <img class="w-6 h-6" src="img/assets/icons/weather-conditions/small/${data.icon}.svg" alt="" srcset="">
                ${Math.round(data.precipprob) > 20 ?
                    ('<div class="absolute bg-gray-100 dark:bg-cosmic-900 p-[5px] -bottom-2 -right-2 text-xxs text-gray-300 dark:text-cosmic-300 rounded-3xl">'
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
        if (weatherData.days[i].temp !== null) {
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
                dot = `<div class="absolute h-[8px] w-[8px] -top-[2px] rounded-full bg-[#6390F0] dark:bg-white border-[1.5px] border-gray-100 dark:border-cosmic-900" style="left: calc(${Math.round(100 * currentTempShift / currentDayTempDelta)}%);"></div>`
            };
            slideDailyForecastContainer.innerHTML += `
                <div class="w-full py-[2px] font-light flex flex-nowrap gap-5 items-center">
                    <div class="small-icon w-[52px] h-[52px] shrink-0 bg-white dark:bg-cosmic-900 dark:bg-gradient-to-br dark:from-[#192D52] dark:to-[#112645] rounded-2xl py-1 relative">
                        <img class="w-[44px] h-[44px] mx-auto" src="img/assets/icons/weather-conditions/${weatherData.days[i].icon}.svg" alt="">
                        ${Math.round(weatherData.days[i].precipprob) > 20 ?
                    ('<div class="absolute bg-gray-100 dark:bg-cosmic-900 p-[5px] -bottom-2 -right-2 text-xxs text-gray-300 dark:text-cosmic-300 rounded-3xl">'
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
                                style="left: ${(100 * (tempmin - tempRange.tempmin)) / weekTempdelta}%; width: ${gradientWidth}%">` + dot + `</div>
                        </div>
                    </div>
                </div>`;
        } else {
            slideDailyForecastContainer.innerHTML += `<strong>Прогноз на следующие дни недоступен для данной локации</strong>`
            i = days;
        }

    }
}

function renderMonthlyForecast(id) {
    weatherData = JSON.parse(localStorage.getItem(`weatherData-${id}`))
    renderDailyForecast(id, weatherData, 30, true)

}