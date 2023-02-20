let locationPreviewData = {}
let weatherArray = []
let openOverlay = false
let s_flag = false
let editLocation_flag = false
let delLocation_flag = false
let modalLocation_flag = false
let user_date = new Date();
let slide = window.location.hash.split('#').pop();
var userCountry = requestUserCountry()

const currentWeekdayLong = join(new Date, [{ weekday: 'long' }], '-');
const slides = document.querySelector('#slides');
const suggestionList = document.querySelector('#suggestion-list')
const clearText = document.querySelectorAll('.clear-text-cross')
const menu_locations = document.querySelector('#menu-locations');
const menu_settings = document.querySelector('#menu-settings');
const locations_placeholder = document.querySelector('#locations-placeholder');
const mainPage_placeholder = document.querySelector('#main-page--placeholder');
const getLocationPlaceholder = document.querySelector('#search-user-location--placeholder');
const location_cards__container = document.querySelector('#location-cards--container');
const containerDefaults = document.querySelector('#locations-container').innerHTML;
const location_edit_modal = document.querySelector('#location-edit-modal')
const location_edit_modal__input = document.querySelector('#location-modal-input')
const location_edit_modal__ok_btn = location_edit_modal.querySelector('.location-search--ok-btn')
const location_edit_modal__cancel_btn = location_edit_modal.querySelector('.location-search--cancel-btn')
const location_restore_name = document.querySelector('#restore-name')
const locations_backdrop = document.querySelector('#locations-backdrop')
const locations_menu_container = document.querySelector('#locations-container')
const locations_menu_header = document.querySelector('#locations--header')
const locations_header__label = document.querySelector('#locations-header--label');
const locations_header__back_btn = document.querySelector('#locations-header--back-btn');
const locations_header__edit_btn = document.querySelector('#locations-header--edit-btn');
const mainPage_search_btn = document.querySelector('#mainpage--search-btn');
const mainPage_tapbar__locations_btn = document.querySelector('#mainpage--tapbar--locations-btn');
const mainPage_tapbar__weather_btn = document.querySelector('#weather-btn');
const mainPage_tapbar__settings_btn = document.querySelector('#mainpage--tapbar--settings-btn');
const getLocationButton = document.querySelector('#search-user-location--btn');
const previewWindow = document.querySelector(`#preview-window`)
const searchInput = document.querySelector('#search-input')
const cancelSearchButton = document.querySelector('#location-search--cancel-button')
const reset_settings = document.querySelector('#reset-settings')
const newLocationPreviewEl = document.querySelector('#new-location-preview')

// request User Country code. User country hide in location search suggestions.
function requestUserCountry() {
    if (!localStorage.userCountry) {
        request("https://ipinfo.io/json?token=bf205b8bacf2c5")
            .then(jsonResponse => {
                userCountry = (jsonResponse.country).toLowerCase() || 'Unknown';
                localStorage.setItem('userCountry', userCountry)
                return userCountry
            })
    } else {
        return localStorage.userCountry
    }
}

function loadSettings() {
    var checkboxes = document.querySelectorAll('input[name=settings]')
    checkboxes.forEach((checkbox) => {
        localStorage.getItem(checkbox.id)
    })
    // Settings
    s_temp = localStorage.getItem('s-temp') == 'true' ? 'F' : 'C'
    s_wind = localStorage.getItem('s-wind') == 'true' ? 'м/с' : 'км/ч'
    s_detail = localStorage.getItem('s-details') == 'true' ? true : false
    s_pressure = localStorage.getItem('s-pressure') == 'true' ? 'гПа' : 'мм'
    // s_lang = localStorage.getItem('s-lang') == 'true' ? 'РУС' : 'ENG'

}

// delete all LocalStorage data
function resetSettings() {
    if (confirm("Вы точно хотите удвлить все локации и настройки?   ") == true) {
        localStorage.clear()
        window.location.reload()
    } else {
    }
}

// Open location on load
function slideToId(index, duration = 300) {
    if (openOverlay) {
        HSOverlay.close(openOverlay);
    }
    swiper.slideTo(index, duration);
}

