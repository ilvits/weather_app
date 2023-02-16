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

function deleteLocation(locationId, locationN) {
    console.log(locationId, locationN, Object.values(locations).findIndex(item => item.id == locationN))
    swiper.removeSlide(Object.values(locations).findIndex(item => item.id == locationN))
    delete (locations[locationId]);
    localStorage.setItem('locations', JSON.stringify(locations));
    localStorage.removeItem(`weatherData-${locationId}-lastUpdate`)
    localStorage.removeItem(`weatherData-${locationId}-10`)
    localStorage.removeItem(`weatherData-${locationId}-30`)

    if (Object.entries(locations) == 0) {
        locations_header__edit_btn.classList.add('hidden')
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
    localStorage.setItem('locations', JSON.stringify(locations));

    // add to cookies
    // setCookie('locations', JSON.stringify(locations), 30);

    document.querySelector('#card-' + l.id + ' .location-card--name').innerText = name
    document.querySelector('#slide-' + l.id + ' .location-slide--header-title').innerText = name
    closeLocationEditModal()
}

function showLocationsBackdrop() {
    locations_backdrop.classList.remove('opacity-0', '-z-10')
}

function hideLocationsBackdrop() {
    locations_backdrop.classList.add('opacity-0', '-z-10')
}

function openLocationEditModal(el) {
    showLocationsBackdrop()
    // locations_backdrop.classList.add('z-10')
    modalLocation_flag = true
    loc_id = el.closest('.card-wrapper').dataset.name
    loc_index = Object.values(locations).findIndex(item => item.id == loc_id)
    loc_name = Object.values(locations)[loc_index].name
    location_edit_modal.dataset.location = loc_index
    location_edit_modal.classList.remove('invisible', 'opacity-0', '-mt-4')
    location_edit_modal__input.focus()
    setTimeout(() => {
        location_edit_modal__input.value = loc_name
        if (location_edit_modal__input.value.length == 0) {
            location_edit_modal__input.nextElementSibling.classList.add('opacity-0', 'invisible')
            document.querySelector('#' + location_edit_modal.id + ' .ok-button').classList.add('bg-primary-light/50')
            document.querySelector('#' + location_edit_modal.id + ' .ok-button').setAttribute('disabled', '');
        } else {
            location_edit_modal__input.nextElementSibling.classList.remove('opacity-0', 'invisible')
            document.querySelector('#' + location_edit_modal.id + ' .ok-button').classList.remove('bg-primary-light/50')
            document.querySelector('#' + location_edit_modal.id + ' .ok-button').removeAttribute('disabled');

        }
    }, 50);
}

function closeLocationEditModal() {
    hideLocationsBackdrop()
    locations_backdrop.classList.remove('z-10')
    modalLocation_flag = false
    location_edit_modal.classList.add('opacity-0', '-mt-4')
    location_edit_modal__input.nextElementSibling.classList.add('opacity-0', 'invisible')
    setTimeout(() => {
        location_edit_modal.classList.add('invisible')
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
            document.querySelector('#' + location_edit_modal.id + ' .ok-button').classList.add('bg-primary-light/50', 'dark:bg-yellow/50')
            document.querySelector('#' + location_edit_modal.id + ' .ok-button').setAttribute('disabled', '');

        } else {
            suggestionList.innerHTML = ''

        }
    })
})

document.addEventListener("DOMContentLoaded", () => {

    mainPage_tapbar__locations_btn.addEventListener('click', () => {
        HSOverlay.toggle(menu_locations)
    })

    mainPage_tapbar__settings_btn.addEventListener('click', () => {
        HSOverlay.toggle(menu_settings)
    })

    mainPage_search_btn.addEventListener('click', () => {
        searchFocus();
        setTimeout(() => {
            searchInput.focus()
        }, 500);
    })

    locations_header__edit_btn.addEventListener('click', () => {
        editLocationsToggle()
    })

    document.querySelector('#' + location_edit_modal.id + ' .restore-orig-name').addEventListener('click', () => {
        renameLocation(location_edit_modal.dataset.location)
    })

    location_edit_modal__input.addEventListener('input', (event) => {
        // const regex = /[a-zA-ZАА-Яа-яёЁ.,\d\-_\s]([ ]{2,})[a-zA-ZАА-Яа-яёЁ.,\d\-_\s]/i;
        // const str = event.target.value;

        if (event.target.value.length == 0) {
            event.target.nextElementSibling.classList.add('opacity-0', 'invisible')
            document.querySelector('#' + location_edit_modal.id + ' .ok-button').classList.add('bg-primary-light/50')
            document.querySelector('#' + location_edit_modal.id + ' .ok-button').setAttribute('disabled', '');
            event.target.classList.add('pointer-events-none')
        } else {
            event.target.nextElementSibling.classList.remove('opacity-0', 'invisible')
            document.querySelector('#' + location_edit_modal.id + ' .ok-button').classList.remove('bg-primary-light/50')
            document.querySelector('#' + location_edit_modal.id + ' .ok-button').removeAttribute('disabled', '');
            event.target.classList.remove('pointer-events-none')
        }
        // if ((regex.exec(str)) !== null) {
        //     event.target.nextElementSibling.classList.remove('opacity-0', 'invisible')
        //     document.querySelector('#' + location_edit_modal.id + ' .ok-button').classList.remove('bg-primary-light/50')
        //     document.querySelector('#' + location_edit_modal.id + ' .ok-button').removeAttribute('disabled', '');
        //     document.querySelector('#' + location_edit_modal.id + ' .ok-button').classList.remove('pointer-events-none')
        // } else {
        //     event.target.nextElementSibling.classList.add('opacity-0', 'invisible')
        //     document.querySelector('#' + location_edit_modal.id + ' .ok-button').classList.add('bg-primary-light/50')
        //     document.querySelector('#' + location_edit_modal.id + ' .ok-button').setAttribute('disabled', '');
        //     document.querySelector('#' + location_edit_modal.id + ' .ok-button').classList.add('pointer-events-none')
        //     console.log('Недопустимые символы')
        // }
    })

    document.querySelector('#' + location_edit_modal.id + ' .ok-button').addEventListener('click', () => {
        // console.log('click OK')
        if (location_edit_modal__input.value.length == 0) {
        } else {
            renameLocation(location_edit_modal.dataset.location, location_edit_modal__input.value)
            closeLocationEditModal()
        }
    })

    document.querySelector('#' + location_edit_modal.id + ' .location-search--cancel-button').addEventListener('click', () => {
        // console.log('click Cancel')
        closeLocationEditModal()
    })

    mainPage_tapbar__weather_btn.addEventListener('click', () => {
        // console.log(mainPage_tapbar__weather_btn.firstElementChild)
        if (openOverlay) {
            HSOverlay.close(openOverlay)
        }
    })

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
                console.log('no locations')
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
                console.log('locations')
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
            if (editLocation_flag) {
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

    if ((locations == null) || Object.entries(locations).length == 0) {
        locations_header__edit_btn.classList.add('invisible')
    }

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
});