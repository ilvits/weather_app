let s_flag = false
let editLocation_flag = false
let delLocation_flag = false
let modalLocation_flag = false
locationModalInput = document.querySelector('#location-modal-input')
clearText = document.querySelectorAll('.clear-text-cross')

let locations = JSON.parse(decodeURIComponent(getCookie('locations')));
const user_date = new Date();
const currentWeekdayLong = join(new Date, [{ weekday: 'long' }], '-');
const slides = document.querySelector('#slides');
const menuLocations = document.querySelector('#menu-locations');
const locations_placeholder = document.querySelector('#locations-placeholder');
const containerLocations = document.querySelector('ol#locations-list');
const containerDefaults = document.querySelector('#left-menu-container').innerHTML;
const locationsEdit = document.querySelector('#locations-edit');
let miniCards
let minmax
let cardLocationName
let weatherIcon
let editButtons
let s_temp = ''
let s_wind = ''
let s_pressure = ''
let s_lang = ''
let dir = ''
let openOverlay = false
let weatherArray = []
let slide = window.location.hash.split('#').pop();
if (locations && Object.entries(locations).length > 0) {
    if (slide) {
        // console.log('Slide to', slide)
        setTimeout(() => {
            slideToId(Object.values(locations).findIndex(item => item.id == slide))

        }, 300);
    }
} else {
    HSOverlay.open(menuLocations)
    locations_placeholder.classList.remove('hidden', 'opacity-0')
}


// function Notification({ imageUrl, imageAlt, title, message }) {
//     return (
//         <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4">
//             <div className="shrink-0">
//                 <img className="h-12 w-12" src={imageUrl.src} alt={imageAlt} />
//             </div>
//             <div>
//                 <div className="text-xl font-medium text-black">{title}</div>
//                 <p className="text-slate-500">{message}</p>
//             </div>
//         </div>
//     )
// }


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

function slideToId(index) {
    if (openOverlay) {
        HSOverlay.close(openOverlay);
    }
    swiper.slideTo(index, 300);
}

function join(t, a, s) {
    function format(m) {
        let f = new Intl.DateTimeFormat('ru', m);
        return f.format(t);
    }
    return a.map(format).join(s);
}

function addNewLocation() {
    // add to object

    if (locations && Object.entries(locations).length > 0) {
        const locations_key_array = Object.keys(locations)
        index = locationDataSet.current ? 0 : Number(locations_key_array[locations_key_array.length - 1]) + 1;
    } else {
        index = 1
    }

    value = {
        id: String(locationDataSet.id),
        name: locationDataSet.name,
        original_name: locationDataSet.name,
        name_translit: locationDataSet.name_translit,
        latitude: locationDataSet.latitude,
        longitude: locationDataSet.longitude,
        region: locationDataSet.region,
        country: locationDataSet.country,
        country_code: locationDataSet.country_code,
        current: locationDataSet.current
    }
    console.log(index)
    locations = addToObject(locations, String(index), value)
    console.log(locations)

    // add to cookies
    setCookie('locations', JSON.stringify(locations), 30);
    searchInput.placeholder = 'Найти новое место'
    searchInput.value = ''
    window.location.href = '#' + id
    document.location.reload();
}

