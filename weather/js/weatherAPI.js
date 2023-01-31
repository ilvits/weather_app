async function getWeatherDataFromAPI(id, lat, lon, days = 10) {

    timeOffset = new Date().getTimezoneOffset() / 60
    let weather = localStorage.getItem(id + '-' + days);
    let date = localStorage.getItem(id + '-updateDate')
    timeDelta = Math.round((new Date().getTime() - new Date(date).getTime()) / 1000)
    // console.log('local storage content: ', JSON.parse(weather))
    if (weather && timeDelta < 1800) {
        // console.log('get data from localStorage')
        // console.log(timeDelta + ' sec')
        return JSON.parse(weather)
    } else {
        console.log('get data from API')
        const options = {
            method: 'GET',
            headers: { Accept: 'application/json', 'Accept-Encoding': 'gzip' }
        };
        url10 = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat}%2C${lon}?unitGroup=metric&elements=datetime%2CdatetimeEpoch%2Cname%2Ctempmax%2Ctempmin%2Ctemp%2Cfeelslike%2Chumidity%2Cprecipprob%2Cpreciptype%2Cwindspeed%2Cwinddir%2Cpressure%2Cuvindex%2Csevererisk%2CsunriseEpoch%2CsunsetEpoch%2Cconditions%2Cdescription%2Cicon&include=days%2Chours%2Ccurrent&key=6M44EU7ZDRK49GFJHKBCX2JJC&contentType=json&lang=ru`
        url30 = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat}%2C${lon}/next30days?unitGroup=metric&elements=datetime%2CdatetimeEpoch%2Cname%2Ctempmax%2Ctempmin%2Ctemp%2Cprecipprob%2Cconditions%2Cdescription%2Cicon&include=days%2Calerts&key=6G659YZGHYJQJQYGA99FJZDMK&contentType=json&lang=ru`

        // url10 = `weather_data/${id}-10.json`
        // url30 = `weather_data/${id}-30.json`

        if (days == 30) {
            url = url30
        } else {
            url = url10
        }

        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }
            weather = await response.json();
            date = new Date()
            localStorage.setItem(id + '-updateDate', date);
            localStorage.setItem(id + '-' + days, JSON.stringify(weather));
            return weather;
        }
        catch (error) {
            console.error(`Could not get weather data: ${error}`);
        }
    }
}
