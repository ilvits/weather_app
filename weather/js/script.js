// Open hash location on load
let slide = window.location.hash.split('#').pop();
if (locations && Object.entries(locations).length > 0) {
    if (slide) {
        console.log('Slide to', slide)
        const slide_id = Object.values(locations).findIndex(item => item.id == slide)
        setTimeout((slide_id) => {
            slideToId()
        }, 300);
    }
} else {
    mainPage_placeholder.classList.remove('opacity-0')
}

function slideToId(index) {
    if (openOverlay) {
        HSOverlay.close(openOverlay);
    }
    swiper.slideTo(index, 300);
}

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

    // add to cookies
    // setCookie('locations', JSON.stringify(locations), 30);

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
    loc_id = el.closest('.location-card').dataset.name
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
        HSOverlay.toggle(menuSettings)
    })

    mainPage_search_btn.addEventListener('click', () => {
        searchFocus();
        setTimeout(() => {
            searchInput.focus()
        }, 300);
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

    locations_backdrop.addEventListener('click', () => {
        if (document.querySelector('#loading-animation').classList.contains('opacity-0')) {
            closeLocationEditModal()
            hideLocationsBackdrop()
            searchCancel()
        }
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
    //         if (!locationCardsContainer.contains(event.target)) {
    //             editLocationsToggle()
    //         }
    //         if (locations_backdrop.contains(event.target)) {
    //             editLocationsToggle()
    //         }
    //     }
    // })

    function editLocationsToggle() {
        classToggle(locations_header__back_btn, 'opacity-0')
        classToggle(locations_header__label, 'opacity-0')
        setTimeout(() => {
            locations_header__edit_btn.innerText = locations_header__edit_btn.innerText == "Изм." ? "Готово" : "Изм."
        }, 50);
        setTimeout(() => {
            editLocation_flag = editLocation_flag == true ? false : true
        }, 20)
        locationCards.forEach((e) => {
            e.classList.remove('-translate-x-24')
        })
        cards.forEach((el) => {
            classToggle(el, 'w-[calc(100%_-_100px)]', 'w-full', 'h-[85px]', 'h-[80px]')
        })
        editButtons.forEach((e) => {
            classToggle(e, 'w-[284px]', 'w-full', 'opacity-0', 'invisible', 'z-20')
        })
        location_card__name.forEach((e) => {
            classToggle(e, 'translate-y-2')
            if (e.innerText.length > 23) {
                e.classList.toggle('text-sm')
            }
        })

        classToggle(document.querySelector('.user-location-pin'), 'scale-0', 'opacity-0', 'translate-x-12')

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

    setupSlip(locationCardsContainer);

    // search location input
    const locations_menu_container = document.querySelector('#locations-container')
    const locations_menu_header = document.querySelector('#locations--header')
    const listOfLocations = document.querySelector('#location-cards')
    const cancelSearchButton = document.querySelector('#location-search--cancel-button')

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
        listOfLocations.classList.add('-translate-y-14', 'scale-[0.96]', '-z-10')
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
        listOfLocations.classList.remove('-translate-y-14', 'scale-[0.96]', '-z-10')
        locations_menu_header.classList.remove('opacity-0', 'invisible', '-translate-y-2', 'blur-xl', 'scale-[0.99]')
        suggestionList.classList.add('invisible', 'opacity-0')
        suggestionList.innerHTML = ''
    }
});