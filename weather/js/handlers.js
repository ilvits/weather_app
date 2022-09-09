// search location input
const leftMenuHeader = document.querySelector('#left-menu-header')
const listOfLocations = document.querySelector('ol#locations-list')
const cancelSearchButton = document.querySelector('#cancel-button')
const input = document.querySelector('#search-input')
let suggestionList = document.querySelector('#suggestion-list')

input.onfocus = searchFocus;
input.onkeyup = getGeoData;
cancelSearchButton.addEventListener('click', searchCancel);

weatherDetailsToggle.onclick = () => {
    if (detailInfo.clientHeight > 0) {
        console.log('▲ details closing... ▲')

        document.querySelector('#expand-arrow-d').children[0].classList.remove('rotate-[-20deg]')
        document.querySelector('#expand-arrow-d').children[1].classList.remove('rotate-[20deg]')
        document.querySelector('#expand-arrow-d').children[0].classList.add('rotate-[20deg]')
        document.querySelector('#expand-arrow-d').children[1].classList.add('rotate-[-20deg]')

        detailItems.forEach((el) => {
            el.classList.add('opacity-0', '-translate-y-5', '-translate-x-1');
        })

        detailInfo.querySelector('.winddir').classList.remove('rotate-[1turn]')
    } else {
        console.log('▼ details opening... ▼')
        document.querySelector('#expand-arrow-d').children[0].classList.remove('rotate-[20deg]')
        document.querySelector('#expand-arrow-d').children[1].classList.remove('rotate-[-20deg]')
        document.querySelector('#expand-arrow-d').children[0].classList.add('rotate-[-20deg]')
        document.querySelector('#expand-arrow-d').children[1].classList.add('rotate-[20deg]')
        detailItems.forEach((el, index) => {
            var interval = 35;
            setTimeout(() => {
                el.classList.remove('opacity-0', '-translate-y-5', '-translate-x-1');
            }, index * interval);
        })
        detailInfo.querySelector('.winddir').classList.add('rotate-[1turn]')
    }
}

function searchFocus() {
    input.placeholder = 'Введите название'
    input.classList.add('w-[calc(100vw-120px)]')
    input.classList.remove('w-full', 'text-white/50')
    cancelSearchButton.classList.remove('-right-20')
    cancelSearchButton.classList.add('right-0')
    input.parentNode.classList.add('-translate-y-16')
    listOfLocations.classList.add('-translate-y-14', 'scale-[0.99]')
    leftMenuHeader.classList.add('opacity-0', 'invisible', '-translate-y-2', 'blur-xl', 'scale-[0.9]')
    document.querySelector('#backdrop').classList.add('backdrop-blur-lg', 'z-0')
    document.querySelector('#backdrop').classList.remove('invisible', 'opacity-0')
    suggestionList.classList.remove('invisible', 'opacity-0')
}
function searchCancel() {
    input.placeholder = 'Найти новое место'
    input.classList.remove('w-[calc(100vw-120px)]')
    input.classList.add('w-full', 'text-white/50')
    cancelSearchButton.classList.add('-right-20')
    cancelSearchButton.classList.remove('right-0')
    input.parentNode.classList.remove('-translate-y-16')
    listOfLocations.classList.remove('-translate-y-14', 'scale-[0.99]')
    leftMenuHeader.classList.remove('opacity-0', 'invisible', '-translate-y-2', 'blur-xl', 'scale-[0.9]')
    document.querySelector('#backdrop').classList.add('invisible', 'opacity-0')
    document.querySelector('#backdrop').classList.remove('backdrop-blur-lg')
    suggestionList.classList.add('invisible', 'opacity-0')
}

function getGeoData(event) {
    const regex = /^[a-zA-ZАА-Яа-яёЁ.,\d\-_\s]+$/i;
    const str = event.target.value;

    if ((regex.exec(str)) !== null) {
        if (str.length > 2) {
            setTimeout(() => {
                console.log(str, event.target.value);
                console.log(str === event.target.value);
                if (str === event.target.value) {
                    getSuggestions(str)
                }
            }, 500)
        } else {
            console.log('недостаточно символов')
        }
    } else {
        console.log('Недопустимые символы')
    }
}
function getSuggestions(str) {
    console.log(str);
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
            from_bound: { value: "city" },
            to_bound: { value: "settlement" },
            count: 8,
        })
    }

    fetch(url, options)
        .then(response => response.text())
        .then(result => parseSuggestions(result))
        .catch(error => console.log("error", error));
}

let resultList
let rawList = new Object()

function parseSuggestions(suggestions) {
    rawList = JSON.parse(suggestions).suggestions
    suggestionList.innerHTML = ''
    suggestionList.classList.remove('invisible', 'opacity-0')
    for (const [key, value] of Object.entries(rawList)) {
        if (value.data.fias_level === "65") {
            delete (rawList[key]);
            rawList.length -= 1;
        } else {
            suggestionList.innerHTML += `<li class="py-2"> ${value.value} </li>`
        }
    }

}
