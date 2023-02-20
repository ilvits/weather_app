window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", e => {
    if (localStorage.theme == 'system') {
        if (e.matches) {
            document.documentElement.classList.add('dark')
            document.querySelector('meta[name="theme-color"]').setAttribute('content', '#10213A');
        } else {
            document.documentElement.classList.remove('dark')
            document.querySelector('meta[name="theme-color"]').setAttribute('content', '#F3F4F7');
        }
    }
});

if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark')
    document.querySelector('meta[name="theme-color"]').setAttribute('content', '#10213A');
} else if (localStorage.theme === 'system') {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark')
        document.querySelector('meta[name="theme-color"]').setAttribute('content', '#10213A');
    } else {
        document.documentElement.classList.remove('dark')
        document.querySelector('meta[name="theme-color"]').setAttribute('content', '#F3F4F7');
    }
} else {
    document.documentElement.classList.remove('dark')
    document.querySelector('meta[name="theme-color"]').setAttribute('content', '#F3F4F7');
}

document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        activateTheme('dark')
    } else if (localStorage.theme === 'system') {
        activateTheme('system')
    } else {
        activateTheme('light')
    }

    theme_radio_btns = document.querySelectorAll('input[name=hs-dropdown-item-radio]')

    theme_radio_btns.forEach((r) => {
        r.addEventListener('click', () => {
            HSDropdown.close(document.querySelector('#settings-theme-dropdown'))
            activateTheme(r.dataset.theme)
        })
    })
});

function activateTheme(mode) {
    r = document.querySelector('#hs-dropdown-item-radio-' + mode)
    theme_button = document.querySelector('#hs-dropdown-item-checkbox')
    document.querySelectorAll('.theme-radio-svg ').forEach((e) => {
        e.classList.add('opacity-0')
    })
    document.querySelector('#theme-' + mode + ' .theme-radio-svg').classList.remove('opacity-0')
    r.checked = true
    r.setAttribute('checked', true)
    if (mode == 'dark') {
        theme_button.innerHTML = 'Тёмная'
        document.documentElement.classList.add('dark')
        document.querySelector('meta[name="theme-color"]').setAttribute('content', '#10213A');
    } else if (mode == 'light') {
        theme_button.innerHTML = 'Светлая'
        document.documentElement.classList.remove('dark')
        document.querySelector('meta[name="theme-color"]').setAttribute('content', '#F3F4F7');
    } else if (mode == 'system') {
        theme_button.innerHTML = 'Системная'
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.classList.add('dark')
            document.querySelector('meta[name="theme-color"]').setAttribute('content', '#10213A');
        } else {
            document.documentElement.classList.remove('dark')
            document.querySelector('meta[name="theme-color"]').setAttribute('content', '#F3F4F7');
        }
    }
    localStorage.theme = mode
}