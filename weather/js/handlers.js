let locations = {};
let locationPreviewData = {}
let openOverlay = false
let weatherArray = []
let s_temp, s_wind, s_pressure, s_lang, s_detail, dir,
    userCountry, locationDataSet, resultList;

let s_flag = false
let editLocation_flag = false
let delLocation_flag = false
let modalLocation_flag = false
let user_date = new Date();

const suggestionList = document.querySelector('#suggestion-list')
const location_edit_modal__input = document.querySelector('#location-modal-input')
const clearText = document.querySelectorAll('.clear-text-cross')
const slides = document.querySelector('#slides');
const menu_locations = document.querySelector('#menu-locations');
const menu_settings = document.querySelector('#menu-settings');
const locations_placeholder = document.querySelector('#locations-placeholder');
const location_cards__container = document.querySelector('#location-cards--container');
const containerDefaults = document.querySelector('#locations-container').innerHTML;
const locations_header__label = document.querySelector('#locations-header--label');
const locations_header__back_btn = document.querySelector('#locations-header--back-btn');
const locations_header__edit_btn = document.querySelector('#locations-header--edit-btn');
const mainPage_placeholder = document.querySelector('#main-page--placeholder');
const mainPage_search_btn = document.querySelector('#mainpage--search-btn');
const mainPage_tapbar__locations_btn = document.querySelector('#mainpage--tapbar--locations-btn');
const mainPage_tapbar__weather_btn = document.querySelector('#weather-btn');
const mainPage_tapbar__settings_btn = document.querySelector('#mainpage--tapbar--settings-btn');
const currentWeekdayLong = join(new Date, [{ weekday: 'long' }], '-');
const previewWindow = document.querySelector(`#preview-window`)

const searchInput = document.querySelector('#search-input')
const newLocationPreviewEl = document.querySelector('#new-location-preview')
const location_edit_modal = document.querySelector('#location-edit-modal')
const locations_backdrop = document.querySelector('#locations-backdrop')
const getLocationPlaceholder = document.querySelector('#search-user-location--placeholder');
const getLocationButton = document.querySelector('#search-user-location--btn');
const locations_menu_container = document.querySelector('#locations-container')
const locations_menu_header = document.querySelector('#locations--header')
const cancelSearchButton = document.querySelector('#location-search--cancel-button')

locations_backdrop.addEventListener('click', () => {
    if (document.querySelector('#loading-animation').classList.contains('opacity-0')) {
        closeLocationEditModal()
        hideLocationsBackdrop()
        searchCancel()
    }
})

searchInput.onfocus = searchFocus;
searchInput.onkeyup = getGeoData;
cancelSearchButton.addEventListener('click', searchCancel);

searchInput.addEventListener('input', (event) => {
    // console.log(event.target.value.length)
    if (event.target.value.length == 0) {
        event.target.nextElementSibling.classList.add('opacity-0', 'invisible')
        suggestionList.innerHTML = ''
        if (!locations || Object.values(locations).findIndex(item => item.is_user_location == true) == -1) {
            getLocationPlaceholder.classList.remove('hidden')
            setTimeout(() => {
                getLocationPlaceholder.classList.remove('opacity-0')
            }, 50);
        } else {
            getLocationPlaceholder.classList.add('opacity-0')
            setTimeout(() => {
                getLocationPlaceholder.classList.add('hidden')
            }, 400);
        }
    } else {
        getLocationPlaceholder.classList.add('opacity-0')
        setTimeout(() => {
            getLocationPlaceholder.classList.add('hidden')
        }, 400);
        event.target.nextElementSibling.classList.remove('opacity-0', 'invisible')
    }
})

