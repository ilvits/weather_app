// search location input
const leftMenuHeader = document.querySelector('#left-menu-header')
const listOfLocations = document.querySelector('ol#locations-list')
const searchLocationsCancelButton = document.querySelector('#cancel-button')
const input = document.querySelector('#search-input')

input.addEventListener('focus', searchFocus);
searchLocationsCancelButton.addEventListener('click', searchCancel);

function searchFocus() {
    // console.log(input);
    // console.log(input.classList);
    // console.log(input.parentNode.previousElementSibling);
    input.placeholder = 'Введите название населенного пункта'
    input.classList.add('w-[calc(100vw-120px)]')
    searchLocationsCancelButton.classList.remove('-right-20')
    searchLocationsCancelButton.classList.add('right-0')
    input.parentNode.classList.add('-translate-y-16')
    listOfLocations.classList.add('-translate-y-14', 'scale-[0.99]')
    leftMenuHeader.classList.add('opacity-0', 'invisible', '-translate-y-2', 'blur-lg', 'scale-[0.9]')
    document.querySelector('#backdrop').classList.add('backdrop-blur-lg', 'z-0')
    document.querySelector('#backdrop').classList.remove('invisible', 'opacity-0')
}

function searchCancel() {
    input.placeholder = 'Введите название населенного пункта'
    input.classList.remove('w-[calc(100vw-120px)]')
    searchLocationsCancelButton.classList.add('-right-20')
    searchLocationsCancelButton.classList.remove('right-0')
    input.parentNode.classList.remove('-translate-y-16')
    listOfLocations.classList.remove('-translate-y-14', 'scale-[0.99]')
    leftMenuHeader.classList.remove('opacity-0', 'invisible', '-translate-y-2', 'blur-lg', 'scale-[0.9]')
    document.querySelector('#backdrop').classList.add('invisible', 'opacity-0')
    document.querySelector('#backdrop').classList.remove('backdrop-blur-lg')
}
