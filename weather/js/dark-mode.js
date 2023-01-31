// On page load or when changing themes, best to add inline in `head` to avoid FOUC
document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        activateTheme('dark')
    } else if (localStorage.theme === 'system') {
        activateTheme('system')
    } else {
        activateTheme('light')
    }

    function activateTheme(mode) {
        input_id = '#hs-dropdown-item-radio-' + mode
        r = document.querySelector(input_id)
        theme_button = document.querySelector('#hs-dropdown-item-checkbox')
        theme_svgs = document.querySelectorAll('.theme-radio-svg ')
        theme_svgs.forEach((e) => {
            e.classList.add('opacity-0')
        })

        svg = '#theme-' + mode + ' .theme-radio-svg'
        document.querySelector(svg).classList.remove('opacity-0')
        r.checked = true
        r.setAttribute('checked', true)
        if (mode == 'dark') {
            theme_button.innerHTML = 'Тёмная'
            document.documentElement.classList.add('dark')
        } else if (mode == 'light') {
            theme_button.innerHTML = 'Светлая'
            document.documentElement.classList.remove('dark')
        } else if (mode == 'system') {
            theme_button.innerHTML = 'Системная'
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.documentElement.classList.add('dark')
            } else {
                document.documentElement.classList.remove('dark')
            }
        }
        localStorage.theme = mode
        // console.log(mode)
        // console.log(input_id)
        // console.log(r)
    }

    // MediaQueryList
    const darkModePreference = window.matchMedia("(prefers-color-scheme: dark)");
    darkModePreference.addEventListener("change", e => {
        if (e.matches) {
            activateTheme('dark')
        } else {
            activateTheme('light')
        }
    });

    theme_radio_btns = document.querySelectorAll('input[name=hs-dropdown-item-radio]')

    theme_radio_btns.forEach((r) => {
        r.addEventListener('click', () => {
            HSDropdown.close(document.querySelector('#settings-theme-dropdown'))
            activateTheme(r.dataset.theme)
        })
    })
})