function searchFocus() {
    if (!locations || Object.values(locations).findIndex(item => item.is_user_location == true) == -1) {
        getLocationPlaceholder.classList.remove('hidden')
        setTimeout(() => {
            getLocationPlaceholder.classList.remove('opacity-0')
        }, 300);
    } else {
        getLocationPlaceholder.classList.add('opacity-0')
        setTimeout(() => {
            getLocationPlaceholder.classList.add('hidden')
        }, 400);
    }
    // mainPage_placeholder.classList.add('hidden', 'opacity-0')
    locations_placeholder.classList.add('opacity-0');
    setTimeout(() => {
        locations_placeholder.classList.add('hidden')
        searchInput.focus()
    }, 500);
    suggestionList.classList.remove('invisible', 'opacity-0')
    searchInput.placeholder = 'Введите название'
    searchInput.classList.add('w-[calc(100vw-104px)]')
    searchInput.classList.remove('w-full', 'dark:text-cosmic-500')
    menu_locations.classList.remove('overflow-y-scroll')
    locations_menu_container.classList.remove('overflow-x-hidden')
    cancelSearchButton.classList.remove('-right-20')
    searchInput.parentNode.classList.add('-translate-y-12')
    location_cards__container.classList.add('-translate-y-14', 'scale-[0.96]', '-z-10')
    locations_menu_header.classList.add('opacity-0', 'invisible', '-translate-y-2', 'blur-xl', 'scale-[0.99]')
    showLocationsBackdrop()
    if (editLocation_flag) {
        editLocationsToggle()
    }
}

function searchCancel() {
    getLocationPlaceholder.classList.add('opacity-0', 'hidden')
    hideLocationsBackdrop()
    if (!locations || Object.entries(locations).length == 0) {
        locations_placeholder.classList.remove('hidden')
    }
    setTimeout(() => {
        locations_placeholder.classList.remove('opacity-0')
        // mainPage_placeholder.classList.remove('opacity-0')
    }, 100);
    searchInput.nextElementSibling.classList.add('opacity-0', 'invisible')
    searchInput.placeholder = 'Найти новую локацию'
    searchInput.value = ''
    searchInput.classList.remove('w-[calc(100vw-104px)]')
    searchInput.classList.add('w-full', 'dark:text-cosmic-500')
    menu_locations.classList.add('overflow-y-scroll')
    locations_menu_container.classList.add('overflow-x-hidden')
    cancelSearchButton.classList.add('-right-20')
    searchInput.parentNode.classList.remove('-translate-y-12')
    location_cards__container.classList.remove('-translate-y-14', 'scale-[0.96]', '-z-10')
    locations_menu_header.classList.remove('opacity-0', 'invisible', '-translate-y-2', 'blur-xl', 'scale-[0.99]')
    suggestionList.classList.add('invisible', 'opacity-0')
    suggestionList.innerHTML = ''
}


/* Passive Feature detection */
let passiveIfSupported = false;
try {
    window.addEventListener("test", null,
        Object.defineProperty(
            {},
            "passive",
            {
                get() { passiveIfSupported = { passive: true }; }
            }
        )
    );
} catch (err) { }

function loadSettings() {
    var checkboxes = document.querySelectorAll('input[name=settings]')
    checkboxes.forEach(function (checkbox) {
        localStorage.getItem(checkbox.id)
    })
}


// converting first letter to uppercase
function capitalize(str) {

    const capitalized = str.charAt(0).toUpperCase() + str.slice(1);

    return capitalized;
}
const classToggle = (el, ...args) => {
    args.map(e => el.classList.toggle(e))
}

function showLoadingAnimation() {
    document.querySelector('#loading-animation').classList.remove('opacity-0', 'scale-0')
}

function hideLoadingAnimation() {
    document.querySelector('#loading-animation').classList.add('opacity-0', 'scale-0')
}

function getTime2Digits(date, offset = 0) {
    hrs = date.getHours() + offset
    return String(hrs).padStart(2, '0') + ":" + String(date.getMinutes()).padStart(2, '0')
}

function tempConverter(temp) {
    return s_temp == 'C' ? temp : (temp * 9 / 5 + 32);
}

function windConverter(wind) {
    return s_wind == 'км/ч' ? wind : (0.277778 * wind);
}

function pressureConverter(p) {
    return s_pressure == 'гПа' ? p : p * 0.1 / 0.1333223684;
}