// setup location Cards on "My locations"
function setupSlip(list) {
    if (typeof locations !== 'undefined') {
        itemsArray = []
        itemsArray = Object.values(locations)
    } else {
        console.table('Locations undefined')
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
    list.addEventListener('slip:reorder', function (event) {
        if ((event.target.dataset.is_user_location == "true")
            || (event.detail.insertBefore && event.detail.insertBefore.dataset.is_user_location == "true")) {
            event.preventDefault()
        } else {
            reordered_locations = {}
            const movedItem = itemsArray[event.detail.originalIndex];
            // console.log(event.detail.originalIndex, event.detail.spliceIndex)
            // console.log(event.target)
            swiper.addSlide(event.detail.spliceIndex + 1, swiper.slides[event.detail.originalIndex])
            // swiper.removeSlide(event.detail.originalIndex)
            // console.log(itemsArray)
            itemsArray.splice(event.detail.originalIndex, 1); // Remove item from the previous position
            itemsArray.splice(event.detail.spliceIndex, 0, movedItem); // Insert item in the new position
            itemsArray.forEach((el) => {
                // console.log(itemsArray.indexOf(el))
                // console.log(itemsArray.indexOf(el))
                console.log(el)
                console.log(el.is_user_location)
                if (itemsArray[0].is_user_location === true) {
                    reordered_locations[String(itemsArray.indexOf(el))] = el
                } else {
                    reordered_locations[String(itemsArray.indexOf(el) + 1)] = el
                }
            })
            locations = reordered_locations
            // And update the DOM:
            event.target.parentNode.insertBefore(event.target, event.detail.insertBefore);
            swiper.removeAllSlides()
            for (const loc of Object.values(locations)) {
                weatherData = JSON.parse(localStorage.getItem(`weatherData-${loc.id}`))
                generateSlide(loc);
                renderCurrentForecast(loc, weatherData);
            }

            localStorage.setItem('locations', JSON.stringify(locations));

            // add to cookies
            // setCookie('locations', JSON.stringify(locations), 30);
        }
    })
    //     console.log(event.target.parentNode)
    //     e.target.parentNode.insertBefore(e.target, e.detail.insertBefore);
    //     swapElementsInObject(locations, e.target, e.detail.insertBefore)
    //     return false;
    // }, false);
    return new Slip(list);
}

// Update all data in Slides and Cards after timeout
function updateInfo() {
    const date = new Date()
    const lastPageUpdate = new Date(localStorage.getItem('lastPageUpdate'))
    const delta = ((date.getTime() - lastPageUpdate.getTime()) / 1000)
    if (delta > 300) {
        console.log('update')
        for (const loc of Object.values(locations)) {
            const weatherData = JSON.parse(localStorage.getItem(`weatherData-${loc.id}`))
            renderCurrentForecast(loc, weatherData);
        }
        localStorage.setItem('lastPageUpdate', new Date())
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
    // const card__wrapper = document.querySelectorAll('.card__wrapper')
    const template = document.querySelector('#card-template').text.trim();
    let card_data = {
        type: 'li',
        id: `card-${loc.id}`,
        className: `no-swipe no-reorder relative hs-removing:-translate-x-[500px] hs-removing:h-0 hs-removing:mb-0`,
        innerHTML: template,
        attrs: {
            dataLocation_id: loc.id,
            dataIs_user_location: loc.is_user_location,
            tabIndex: '-1',
        }
    };
    let cardEl = dom_utils.createEl(card_data)
    cardEl.querySelector('.trash').setAttribute('data-hs-remove-element', `#card-${loc.id}`)
    location_cards__container.appendChild(cardEl)
}

// Initialize Swiper
const swiper = new Swiper(".swiper", {
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

function addNewLocation() {
    // add to object

    if (locations && Object.entries(locations).length > 0) {
        const locations_key_array = Object.keys(locations)
        index = locationPreviewData.is_user_location ? 0 : Number(locations_key_array[locations_key_array.length - 1]) + 1;
    } else {
        index = 1
    }

    locations = addToObject(locations, String(index), locationPreviewData)
    localStorage.setItem('locations', JSON.stringify(locations));

    searchInput.placeholder = 'Найти новое место'
    searchInput.value = ''
    window.location.href = '#' + id
    document.location.reload();
}

function deleteLocation(index, id) {
    console.log(index, id)
    swiper.removeSlide(Object.values(locations).findIndex(item => item.id == id))
    delete (locations[index]);
    localStorage.setItem('locations', JSON.stringify(locations));
    localStorage.removeItem(`weatherData-${id}-lastUpdate`)
    localStorage.removeItem(`weatherData-${id}`)

    if (Object.entries(locations) == 0) {
        locations_header__edit_btn.classList.add('invisible')
        setTimeout(() => {
            locations_placeholder.classList.remove('hidden')
        }, 1000);
        setTimeout(() => {
            locations_placeholder.classList.remove('opacity-0')
        }, 1050);
    }
}

function renameLocation(locationId, name = 'original') {
    // add to Oblect "locations"
    if (typeof locations !== 'undefined') {
        loc = Object.values(locations)[locationId]
        if (name == 'original') {
            name = Object.values(locations)[locationId].original_name
            // console.log(name)
        }
        loc.name = name

        localStorage.setItem('locations', JSON.stringify(locations));
        document.querySelector('#card-' + loc.id + ' .card__location-name').innerText = name
        document.querySelector('#slide-' + loc.id + ' .location-slide--header-title').innerText = name
        closeLocationEditModal()
    }
}

function searchOnFocus() {
    console.log(localStorage.userGeoPosition)
    if ((!locations || Object.values(locations).findIndex(item => item.is_user_location == true) == -1) && localStorage.getItem('userGeoPosition') != 'false') {
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
    document.querySelector('#search-user-location--not-found').classList.add('opacity-0', 'hidden')
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

// converting first letter to uppercase
function capitalize(str) {

    const capitalized = str.charAt(0).toUpperCase() + str.slice(1);

    return capitalized;
}

function classToggle(el, ...args) {
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

function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
};

function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            console.log("User denied the request for Geolocation.")
            hideLoadingAnimation()
            localStorage.setItem('userGeoPosition', false)
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

function hideWeatherPreview() {
    hideLoadingAnimation()
    localStorage.removeItem(`weatherData-${locationPreviewData.id}-lastUpdate`);
    localStorage.removeItem(`weatherData-${locationPreviewData.id}`);
    newLocationPreviewEl.classList.add('opacity-0', 'translate-y-[600px]', '-z-10');
    newLocationPreviewEl.classList.remove('z-[130]');
    setTimeout(() => {
        newLocationPreviewEl.classList.add('hidden');
        previewWindow.innerHTML = '';
        locations_backdrop.classList.remove('z-[5]')
    }, 300);
}

function previewWeather(geoLocation, is_user_location = true) {
    console.log('preview geoLocation: ')
    console.log(geoLocation)
    context__country_id = geoLocation.context.findIndex(item => item.id.includes('country'))
    let country = geoLocation.context[context__country_id].text;
    locationPreviewData = {
        id: geoLocation.id.split('.')[1],
        name: geoLocation.text,
        original_name: geoLocation.text,
        name_translit: translit(geoLocation.text),
        latitude: geoLocation.geometry.coordinates[1],
        longitude: geoLocation.geometry.coordinates[0],
        country_code: geoLocation.context[geoLocation.context.findIndex(item => item.id.includes('country'))].short_code,
        country: country,
        is_user_location: is_user_location,
    }
    console.log(locationPreviewData)
    getWeatherDataFromAPI(locationPreviewData.id, locationPreviewData.latitude, locationPreviewData.longitude, true)
}

function generatePreview(loc, weatherData, is_user_location = false) {
    id = loc.id
    setTimeout(() => {
        newLocationPreviewEl.classList.remove('opacity-0', 'translate-y-[600px]')
        newLocationPreviewEl.classList.add('z-[130]')
    }, 50);
    newLocationPreviewEl.classList.remove('hidden', '-z-10');
    addButton = document.querySelector('#add-weather-preview')
    addButton.dataset.location_id = loc.id
    addButton.dataset.user_location = is_user_location
    document.querySelector('#location-name').innerText = loc.name

    generateSlide(loc, true);
    renderCurrentForecast(loc, weatherData, true)
    renderHourlyForecast(loc.id, weatherData)
    renderDailyForecast(loc.id, weatherData, 10)
    document.querySelector('#preview-window').scrollTop = 0;


}

function showLocationsBackdrop() {
    locations_backdrop.classList.remove('opacity-0', '-z-10')
    locations_backdrop.classList.add('z-10')
}

function hideLocationsBackdrop() {
    locations_backdrop.classList.remove('z-10')
    locations_backdrop.classList.add('opacity-0', '-z-10')
}

function openLocationEditModal(el) {
    showLocationsBackdrop()
    locations_backdrop.classList.add('z-[50]')
    modalLocation_flag = true
    loc_id = el.closest('li').dataset.location_id
    loc_index = Object.values(locations).findIndex(item => item.id == loc_id)
    loc_name = Object.values(locations)[loc_index].name
    location_edit_modal.dataset.location = loc_index
    location_edit_modal.classList.remove('invisible', 'opacity-0', '-mt-4')
    location_edit_modal__input.focus()
    setTimeout(() => {
        location_edit_modal__input.value = loc_name
        if (location_edit_modal__input.value.length == 0) {
            location_edit_modal__input.nextElementSibling.classList.add('opacity-0', 'invisible')
            location_edit_modal__ok_btn.classList.add('bg-primary-light/50')
            location_edit_modal__ok_btn.setAttribute('disabled', '');
        } else {
            location_edit_modal__input.nextElementSibling.classList.remove('opacity-0', 'invisible')
            location_edit_modal__ok_btn.classList.remove('bg-primary-light/50')
            location_edit_modal__ok_btn.removeAttribute('disabled');

        }
    }, 50);
}

function closeLocationEditModal() {
    hideLocationsBackdrop()
    locations_backdrop.classList.remove('z-[50]')
    modalLocation_flag = false
    location_edit_modal.classList.add('opacity-0', '-mt-4')
    location_edit_modal__input.nextElementSibling.classList.add('opacity-0', 'invisible')
    setTimeout(() => {
        location_edit_modal.classList.add('invisible')
    }, 300);
}

function editLocationsToggle() {
    const card__wrapper = document.querySelectorAll('.card__wrapper')
    const card__location_name = document.querySelectorAll('.card__location-name')
    const card__current_temp = document.querySelectorAll('.card__current-temp')
    const card__current_condition = document.querySelectorAll('.card__current-condition')
    const card__location_pin = document.querySelector('.card__location-pin')
    const card__weather_info = document.querySelectorAll('.card__weather-info')
    const card__weather_icon = document.querySelectorAll('.card__weather-icon')
    const card__temp_range = document.querySelectorAll('.card__temp-range')
    const card__edit_btn = document.querySelectorAll('.card__edit-btn')
    const edit_buttons_container = document.querySelectorAll('.location-card--edit-buttons-container')
    const weather_info__wrapper = document.querySelectorAll('.card__weather-info ')
    console.log('click')

    setTimeout(() => {
        locations_header__edit_btn.innerText = locations_header__edit_btn.innerText == "Изм." ? "Готово" : "Изм."
    }, 50);
    classToggle(locations_header__back_btn, 'opacity-0')
    classToggle(locations_header__label, 'opacity-0')
    if (locations || Object.entries(locations).length > 0) {
        classToggle(card__location_pin, 'translate-y-2', 'opacity-0')
        card__wrapper.forEach((el) => classToggle(el, 'w-[calc(100%_-_100px)]', 'w-full', 'h-[85px]', 'h-[80px]'))
        card__location_name.forEach((e) => classToggle(e, 'translate-y-2', 'mr-8'))
        card__current_condition.forEach((e) => classToggle(e, 'opacity-0', 'translate-y-3'))
        card__weather_info.forEach((e) => classToggle(e, 'opacity-0', 'w-0', 'w-16'))
        card__weather_icon.forEach((e) => classToggle(e, 'opacity-0', 'w-0', 'w-12'))

        edit_buttons_container.forEach((e) => classToggle(e, 'w-[284px]', 'opacity-0', 'w-full', 'invisible'))

        card__edit_btn.forEach((e) => {
            classToggle(e, 'invisible')
            setTimeout(() => {
                classToggle(e, 'opacity-0')
            }, 50);
        })


        setTimeout(() => {
            editLocation_flag = editLocation_flag == true ? false : true
        }, 20)
        card__wrapper.forEach((e) => {
            e.classList.remove('-translate-x-24')
        })
    }
}

clearText.forEach((el) => {
    el.onclick = () => {
        input = el.previousElementSibling
        el.classList.add('opacity-0', 'invisible')
        input.value = ''
        input.focus()
        if (input.id == 'location-modal-input') {
            location_edit_modal__ok_btn.classList.add('bg-primary-light/50', 'dark:bg-yellow/50')
            location_edit_modal__ok_btn.setAttribute('disabled', '');

        } else {
            suggestionList.innerHTML = ''

        }
    }
})
reset_settings.onclick = resetSettings;
cancelSearchButton.onclick = searchCancel;
searchInput.onfocus = searchOnFocus;
searchInput.onkeyup = getGeoData;
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

locations_backdrop.onclick = () => {
    if (document.querySelector('#loading-animation').classList.contains('opacity-0')) {
        closeLocationEditModal()
        hideLocationsBackdrop()
        searchCancel()
    }
}

getLocationButton.onclick = getUserLocation;
locations_header__edit_btn.onclick = editLocationsToggle
location_edit_modal__cancel_btn.onclick = closeLocationEditModal
location_edit_modal__ok_btn.onclick = () => {
    if (location_edit_modal__input.value.length !== 0) {
        renameLocation(location_edit_modal.dataset.location, location_edit_modal__input.value)
        closeLocationEditModal()
    }
}
location_edit_modal__input.addEventListener('input', (event) => {
    // const regex = /[a-zA-ZАА-Яа-яёЁ.,\d\-_\s]([ ]{2,})[a-zA-ZАА-Яа-яёЁ.,\d\-_\s]/i;
    // const str = event.target.value;

    if (event.target.value.length == 0) {
        event.target.nextElementSibling.classList.add('opacity-0', 'invisible')
        location_edit_modal__ok_btn.classList.add('bg-primary-light/50')
        location_edit_modal__ok_btn.setAttribute('disabled', '');
        event.target.classList.add('pointer-events-none')
    } else {
        event.target.nextElementSibling.classList.remove('opacity-0', 'invisible')
        location_edit_modal__ok_btn.classList.remove('bg-primary-light/50')
        location_edit_modal__ok_btn.removeAttribute('disabled', '');
        event.target.classList.remove('pointer-events-none')
    }
    // if ((regex.exec(str)) !== null) {
    //     event.target.nextElementSibling.classList.remove('opacity-0', 'invisible')
    //     location_edit_modal__ok_btn.classList.remove('bg-primary-light/50')
    //     location_edit_modal__ok_btn.removeAttribute('disabled', '');
    //     location_edit_modal__ok_btn.classList.remove('pointer-events-none')
    // } else {
    //     event.target.nextElementSibling.classList.add('opacity-0', 'invisible')
    //     location_edit_modal__ok_btn.classList.add('bg-primary-light/50')
    //     location_edit_modal__ok_btn.setAttribute('disabled', '');
    //     location_edit_modal__ok_btn.classList.add('pointer-events-none')
    //     console.log('Недопустимые символы')
    // }
})

mainPage_tapbar__locations_btn.onclick = () => HSOverlay.toggle(menu_locations)
mainPage_tapbar__settings_btn.onclick = () => HSOverlay.toggle(menu_settings)
mainPage_tapbar__weather_btn.onclick = () => openOverlay ? HSOverlay.close(openOverlay) : {};
mainPage_search_btn.onclick = () => {
    searchOnFocus();
    setTimeout(() => {
        searchInput.focus()
    }, 500);
}

HSOverlay.on('open', (el) => {
    openOverlay = el;
    document.querySelector('#menu-middle-btn').classList.add('-translate-y-[26px]')
    document.querySelector('#menu-middle-btn').classList.remove('translate-y-8')
    mainPage_tapbar__weather_btn.firstElementChild.classList.remove('stroke-primary-light', 'dark:stroke-yellow')
    mainPage_tapbar__weather_btn.firstElementChild.classList.add('stroke-gray-300', 'dark:stroke-cosmic-400')
    mainPage_tapbar__weather_btn.lastElementChild.classList.remove('text-primary-light', 'dark:text-yellow')
    mainPage_tapbar__weather_btn.lastElementChild.classList.add('text-gray-300', 'dark:text-cosmic-400')

    if (el.id == "menu-locations") {
        mainPage_tapbar__locations_btn.classList.add('!text-primary-light', 'dark:!text-yellow')
        document.querySelector('#locations-btn-svg').classList.add('!stroke-primary-light', 'dark:!stroke-yellow')
        if (!locations || Object.entries(locations).length == 0) {
            locations_placeholder.classList.add('hidden')
            setTimeout(() => {
                if (!searchInput.focus()) {
                } else {
                    searchInput.focus()
                    locations_placeholder.classList.remove('hidden')
                    locations_placeholder.classList.remove('opacity-0')
                }
            }, 300);
        } else {
            locations_placeholder.classList.add('hidden', 'opacity-0')
        }
    } else if (el.id == "menu-settings") {
        document.querySelector('#mainpage--tapbar--settings-btn').classList.add('!text-primary-light', 'dark:!text-yellow')
        document.querySelector('#settings_btn_svg').classList.add('!stroke-primary-light', 'dark:!stroke-yellow')
    }
})

HSOverlay.on('close', (el) => {
    setTimeout(() => {
        mainPage_tapbar__weather_btn.firstElementChild.classList.remove('stroke-gray-300', 'dark:stroke-cosmic-400')
        mainPage_tapbar__weather_btn.firstElementChild.classList.add('stroke-primary-light', 'dark:stroke-yellow')
        mainPage_tapbar__weather_btn.lastElementChild.classList.add('text-primary-light', 'dark:text-yellow')
        mainPage_tapbar__weather_btn.lastElementChild.classList.remove('text-gray-300', 'dark:text-cosmic-400')
        if (!openOverlay && locations && Object.entries(locations).length > 1) {
            document.querySelector('#menu-middle-btn').classList.add('translate-y-8')
            document.querySelector('#menu-middle-btn').classList.remove('-translate-y-[26px]')
        }
    }, 50);
    if (el.id == "menu-locations") {
        if (editLocation_flag && (locations || Object.entries(locations).length > 0)) {
            editLocationsToggle()
        }
        if (!locations || Object.entries(locations).length == 0) {
            mainPage_placeholder.classList.remove('hidden', 'opacity-0')
            // locations_placeholder.classList.remove('hidden', 'opacity-0')
        } else {
            // mainPage_placeholder.classList.add('hidden', 'opacity-0')
            // locations_placeholder.classList.add('hidden', 'opacity-0')
        }
        searchCancel()
        mainPage_tapbar__locations_btn.classList.remove('!text-primary-light', 'dark:!text-yellow')
        document.querySelector('#locations-btn-svg').classList.remove('!stroke-primary-light', 'dark:!stroke-yellow')
    } else if (el.id == "menu-settings") {
        // console.log('settings')
        document.querySelector('#mainpage--tapbar--settings-btn').classList.remove('!text-primary-light', 'dark:!text-yellow')
        document.querySelector('#settings_btn_svg').classList.remove('!stroke-primary-light', 'dark:!stroke-yellow')
        s_flag == true ? location.reload() : '';
    }
    openOverlay = false;
})

// document.addEventListener('click', (event) => {
//     if (editLocation_flag && !modalLocation_flag) {
//         if (!location_cards__container.contains(event.target)) {
//             editLocationsToggle()
//         }
//         if (locations_backdrop.contains(event.target)) {
//             editLocationsToggle()
//         }
//     }
// })

function init() {
    locations = JSON.parse(localStorage.getItem('locations')) || {};
    // console.table(locations)

    // set checkbox states in settings tab
    loadSettings();

    if ((typeof locations === 'undefined' || locations === null) || Object.entries(locations).length == 0) {
        locations_header__edit_btn.classList.add('invisible')
        mainPage_placeholder.classList.remove('opacity-0')
    } else {
        window.onfocus = () => updateInfo();
        if (!localStorage.lastPageUpdate) {
            localStorage.setItem('lastPageUpdate', new Date())
        } else {
            console.log(localStorage.lastPageUpdate)
        }
        // Loading WeatherData
        Object.values(locations).forEach((el) => {
            getWeatherDataFromAPI(el.id, el.latitude, el.longitude)
        })

        location_restore_name.onclick = () => renameLocation(location_edit_modal.dataset.location)

        if (localStorage.getItem('locations') !== null) {
            for (const loc of Object.values(locations)) {
                generateLocationCard(loc);
            }
            for (const loc of Object.values(locations)) {
                weatherData = JSON.parse(localStorage.getItem(`weatherData-${loc.id}`))
                generateSlide(loc);
                renderCurrentForecast(loc, weatherData);
            }
        }
        if (!openOverlay && locations && Object.entries(locations).length > 1) {
            document.querySelector('#menu-middle-btn').classList.add('translate-y-8')
            document.querySelector('#menu-middle-btn').classList.remove('-translate-y-[26px]')
        }
        // Initialize Cards List
        setupSlip(location_cards__container);

        setTimeout(() => {
            mainPage_tapbar__weather_btn.classList.remove('invisible', 'opacity-0')
        }, 300);

        const cards = document.querySelectorAll('li')
        const del_btns = document.querySelectorAll('.location-del')
        const trash_btns = document.querySelectorAll('.trash')

        cards.forEach((el) => {
            el.addEventListener('click', () => {
                // console.log(card__wrapper)
                // console.log(el.id)
                // console.log(editLocation_flag)
                if (!editLocation_flag) {
                    const loc_id = Object.values(locations).findIndex(item => item.id == el.dataset.location_id)
                    slideToId(loc_id);
                }
            })
        })

        del_btns.forEach((el) => {
            el.addEventListener('click', () => {
                const card = el.closest('li')
                cards.forEach(() => {
                    el.classList.remove('-translate-x-24')
                })
                setTimeout(() => {
                    card.querySelector('.trash').classList.remove('opacity-0')
                    card.classList.remove('duration-[0ms]')
                    card.classList.add('duration-[700ms]')
                    card.classList.add('-translate-x-24')
                    delLocation_flag = true
                }, 50)
            })
        })

        trash_btns.forEach((el) => {
            el.onclick = () => {
                console.log('trash clicked')
                // console.log(el)
                loc_id = el.closest('li').dataset.location_id
                // console.log(loc_id)
                deleteLocation(Object.keys(locations).find(key => locations[key].id == loc_id), loc_id)
                if (Object.entries(locations).length == 0) {
                    editLocationsToggle()
                }
            }
            document.onclick = (event) => {
                if (!el.contains(event.target) && delLocation_flag) {
                    console.log('out of trash clicked')
                    trash_btns.forEach((e) => {
                        e.classList.add('opacity-0')
                    })
                    cards.forEach((e) => {
                        e.classList.remove('-translate-x-24');
                        setTimeout(() => {
                            e.classList.remove('duration-[700ms]')
                            e.classList.add('duration-[0ms]')
                        }, 50);
                    })
                    delLocation_flag = false
                }
            }
        })


        if (slide) {
            console.log('Slide to', slide)
            slide_id = Object.values(locations).findIndex(item => item.id == slide)
            // console.log('slide_id: ', slide_id)
            setTimeout(() => {
                slideToId(slide_id, 0)
            }, 50);
        }

    }
}

document.addEventListener('DOMContentLoaded', init())
