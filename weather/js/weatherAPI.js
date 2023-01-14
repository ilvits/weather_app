function getWeatherDataFromAPI(coords) {
    const options = {
        method: 'GET',
        headers: { Accept: 'application/json', 'Accept-Encoding': 'gzip' }
    };
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${coords.geo_lat}%2C${coords.geo_lon}?unitGroup=metric&elements=datetime%2CdatetimeEpoch%2Cname%2Ctempmax%2Ctempmin%2Ctemp%2Cfeelslike%2Chumidity%2Cprecipprob%2Cpreciptype%2Cwindspeed%2Cwinddir%2Cpressure%2Cuvindex%2Csevererisk%2CsunriseEpoch%2Csunset%2Cconditions%2Cdescription%2Cicon&include=days%2Chours%2Ccurrent&key=6M44EU7ZDRK49GFJHKBCX2JJC&contentType=json&lang=ru`
    // const url = 'paris.json'
    responce = fetch(url, options)
        .then(response => { return response.json() })
        .catch(err => console.log(err));

}


var status = function (response) {
    if (response.status !== 200) {
        return Promise.reject(new Error(response.statusText))
    }
    return Promise.resolve(response)
}
var json = function (response) {
    return response.json()
}

// fetch('http://www.mocky.io/v2/5944e07213000038025b6f30')
//     .then(status)
//     .then(json)
//     .then(function (data) {
//         console.log('data', data)
//     })
//     .catch(function (error) {
//         console.log('error', error)
//     })