function minMax(obj, days) {
    var keys = Object.keys(obj);
    var i;
    var minMin = keys[0]; // ignoring case of empty obj for conciseness
    var maxMax = keys[0];
    for (i = 0; i < days; i++) {
        var value = keys[i];
        if (obj[value].tempmin < obj[minMin].tempmin) minMin = value;
        if (obj[value].tempmax > obj[maxMax].tempmax) maxMax = value;
    }
    var tempRange = {
        'tempmin': Math.round(tempConverter(obj[minMin].tempmin)),
        'tempmax': Math.round(tempConverter(obj[maxMax].tempmax))
    }
    return tempRange
}

function join(t, a, s) {
    function format(m) {
        let f = new Intl.DateTimeFormat('ru', m);
        return f.format(t);
    }
    return a.map(format).join(s);
}

function setAttributes(el, attrs) {
    for (var key in attrs) {
        el.setAttribute(key, attrs[key]);
    }
}
// fetch("https://ipinfo.io/json?token=bf205b8bacf2c5").then(
//     (response) => response.json()
// ).then((jsonResponse) => { userCountry = jsonResponse.country })

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

function editLocationsToggle() {
    const card__wrapper = document.querySelectorAll('.card-wrapper')
    const cards = document.querySelectorAll('.card')
    const user_location_pin = document.querySelector('.user-location-pin')
    const editButtons = document.querySelectorAll('.location-card--edit-buttons')
    const location_card__name = document.querySelectorAll('.location-card--name')
    const weather_icon = document.querySelectorAll('.location-card--weather-icon')
    const temp = document.querySelectorAll('.location-card--temp')
    const condition = document.querySelectorAll('.location-card--condition')
    const minmax = document.querySelectorAll('.location-card--minmax')
    const edit_location_btns = document.querySelectorAll('.location-card--edit-icon')
    const weather_info__wrapper = document.querySelectorAll('.weather-info--wrapper')

    classToggle(locations_header__back_btn, 'opacity-0')
    classToggle(locations_header__label, 'opacity-0')
    setTimeout(() => {
        locations_header__edit_btn.innerText = locations_header__edit_btn.innerText == "Изм." ? "Готово" : "Изм."
    }, 50);
    setTimeout(() => {
        editLocation_flag = editLocation_flag == true ? false : true
    }, 20)
    card__wrapper.forEach((e) => {
        e.classList.remove('-translate-x-24')
    })
    cards.forEach((el) => {
        classToggle(el, 'w-[calc(100%_-_100px)]', 'w-full', 'h-[85px]', 'h-[80px]')
    })
    editButtons.forEach((e) => {
        classToggle(e, 'w-[284px]', 'w-full', 'opacity-0', 'invisible', 'z-20')
    })
    location_card__name.forEach((e) => {
        classToggle(e, 'translate-y-2', 'w-[calc(100%_-_32px)]')
    })

    condition.forEach((e) => {
        classToggle(e, 'opacity-0', 'translate-y-3', 'translate-x-2')
    })

    classToggle(user_location_pin, 'scale-0', 'opacity-0', 'translate-x-2')

    weather_info__wrapper.forEach((e) => {
        classToggle(e, 'w-0', 'w-[120px]', 'opacity-0', '-translate-x-24')
    })

    weather_icon.forEach((e) => {
        classToggle(e, 'opacity-0')
    })

    temp.forEach((el) => {
        classToggle(el, 'translate-x-12', 'opacity-0')
    })
    minmax.forEach((el) => {
        classToggle(el, 'translate-x-8', 'invisible', 'opacity-0')
        el.parentElement.classList.toggle('translate-x-8')
    })
    edit_location_btns.forEach((e) => {
        classToggle(e, 'opacity-0', 'invisible')
    })
}

