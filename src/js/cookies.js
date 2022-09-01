function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (encodeURIComponent(value) || "") + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}
function eraseCookie(name) {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

let loc = JSON.stringify(
    {
        0: {
            "name": 'Санкт-Петербург',
            "slug": 'spb',
            "latitude": 59.89064061054924,
            "longitude": 30.418760414235095
        },
        1: {
            "name": 'Пантелейки',
            "slug": 'panteleyki',
            "latitude": 55.6743,
            "longitude": 27.0192
        },
        2: {
            "name": "Торревьеха",
            "slug": 'torrevieja',
            "latitude": 37.9815,
            "longitude": -0.6753
        },
        3: {
            "name": "Zucchelli Station",
            "slug": 'zucchelli',
            "latitude": -74.69399018874958,
            "longitude": 164.11546177709056
        },
    }
);

// if (getCookie('locations') === null) {
setCookie('locations', loc, 30)
// }

// if (getCookie('lastUpdateEpoch') === null) {
setCookie('lastUpdateEpoch', Date.now(), 1)
// }

// || (getCookie('lastUpdateEpoch') + 900000 < Date.now()))