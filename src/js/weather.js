let mainContainer
const weatherPanteleyki = document.getElementById('weather-panteleyki')
const weatherTorrevieja = document.getElementById('weather-torrevieja')
const coordsPanteleyki = weatherPanteleyki.dataset.gps
const coordsTorrevieja = weatherTorrevieja.dataset.gps

weatherPanteleyki.addEventListener('click', function onClick(e) {
    e.preventDefault;
    getWeather('panteleyki')
})
weatherTorrevieja.addEventListener('click', function onClick(e) {
    e.preventDefault
    getWeather('torrevieja')
})
document.addEventListener("DOMContentLoaded", ready);

function ready() {
    getWeather('panteleyki')
    setTimeout(() => getWeather('torrevieja'), 1000);
}

function getWeather(city) {
    switch (city) {
        case 'torrevieja':
            var coordinates = coordsTorrevieja
            condition = document.getElementById("condition-torrevieja");
            break;
        case 'panteleyki':
            var coordinates = coordsPanteleyki
            condition = document.getElementById("condition-panteleyki");
            break;
    }
    const options = {
        method: 'GET',
        headers: { Accept: 'application/json', 'Accept-Encoding': 'gzip' }
    };
    const url = `https://api.openweathermap.org/data/2.5/weather?${coordinates}&lang=ru&appid=3cbb42cb4e56223f9424b9d02c75cc36&units=metric`
    fetch(url, options)
        .then(response => response.json())
        .then(weatherData => appendData(city, weatherData))
        .catch(err => console.log(err));
}

function appendData(city, weatherData) {
    console.log(weatherData);
    condition.innerHTML = `
    <img class="w-16 h-16" src="http://openweathermap.org/img/wn/${weatherData['weather']['0']['icon']}@2x.png">
    <div>${weatherData['weather']['0']['description']}</div>`
    for (const [key, value] of Object.entries(weatherData.main)) {
        let id = `${city}-${key}`
        console.log(id)
        try {
            let container = document.getElementById(id);
            if ((key == 'temp' || key == 'feels_like') && value < 20) {
                container.classList.add('text-blue-600')
            } else if ((key == 'temp' || key == 'feels_like') && value < 25) {
                container.classList.add('text-black')
            } else if ((key == 'temp' || key == 'feels_like') && value < 35) {
                container.classList.add('text-orange-500')
            } else if ((key == 'temp' || key == 'feels_like') && value < 45) {
                container.classList.add('text-red-500')
            }
            container.innerHTML = Math.ceil(value)
        }
        catch (error) { console.log(error) }
    }
    document.getElementById(`${city}-wind`).innerHTML = `${weatherData.wind.speed} `
}