function getUserLocation() {
    getLocationPlaceholder.classList.add('opacity-0')
    setTimeout(() => {
        getLocationPlaceholder.classList.add('hidden')
    }, 400);
    locations_backdrop.classList.add('z-[5]')
    showLoadingAnimation()
    const options = {
        enableHighAccuracy: true,
        timeout: 10000,
    };

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            showPosition,
            showError,
            options
        );

    } else {
        x = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position, is_user_location = true) {
    console.log(is_user_location);
    getLocationPlaceholder.classList.add('opacity-0')
    setTimeout(() => {
        getLocationPlaceholder.classList.add('hidden')
    }, 400);
    locations_backdrop.classList.add('z-[5]')
    showLoadingAnimation()
    if (position) {
        // let url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&zoom=1&format=json&accept-language=ru&addressdetails=1&email=tsoyilya@gmail.com`;
        let baseurl = 'https://api.bigdatacloud.net/data/reverse-geocode-client';
        // test_lon = 41.778885312309285
        // test_lat = 41.80871719114782
        url = baseurl
            + "?latitude=" + position.coords.latitude
            + "&longitude=" + position.coords.longitude
            + "&localityLanguage=ru";
        let options = {
            // method: "POST",
            // mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
        }
        request(url, options)
            .then((geolocation => previewWeather(geolocation, is_user_location)))
    } else {
        console.log('No coordinates :(')
    }
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
            document.querySelector('#suggestion-list').innerText = 'недостаточно символов'
        }
    } else {
        console.log('Недопустимые символы')
        document.querySelector('#suggestion-list').innerText = 'Недопустимые символы'
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
        let position = {
            coords: {
                longitude: value.data.geo_lon,
                latitude: value.data.geo_lat,
            }
        }
        // let action = `showPosition()`
        if (value.data.fias_level === "65") {
            delete (rawList[key]);
            rawList.length -= 1;
        } else {
            let searchText = searchInput.value
            let name = (value.data.settlement !== null)
                ? value.data.settlement_type_full + ' ' + value.data.settlement
                : value.data.city_type_full + ' ' + value.data.city;
            let countryCode = value.data.country_iso_code
            let id = (value.data.fias_id !== null) ? value.data.fias_id : value.data.geoname_id;
            let region = value.data.region_with_type;
            let country = value.data.country;
            let capText = searchText[0].toUpperCase() + searchText.slice(1)
            let locationLi = document.createElement('li');
            locationLi.addEventListener('click', () => showPosition(position, false))
            if ((locations) && (Object.values(locations).findIndex(item => item.id == id) != -1)) {
                action = ''
                locationLi.classList.add('pointer-events-none', 'text-slate-500', 'py-2', 'pr-2', 'overflow-hidden', 'overflow-ellipsis', 'whitespace-nowrap')
                text = `${name}, ${region}${(countryCode !== userCountry) ? ', ' + country : ''}`
            } else {
                // action = action;
                locationLi.classList.add('py-2', 'pr-2', 'overflow-hidden', 'overflow-ellipsis', 'whitespace-nowrap')
                text = `${name.replace(capText, `<span class="text-primary-light dark:text-yellow">${capText}</span>`)}, <span class="text-gray-300">${region}${(countryCode !== userCountry) ? ', ' + country : ''}</span>`
            }

            locationLi.innerHTML = text
            suggestionList.appendChild(locationLi)
        }
    }
}

function hideWeatherPreview() {
    hideLoadingAnimation()
    localStorage.removeItem(`weatherData-${locationPreviewData.id}-updateDate`);
    localStorage.removeItem(`weatherData-${locationPreviewData.id}-10`);
    localStorage.removeItem(`weatherData-${locationPreviewData.id}-30`);
    newLocationPreviewEl.classList.add('opacity-0', 'translate-y-[600px]', '-z-10');
    newLocationPreviewEl.classList.remove('z-[130]');
    setTimeout(() => {
        newLocationPreviewEl.classList.add('hidden');
        previewWindow.innerHTML = '';
        locations_backdrop.classList.remove('z-[5]')
    }, 300);
}

function previewWeather(loc, is_user_location = true) {
    console.log('preview loc: ')
    console.log(loc)
    locationPreviewData = {
        id: loc.plusCode.replace(/[+]/g, "-"),
        name: loc.city || loc.locality,
        original_name: loc.city || loc.locality,
        name_translit: translit(loc.city || loc.locality),
        latitude: loc.latitude,
        longitude: loc.longitude,
        country_code: loc.countryCode,
        country: loc.countryName,
        is_user_location: is_user_location,
    }
    console.log(locationPreviewData)
    getWeatherDataFromAPI(locationPreviewData.id, locationPreviewData.latitude, locationPreviewData.longitude, 10, true)
    getWeatherDataFromAPI(locationPreviewData.id, locationPreviewData.latitude, locationPreviewData.longitude, 30)
}