function deleteLocation(locationId, locationN) {
    console.log(locationId, locationN, Object.values(locations).findIndex(item => item.id == locationN))
    swiper.removeSlide(Object.values(locations).findIndex(item => item.id == locationN))
    delete (locations[locationId]);
    setCookie('locations', JSON.stringify(locations), 30);
    if (Object.entries(locations) == 0) {
        locationsEdit.classList.add('hidden')
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
    l = Object.values(locations)[locationId]
    if (name == 'original') {
        name = Object.values(locations)[locationId].original_name
        // console.log(name)
    }
    l.name = name
    // add to cookies
    setCookie('locations', JSON.stringify(locations), 30);

    document.querySelector('#card-' + l.id + ' .cardLocationName').innerText = name
    document.querySelector('#header-' + l.id + ' label').innerText = name
    closeLocationEditModal()
}

// function swapElementsInObject(obj, fromId, toId) {
//     fromId = fromId.dataset.name
//     if (toId) {
//         toId = toId.dataset.name
//     }
//     var fromKey = Object.keys(locations).find(key => locations[key].id == fromId);
//     var fromValue = Object.values(locations).find(item => item.id == fromId)
//     var toKey = Object.keys(locations).find(key => locations[key].id == toId)
//     var toValue = Object.values(locations).find(item => item.id == toId)
//     console.log(`

//         from key: ${fromKey}
//         from value: ${fromValue.id}, ${fromValue.name}

//         to key: ${toKey}
//         to value: ${toValue.id}, ${toValue.name}
//     `)

//     locations_tmp = addToObject(obj, toKey, fromValue)
//     locations = addToObject(locations_tmp, fromKey, toValue)

//     // add to cookies
//     // setCookie('locations', JSON.stringify(locations), 30);

//     Object.getOwnPropertyNames(locations).forEach((val, idx, array) => {
//         // console.log(`index:${idx}`)
//         console.log(`'${val}' -> ${locations[val].name}`)
//     })
//     // window.location.href = ''
//     // window.reload()
// }

function showLocationsBackdrop() {
    locations_backdrop.classList.remove('opacity-0', '-z-10')
    // locations_backdrop.classList.add('z-10')
}

function hideLocationsBackdrop() {
    locations_backdrop.classList.add('opacity-0', '-z-10')
    // locations_backdrop.classList.remove('z-10')
}

function openLocationEditModal(el) {
    showLocationsBackdrop()
    locations_backdrop.classList.add('z-10')
    modalLocation_flag = true
    l_id = el.closest('.location-card').dataset.name
    l_index = Object.values(locations).findIndex(item => item.id == l_id)
    l_name = Object.values(locations)[l_index].name
    location_modal.dataset.location = l_index
    location_modal.classList.remove('invisible', 'opacity-0', '-mt-4')
    locationModalInput.focus()
    setTimeout(() => {
        locationModalInput.value = l_name
        if (locationModalInput.value.length == 0) {
            locationModalInput.nextElementSibling.classList.add('opacity-0', 'invisible')
            document.querySelector('#' + location_modal.id + ' .ok-button').classList.add('bg-[#3377FF]/50')
            document.querySelector('#' + location_modal.id + ' .ok-button').setAttribute('disabled', '');
        } else {
            locationModalInput.nextElementSibling.classList.remove('opacity-0', 'invisible')
            document.querySelector('#' + location_modal.id + ' .ok-button').classList.remove('bg-[#3377FF]/50')
            document.querySelector('#' + location_modal.id + ' .ok-button').removeAttribute('disabled');

        }
    }, 50);
}

function closeLocationEditModal() {
    hideLocationsBackdrop()
    locations_backdrop.classList.remove('z-10')
    modalLocation_flag = false
    location_modal.classList.add('opacity-0', '-mt-4')
    locationModalInput.nextElementSibling.classList.add('opacity-0', 'invisible')
    setTimeout(() => {
        location_modal.classList.add('invisible')
    }, 300);
}

clearText.forEach((el) => {
    el.addEventListener('click', () => {
        console.log(el.previousElementSibling)
        input = el.previousElementSibling
        el.classList.add('opacity-0', 'invisible')
        input.value = ''
        input.focus()
        if (input.id == 'location-modal-input') {
            document.querySelector('#' + location_modal.id + ' .ok-button').classList.add('bg-[#3377FF]/50', 'dark:bg-yellow/50')
            document.querySelector('#' + location_modal.id + ' .ok-button').setAttribute('disabled', '');

        } else {
            suggestionList.innerHTML = ''

        }
    })
})

getLocationButton = document.querySelector('#get-current-location');
getLocationButton.addEventListener('click', getCurrentLocation);

document.addEventListener("DOMContentLoaded", () => {
    loadSettings();
    generateSlides(locations);
    generateFavourites(locations);
    locationCards = document.querySelectorAll('.location-card')
    miniCards = document.querySelectorAll('.minicard')
    temp = document.querySelectorAll('.temp')
    condition = document.querySelectorAll('.condition')
    minmax = document.querySelectorAll('.minmax')
    cardLocationName = document.querySelectorAll('.cardLocationName')
    weatherIcon = document.querySelectorAll('.weather-icon')
    current_location_pin = document.querySelectorAll('.current-location-pin')
    editButtons = document.querySelectorAll('.edit-buttons')
    edit_location_btns = document.querySelectorAll('.edit-icon')
    del_btns = document.querySelectorAll('.location-del')
    trash_btns = document.querySelectorAll('.trash')
    location_modal = document.querySelector('#edit-location')
    locations_backdrop = document.querySelector('#locations-backdrop')

    // Settings
    getCookie('s-temp') == 'true' ? s_temp = 'F' : s_temp = 'C'
    getCookie('s-wind') == 'true' ? s_wind = 'м/с' : s_wind = 'км/ч'
    getCookie('s-pressure') == 'true' ? s_pressure = 'гПа' : s_pressure = 'мм'
    getCookie('s-lang') == 'true' ? s_lang = 'РУС' : s_lang = 'ENG'

    locationsEdit.addEventListener('click', () => {
        editLocationsToggle()
    })

    document.querySelector('#' + location_modal.id + ' .restore-orig-name').addEventListener('click', () => {
        renameLocation(location_modal.dataset.location)
    })

    locationModalInput.addEventListener('input', (event) => {
        // const regex = /[a-zA-ZАА-Яа-яёЁ.,\d\-_\s]([ ]{2,})[a-zA-ZАА-Яа-яёЁ.,\d\-_\s]/i;
        // const str = event.target.value;

        if (event.target.value.length == 0) {
            event.target.nextElementSibling.classList.add('opacity-0', 'invisible')
            document.querySelector('#' + location_modal.id + ' .ok-button').classList.add('bg-[#3377FF]/50')
            document.querySelector('#' + location_modal.id + ' .ok-button').setAttribute('disabled', '');
            event.target.classList.add('pointer-events-none')
        } else {
            event.target.nextElementSibling.classList.remove('opacity-0', 'invisible')
            document.querySelector('#' + location_modal.id + ' .ok-button').classList.remove('bg-[#3377FF]/50')
            document.querySelector('#' + location_modal.id + ' .ok-button').removeAttribute('disabled', '');
            event.target.classList.remove('pointer-events-none')
        }
        // if ((regex.exec(str)) !== null) {
        //     event.target.nextElementSibling.classList.remove('opacity-0', 'invisible')
        //     document.querySelector('#' + location_modal.id + ' .ok-button').classList.remove('bg-[#3377FF]/50')
        //     document.querySelector('#' + location_modal.id + ' .ok-button').removeAttribute('disabled', '');
        //     document.querySelector('#' + location_modal.id + ' .ok-button').classList.remove('pointer-events-none')
        // } else {
        //     event.target.nextElementSibling.classList.add('opacity-0', 'invisible')
        //     document.querySelector('#' + location_modal.id + ' .ok-button').classList.add('bg-[#3377FF]/50')
        //     document.querySelector('#' + location_modal.id + ' .ok-button').setAttribute('disabled', '');
        //     document.querySelector('#' + location_modal.id + ' .ok-button').classList.add('pointer-events-none')
        //     console.log('Недопустимые символы')
        // }
    })

    document.querySelector('#' + location_modal.id + ' .ok-button').addEventListener('click', () => {
        // console.log('click OK')
        if (locationModalInput.value.length == 0) {
        } else {
            renameLocation(location_modal.dataset.location, locationModalInput.value)
            closeLocationEditModal()
        }
    })

    document.querySelector('#' + location_modal.id + ' .cancel-button').addEventListener('click', () => {
        // console.log('click Cancel')
        closeLocationEditModal()
    })

    window.addEventListener('open.hs.overlay', (El) => {
        openOverlay = El.target;
    })

    document.querySelector('#weather-btn').addEventListener('click', () => {
        if (openOverlay) {
            HSOverlay.close(openOverlay)
        }
    })

    locations_backdrop.addEventListener('click', () => {
        closeLocationEditModal()
        hideLocationsBackdrop()
        searchCancel()
    })

    del_btns.forEach((e) => {
        e.addEventListener('click', () => {
            card = e.closest('.location-card')
            locationCards.forEach((e) => {
                e.classList.remove('-translate-x-24')
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

    trash_btns.forEach((e) => {
        document.addEventListener('click', (event) => {
            if (!e.contains(event.target) && delLocation_flag) {
                trash_btns.forEach((e) => {
                    e.classList.add('opacity-0')
                })
                locationCards.forEach((e) => {
                    e.classList.remove('-translate-x-24');
                    setTimeout(() => {
                        e.classList.remove('duration-[700ms]')
                        e.classList.add('duration-[0ms]')
                    }, 50);
                })
                delLocation_flag = false
            }
        });
        e.addEventListener('click', () => {
            console.log('trash clicked')
            lname = e.closest('.location-card').dataset.name
            deleteLocation(Object.keys(locations).find(key => locations[key].id == lname), lname)
        })
    })

    locationCards.forEach((el) => {
        el.addEventListener('click', () => {
            if (!editLocation_flag) {
                slideToId(Object.values(locations).findIndex(item => item.id == el.dataset.name))
            }
        })
    })

    function loadSettings() {
        var checkboxes = document.querySelectorAll('input[name=settings]')
        checkboxes.forEach(function (checkbox) {
            getCookie(checkbox.id)
        })
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
            if ((e.target.dataset.current == "true")
                || (e.detail.insertBefore && e.detail.insertBefore.dataset.current == "true")) {
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
                    // console.log(el.current)
                    if (itemsArray[0].current === true) {
                        reordered_locations[String(itemsArray.indexOf(el))] = el
                    } else {
                        reordered_locations[String(itemsArray.indexOf(el) + 1)] = el
                    }
                })
                locations = reordered_locations
                // And update the DOM:
                e.target.parentNode.insertBefore(e.target, e.detail.insertBefore);
                swiper.removeAllSlides()
                generateSlides(locations)


                // add to cookies
                setCookie('locations', JSON.stringify(locations), 30);
            }
        })
        //     console.log(e.target.parentNode)
        //     e.target.parentNode.insertBefore(e.target, e.detail.insertBefore);
        //     swapElementsInObject(locations, e.target, e.detail.insertBefore)
        //     return false;
        // }, false);
        return new Slip(list);
    }

    HSOverlay.on('open', (e) => {
        classToggle(document.querySelector('#menu-middle-btn'), 'translate-y-8', '-translate-y-[26px]')
        if (e.id == "menu-locations") {
            document.querySelector('#fav_btn').classList.add('!text-[#3377FF]', 'dark:!text-yellow')
            document.querySelector('#fav_btn_svg').classList.add('!stroke-[#3377FF]', 'dark:!stroke-yellow')
        } else if (e.id == "menu-settings") {
            document.querySelector('#settings_btn').classList.add('!text-[#3377FF]', 'dark:!text-yellow')
            document.querySelector('#settings_btn_svg').classList.add('!stroke-[#3377FF]', 'dark:!stroke-yellow')
        }
    })

    HSOverlay.on('close', (e) => {
        classToggle(document.querySelector('#menu-middle-btn'), 'translate-y-8', '-translate-y-[26px]')
        if (e.id == "menu-locations") {
            if (editLocation_flag) {
                editLocationsToggle()
            }
            searchCancel()
            document.querySelector('#fav_btn').classList.remove('!text-[#3377FF]', 'dark:!text-yellow')
            document.querySelector('#fav_btn_svg').classList.remove('!stroke-[#3377FF]', 'dark:!stroke-yellow')
        } else if (e.id == "menu-settings") {
            // console.log('settings')
            document.querySelector('#settings_btn').classList.remove('!text-[#3377FF]', 'dark:!text-yellow')
            document.querySelector('#settings_btn_svg').classList.remove('!stroke-[#3377FF]', 'dark:!stroke-yellow')
            s_flag == true ? location.reload() : '';
        }
    })

    if ((locations == null) || Object.entries(locations).length == 0) {
        locationsEdit.classList.add('invisible')
    }

    // document.addEventListener('click', (event) => {
    //     if (editLocation_flag && !modalLocation_flag) {
    //         if (!containerLocations.contains(event.target)) {
    //             editLocationsToggle()
    //         }
    //         if (locations_backdrop.contains(event.target)) {
    //             editLocationsToggle()
    //         }
    //     }
    // })

    function editLocationsToggle() {
        setTimeout(() => {
            locationsEdit.innerText = locationsEdit.innerText == "Изм." ? "Готово" : "Изм."
        }, 50);
        setTimeout(() => {
            editLocation_flag = editLocation_flag == true ? false : true
            // console.log(editLocation_flag)
        }, 20)
        locationCards.forEach((e) => {
            e.classList.remove('-translate-x-24')
        })
        miniCards.forEach((el) => {
            classToggle(el, 'w-[calc(100%_-_100px)]', 'w-full', 'h-[85px]', 'h-[80px]')
            el.children[0].classList.toggle('translate-y-2')
        })
        editButtons.forEach((e) => {
            classToggle(e, 'w-[284px]', 'w-full', 'opacity-0', 'invisible', 'z-20')
        })
        cardLocationName.forEach((e) => {
            if (e.innerText.length > 18) {
                e.classList.toggle('text-base')
            }
        })
        current_location_pin.forEach((e) => {
            classToggle(e, 'scale-0', 'opacity-0', 'translate-x-12')
        })

        weatherIcon.forEach((e) => {
            classToggle(e, 'scale-0', 'opacity-0')
        })
        condition.forEach((e) => {
            classToggle(e, 'opacity-0', '-translate-y-3', '-translate-x-2')
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

    setupSlip(containerLocations);

    function generateFavourites(locations) {
        if (locations) {
            for (let l of Object.values(locations)) {
                // locationName.innerText = Object.values(locations)[0].name
                containerLocations.insertAdjacentHTML('beforeend', `
                <li id="card-${l.id}" data-name="${l.id}" data-current="${l.current}" class="location-card no-swipe w-full mb-3 h-[85px] flex justify-center 
                hs-removing:-translate-x-[500px] hs-removing:h-0 hs-removing:mb-0 ease-[cubic-bezier(.23,1,.32,1)] transition-[height,transform] transform-gpu duration-[0ms]">
                    <!-- CONTENT-->
                        <div class="minicard pointer-events-none absolute w-full bg-white dark:bg-bg dark:bg-gradient-to-b dark:from-[#192D52] dark:to-[#112645] z-20
                            p-4 transition-all-500 rounded-2xl h-[85px]">
                            <div class="name-of-location absolute left-4 flex-col transition-all-500">
                                <div class="time text-[10px] dark:text-[#B6CBF4] leading-3"> --:-- </div>
                                <div class=" cardLocationName text-${(l.name.length > 15) ? 'sm' : 'base'} flex leading-5 transition duration-300 transform-gpu">
                                    <div>${l.name}</div>
                                </div>
                                <div class="condition  pt-2 text-xs leading-[14px] transition-all-500"></div>
                            </div>
                            ${l.current ? '<img class="current-location-pin w-5 absolute right-36 mt-3 transition-all-500" src="img/assets/icons/map-pin.svg">' : ''}
                            <div class=" absolute right-4 flex flex-row gap-2 transition-all-500">
                                <div class="grid grid-flow-row items-center transition-all-500">
                                    <div class=" temp text-[32px] leading-9 font-medium  transition-all-300"></div>
                                    <div class="mx-auto minmax items-center flex text-[10px] transition-transform duration-150 transform-gpu">
                                        <svg class="stroke-[#90929E] dark:stroke-[#D7F4FE]" width="10" height="11" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M3.33334 3.41667L5.00001 1.75M5.00001 1.75L6.66668 3.41667M5.00001 1.75V9.25" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                        <div class="tempmax"></div>
                                        <svg class="stroke-[#90929E] dark:stroke-[#D7F4FE] ml-1" width="10" height="11" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M6.66668 7.58333L5.00001 9.25M5.00001 9.25L3.33334 7.58333M5.00001 9.25L5.00001 1.75" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                        <div class="tempmin"></div>
                                    </div>
                                </div>
                                    <div class=" weather-icon w-12 h-12 transition-all-500"></div>
                            </div>
                        </div>
                        <!-- BUTTONS-->
                        <div class="edit-buttons invisible no-swipe no-reorder h-[80px] w-[284px] opacity-0 justify-between grid grid-flow-col transition-all-500">
                            <div class="edit-icon absolute right-14 opacity-0 z-20  no-swipe no-reorder invisible top-4 
                            transition-opacity-500" data-location_name="${l.id}">
                                <svg class="fill-[#1B2541] dark:fill-white  no-swipe no-reorder" width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path class="no-swipe no-reorder" d="M27.5858 17.5858C28.3668 16.8047 29.6332 16.8047 30.4142 17.5858C31.1953 18.3668 31.1953 19.6332 30.4142 20.4142L29.6213 21.2071L26.7929 18.3787L27.5858 17.5858Z"/>
                                    <path class="no-swipe no-reorder" d="M25.3787 19.7929L17 28.1716V31H19.8284L28.2071 22.6213L25.3787 19.7929Z"/>
                                </svg>
                            </div>
                            <button type="button" data-hs-remove-element="#card-${l.id}" class="trash opacity-0 absolute z-50 -right-24 transition-opacity-300 ease-linear ">
                                <img class="" src="img/assets/icons/trash.svg">
                            </button>
                            <button type="button" class="location-del no-swipe no-reorder">
                            <img src="img/delete.svg" width="40px" height="40px" alt="">
                            </button>
                            <button type="button" class="${l.current ? 'no-swipe no-reorder dark:text-white/20' : 'location-drag instant dark:text-white'} items-center font-light text-3xl w-10">☰</button>
                        </div>
                    </li>
                    `)
            }
        }
    }

    function generateSlides(locations, preview = false) {
        // containerLocations.innerHTML = containerDefaults;
        if (locations) {
            Object.values(locations).forEach((l) => {
                swiper.appendSlide(`<div id="slide-${l.id}" data-hash="${l.id}" class="swiper-slide bg-[#F3F4F7] dark:bg-bg ">
                <div id="header-${l.id}" class="sticky_header sticky bg-[#F3F4F7]/60 dark:bg-bg/80
                backdrop-blur-xl top-0 w-full px-6 py-4 flex justify-between z-50 transition-opacity-500">
                    <label class="truncate overflow-ellipsis w-4/5 font-semibold text-xl leading-5">${l.name}</label>
                    <span class="header-temp absolute flex gap-2 text-[#90929E] opacity-0 right-6 transition-opacity-300 font-bold">
                    </span>
                    <button id="detail-weather-toggle--${l.id}" 
                    class="detail-weather-toggle flex items-end gap-1 text-[#90929E] text-sm font-light hs-collapse-toggle transition-opacity-300" data-hs-collapse="#detail-weather-info-${l.id}">
                    <div>
                    Подробнее 
                    </div>
                    <img id="detail-weather-toggle-img--${l.id}" src="img/assets/icons/down.svg">
                    </button>
                </div>
                
                <section id="general-weather-info--${l.id}" data-hash="${l.id}" class="px-4 max-w-md mx-auto swiper-slide dark:bg-bg swiper-slide-active">
                    <div class="w-full p-5 rounded-2xl bg-white dark:bg-gradient-to-br dark:from-[#192D52] dark:to-[#112645]">
                        <div class="flex flex-row justify-between">
                            <div class="flex flex-col gap-2">
                                <div id="current-day-${l.id}" class="text-[#90929E] dark:text-[#ACD8E7] text-xs font-light capitalize"></div>
                                <div id="temperature-${l.id}" class="text-[64px] leading-[68px] align-text-top">--</div>
                                <div class="text-sm leading-4 flex flex-col gap-1">
                                <div id="conditions-${l.id}">--</div>
                                <div id="feelslike-${l.id}">--</div>
                                </div>
                            </div>
                            <div id="weather-icon-${l.id}">
                            </div>
                        </div>
                        <div id="detail-weather-info-${l.id}"
                            class="hs-collapse will-change-transform hidden w-full grid grid-flow-row gap-5 overflow-hidden transition-all-500">
                            <div id="details-1" class="relative h-[100px] w-full grid grid-flow-col justify-around items-end">
                                <div class="absolute detail-item opacity-0 -translate-y-5 -translate-x-1 transition-300 w-full h-full flex justify-center">
                                    <div class="absolute w-[150px] h-[75px] bottom-0">
                                        <div class="w-full h-full border border-b-0 border-dashed rounded-t-full border-[#6390F0]/60 dark:border-cyan/60">
                                        </div>
                                        <div
                                            class="sun absolute top-0 w-full h-full origin-bottom -rotate-[120deg]
                                        border border-b-0 border-solid rounded-t-full border-[#ACD8E7] dark:border-cyan bg-gradient-to-b from-[#EDF8FF] dark:from-[#0F3C5C] to-transparent">
                                        </div>
                                        <div class="w-[150px] h-[75px] bg-white dark:bg-[#132846] absolute"></div>
                                        <div class="w-2 h-2 rounded-full bg-[#ACD8E7] dark:bg-cyan -bottom-[4px] -left-[4px] absolute"></div>
                                        <div class="w-2 h-2 rounded-full bg-[#ACD8E7] dark:bg-cyan -bottom-[4px] -right-[4px] absolute">
                                        </div>
                                        <div class="sky left-1/2 w-1/2 origin-left absolute -rotate-[120deg]">
                                            <div
                                                class="w-2 h-2 rounded-full shadow-white shadow-2xl bg-[#6390F0] dark:bg-white outline-2 outline outline-white dark:outline-bg outline-offset-0 -bottom-[4px] -right-[4px] absolute">
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="detail-item text-center opacity-0 -translate-y-5 -translate-x-1 transition-300 w-full grid grid-flow-row gap-[6px]">
                                    <div class="text-xs text-[#90929E] dark:text-[#ACD8E7]">Восход</div>
                                    <div id="sunrise-${l.id}" class="font-semibold ">--</div>
                                </div>
                                <div class="w-full text-center detail-item opacity-0 -translate-y-5 -translate-x-1 transition-300 grid grid-flow-row gap-[6px] justify-center  z-10">
                                    <div class="text-xs text-[#90929E] dark:text-[#ACD8E7]">Световой день</div>
                                    <div id="daylight-${l.id}" class="font-semibold">--</div>
                                </div>
                                <div class="w-full text-center detail-item opacity-0 -translate-y-5 -translate-x-1 transition-300 grid grid-flow-row gap-[6px]">
                                    <div class="text-xs text-[#90929E] dark:text-[#ACD8E7]">Закат</div>
                                    <div id="sunset-${l.id}" class="font-semibold ">--</div>
                                </div>
                            </div>
                            <div id="details-2" class="relative h-[100px] grid grid-cols-3 gap-1">
                                <div class="detail-item opacity-0 -translate-y-5 -translate-x-1 transition-300 grid grid-flow-row text-center">
                                    <div class="">
                                        <div class="text-xs text-[#90929E] dark:text-[#ACD8E7]">t° максимум</div>
                                        <div id="tempmax-${l.id}">--</div>
                                    </div>
                                    <div class="">
                                        <div class="text-xs text-[#90929E] dark:text-[#ACD8E7]">t° минимум</div>
                                        <div id="tempmin-${l.id}">--</div>
                                    </div>
                                </div>
                                <div class="detail-item opacity-0 -translate-y-5 -translate-x-1 transition-300 grid grid-flow-row text-center">
                                    <div class="grid grid-flow-row">
                                        <div class="text-xs text-[#90929E] dark:text-[#ACD8E7]">Осадки</div>
                                        <div id="precipprob-${l.id}">--</div>
                                    </div>
                                    <div class="">
                                        <div class="text-xs text-[#90929E] dark:text-[#ACD8E7]">Влажность</div>
                                        <div id="humidity-${l.id}">--</div>
                                    </div>
                                </div>
                                <div class="detail-item opacity-0 -translate-y-5 -translate-x-1 transition-300 grid grid-flow-row text-center">
                                    <div class="">
                                        <div class="text-xs text-[#90929E] dark:text-[#ACD8E7]">Давление</div>
                                        <div id="pressure-${l.id}">--</div>
                                    </div>
                                    <div class="">
                                        <div class="text-xs text-[#90929E] dark:text-[#ACD8E7]">Ветер</div>
                                        <div id="windspeed-${l.id}">--</div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="hourlyToday-${l.id}" class="hourly swiper-no-swiping will-change-scroll pt-4 gap-2 flex overflow-hidden overflow-x-scroll 
                no-scrollbar px-3 scroll-smooth snap-x snap-mandatory">
                </section>

                <section id="daily-${l.id}" class="py-6 mx-4 grid grid-flow-row">
                </section>

                <section id="monthly-${l.id}-btn" class="mx-4 pb-24 font-light flex flex-nowrap gap-5 items-center hidden
                hs-overlay-toggle" data-hs-overlay="#monthly-forecast" aria-controls="sidebarLeft" aria-label="Toggle locations menu"
                data-id="${l.id}">
                    <div class="small-icon w-[52px] h-[52px] grow-0 bg-white dark:bg-[#192D52] rounded-2xl py-1">
                        <img class="w-[44px] h-[44px] mx-auto" src="img/assets/icons/monthly.svg" alt="">
                    </div>
                    <div class="grow text-base leading-5 dark:text-[#FFFFFF]">Прогноз на месяц</div>
                    <div class="grow-0"><img class="w-[7px] h-[14px] mx-auto" src="img/assets/icons/arrow-right.svg" alt=""></div>
                </section>
            </div>`)
            })
            Object.values(locations).forEach((l) => {
                if (l.current == true) {
                    getLocationButton.classList.add('hidden')
                } else {
                }
                getWeatherDataFromAPI(l.id, l.latitude, l.longitude)
                    .then(weatherData => {
                        // console.log(weatherData)
                        appendData(l, weatherData)
                    })
            })
        }
    }

    const classToggle = (el, ...args) => {
        args.map(e => el.classList.toggle(e))
    }

    // search location input
    const leftMenuHeader = document.querySelector('#left-menu-header')
    const listOfLocations = document.querySelector('ol#locations-list')
    const cancelSearchButton = document.querySelector('#cancel-button')
    const leftMenuContainer = document.querySelector('#left-menu-container')

    searchInput.onfocus = searchFocus;
    searchInput.onkeyup = getGeoData;
    cancelSearchButton.addEventListener('click', searchCancel);

    searchInput.addEventListener('input', (event) => {
        // console.log(event.target.value.length)
        if (event.target.value.length == 0) {
            event.target.nextElementSibling.classList.add('opacity-0', 'invisible')
            suggestionList.innerHTML = ''
        } else {
            event.target.nextElementSibling.classList.remove('opacity-0', 'invisible')
        }
    })

    function searchFocus() {
        locations_placeholder.classList.add('opacity-0')
        suggestionList.classList.remove('invisible', 'opacity-0')
        searchInput.placeholder = 'Введите название'
        searchInput.classList.add('w-[calc(100vw-104px)]')
        searchInput.classList.remove('w-full', 'dark:text-[#798C9F]')
        leftMenuContainer.classList.remove('overflow-y-scroll', 'overflow-x-hidden')
        cancelSearchButton.classList.remove('-right-20')
        searchInput.parentNode.classList.add('-translate-y-12')
        listOfLocations.classList.add('-translate-y-14', 'scale-[0.96]', '-z-10')
        leftMenuHeader.classList.add('opacity-0', 'invisible', '-translate-y-2', 'blur-xl', 'scale-[0.99]')
        showLocationsBackdrop()
        if (editLocation_flag) {
            editLocationsToggle()
        }
    }

    function searchCancel() {
        hideLocationsBackdrop()
        locations_placeholder.classList.remove('opacity-0')
        searchInput.nextElementSibling.classList.add('opacity-0', 'invisible')
        searchInput.placeholder = 'Найти новую локацию'
        searchInput.value = ''
        searchInput.classList.remove('w-[calc(100vw-104px)]')
        searchInput.classList.add('w-full', 'dark:text-[#798C9F]')
        leftMenuContainer.classList.add('overflow-y-scroll', 'overflow-x-hidden')
        cancelSearchButton.classList.add('-right-20')
        searchInput.parentNode.classList.remove('-translate-y-12')
        listOfLocations.classList.remove('-translate-y-14', 'scale-[0.96]', '-z-10')
        leftMenuHeader.classList.remove('opacity-0', 'invisible', '-translate-y-2', 'blur-xl', 'scale-[0.99]')
        suggestionList.classList.add('invisible', 'opacity-0')
        suggestionList.innerHTML = ''
    }
});