let locations = {};
let locationPreviewData = {}
let openOverlay = false
let weatherArray = []
let minmax, weatherIcon, editButtons,
    s_temp, s_wind, s_pressure, s_lang, s_detail, dir,
    userCountry, locationDataSet, resultList

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
const menuSettings = document.querySelector('#menu-settings');
const locations_placeholder = document.querySelector('#locations-placeholder');
const locationCardsContainer = document.querySelector('#location-cards');
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