function generatePreview(loc, weatherData, is_user_location = false) {
    id = loc.id
    setTimeout(() => {
        newLocationPreviewEl.classList.remove('opacity-0', 'translate-y-[600px]')
        newLocationPreviewEl.classList.add('z-[130]')
    }, 50);
    newLocationPreviewEl.classList.remove('hidden', '-z-10');
    addButton = document.querySelector('#add-weather-preview')
    addButton.dataset.locationId = loc.id
    addButton.dataset.user_location = is_user_location
    document.querySelector('#location-name').innerText = loc.name

    generateSlide(loc, true);
    renderCurrentForecast(loc, weatherData, true)
    renderHourlyForecast(loc.id, weatherData)
    renderDailyForecast(loc.id, weatherData, 10)
    document.querySelector('#preview-window').scrollTop = 0;


}
function setupSlip(list) {
    if (locations) {
        itemsArray = []
        itemsArray = Object.values(locations)
    }

    list.addEventListener('slip:beforeswipe', function (e) {
        if (e.target.classList.contains('no-swipe')) {
            e.preventDefault();
        }
    }, false);

    list.addEventListener('slip:swipe', function (e) {
        // e.target list item swiped
        // if (thatWasSwipeToRemove) {
        // list will collapse over that element
        // e.target.parentNode.removeChild(e.target);
        // } else {
        e.preventDefault(); // will animate back to original position
        // }
    });

    list.addEventListener('slip:beforewait', function (e) {
        if (e.target.classList.contains('instant')) e.preventDefault();
    }, false);

    list.addEventListener('slip:afterswipe', function (e) {
        e.target.parentNode.appendChild(e.target);
    }, false);

    list.addEventListener('slip:beforereorder', function (e) {
        if (e.target.classList.contains('no-reorder')) {
            e.preventDefault();
        }
    }, false);
    list.addEventListener('slip:reorder', function (e) {
        if ((e.target.dataset.is_user_location == "true")
            || (e.detail.insertBefore && e.detail.insertBefore.dataset.is_user_location == "true")) {
            e.preventDefault()
        } else {
            reordered_locations = {}
            const movedItem = itemsArray[e.detail.originalIndex];
            // console.log(e.detail.originalIndex, e.detail.spliceIndex)
            // console.log(e.target)
            swiper.addSlide(e.detail.spliceIndex + 1, swiper.slides[e.detail.originalIndex])
            // swiper.removeSlide(e.detail.originalIndex)
            itemsArray.splice(e.detail.originalIndex, 1); // Remove item from the previous position
            itemsArray.splice(e.detail.spliceIndex, 0, movedItem); // Insert item in the new position
            // console.log(itemsArray)
            itemsArray.forEach((el) => {
                // console.log(itemsArray.indexOf(el))
                // console.log(itemsArray.indexOf(el))
                // console.log(el)
                // console.log(el.is_user_location)
                if (itemsArray[0].is_user_location === true) {
                    reordered_locations[String(itemsArray.indexOf(el))] = el
                } else {
                    reordered_locations[String(itemsArray.indexOf(el) + 1)] = el
                }
            })
            locations = reordered_locations
            // And update the DOM:
            e.target.parentNode.insertBefore(e.target, e.detail.insertBefore);
            swiper.removeAllSlides()
            for (const loc of Object.values(locations)) {
                weatherData = JSON.parse(localStorage.getItem(`weatherData-${loc.id}-10`))
                generateSlide(loc);
                renderCurrentForecast(loc, weatherData);
            }

            localStorage.setItem('locations', JSON.stringify(locations));

            // add to cookies
            // setCookie('locations', JSON.stringify(locations), 30);
        }
    })
    //     console.log(e.target.parentNode)
    //     e.target.parentNode.insertBefore(e.target, e.detail.insertBefore);
    //     swapElementsInObject(locations, e.target, e.detail.insertBefore)
    //     return false;
    // }, false);
    return new Slip(list);
}