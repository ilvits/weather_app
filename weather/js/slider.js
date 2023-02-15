var h1 = `<div class="flex w-full h-8 mt-4 px-8 justify-between cursor-grab">
<div id="get_location" class="grow-0 shrink-0 w-6">
    <img id="location_icon" src="img/location-icon.svg" alt="">
</div>
<div id="locationName" class="grow shrink-0 font-semibold text-base leading-5">
    <!-- <div class="text-center">⊙ ⊙ ⊙</div> -->
</div>
<div id="settings" class="grow-0 shrink-0 w-6">
    <img id="settings_icon" src="img/settings-icon.svg" alt="">
</div>
</div>
<div id="loader"
class="bg-slate-800/50 border-2 border-slate-700/10 rounded-3xl mx-auto grid gap-4 w-full h-[338px] mt-4 p-5">
<div class="animate-pulse">
    <div class="flex justify-between sm:justify-around items-baseline w-full">
        <div class="w-24 h-3 bg-slate-700/50 rounded-md my-1"></div>
        <div class="w-24 h-1 bg-slate-700/50 rounded-md mb-1"></div>
    </div>
    <div
        class="flex justify-between sm:justify-around items-center pb-4 w-full text-white border-b border-slate-800">
        <div class="grid grid-flow-row">
            <div class="w-24 h-16 bg-slate-700/50 rounded-md mb-1 mt-8"></div>
            <div class="w-32 h-2 bg-slate-700/50 rounded-md my-2"></div>
            <div class="w-32 h-2 bg-slate-700/50 rounded-md my-1"></div>
        </div>
        <div class="bg-slate-700/20 h-20 w-20 my-8 mr-6 rounded-full"></div>
    </div>
    <div class="grid gap-x-1 gap-y-2 xs:gap-2 grid-cols-2 xs:p-3 mt-3 items-center">
        <div class="flex gap-3 items-center">
            <div class="flex flex-col">
                <div class=" w-8 h-8 m-2 bg-slate-800/50 rounded-xl"></div>
            </div>
            <div class="flex flex-col gap-2">
                <div class="w-16 h-1 bg-slate-700/50 rounded-xl"></div>
                <div class="w-16 h-1 bg-slate-700/50"></div>
            </div>
        </div>
        <div class="flex gap-3 items-center">
            <div class="flex flex-col">
                <div class=" w-8 h-8 m-2 bg-slate-800/50 rounded-xl"></div>
            </div>
            <div class="flex flex-col gap-2">
                <div class="w-16 h-1 bg-slate-700/50 rounded-xl"></div>
                <div class="w-16 h-1 bg-slate-700/50"></div>
            </div>
        </div>
        <div class="flex gap-3 items-center">
            <div class="flex flex-col">
                <div class=" w-8 h-8 m-2 bg-slate-800/50 rounded-xl"></div>
            </div>
            <div class="flex flex-col gap-2">
                <div class="w-16 h-1 bg-slate-700/50 rounded-xl"></div>
                <div class="w-16 h-1 bg-slate-700/50"></div>
            </div>
        </div>
        <div class="flex gap-3 items-center">
            <div class="flex flex-col">
                <div class=" w-8 h-8 m-2 bg-slate-800/50 rounded-xl"></div>
            </div>
            <div class="flex flex-col gap-2">
                <div class="w-16 h-1 bg-slate-700/50 rounded-xl"></div>
                <div class="w-16 h-1 bg-slate-700/50"></div>
            </div>
        </div>
    </div>
</div>
</div>
<div id="main_info"
class="hidden border-2 border-slate-700/30 grid gap-4 w-auto h-[338px] mt-4 p-5 mx-4 bg-gradient-to-br from-cyan/20 to-blue/20 rounded-3xl">

<div class="flex justify-between sm:justify-around items-baseline w-full">
    <div class="font-semibold text-xl leading-5">Сейчас</div>
    <div id="currentDay" class="text-white/70 text-xs"></div>
</div>
<div
    class="flex justify-between sm:justify-around items-center pb-4 w-full text-white border-b border-white/20">
    <div class="grid grid-flow-row">
        <div id="temperature" class="font-semibold text-7xl leading-tight"></div>
        <div id="conditions"></div>
        <div id="feelslike" class="flex"></div>
    </div>
    <div id="weather-icon" class=""></div>
</div>
<div id="weather-details"
    class="grid gap-x-1 gap-y-2 xs:gap-2 grid-cols-2 xs:p-3 items-center">
    <div class="flex gap-3 items-center">
        <div class="flex flex-col"><img class="w-6 h-6" src="img/wind.svg" alt="">
        </div>
        <div class="flex flex-col">
            <div id="windspeed"
                class="flex text-base font-semibold gap-1 items-baseline"></div>
            <div class="text-white/50 text-xs">Ветер</div>
        </div>
    </div>
    <div class="flex gap-3 items-center">
        <div class="flex flex-col"><img class="w-6 h-6" src="img/pressure.svg"
                alt="">
        </div>
        <div class="flex flex-col">
            <div id="pressure" class="text-base font-semibold"></div>
            <div class="text-white/50 text-xs">Давление</div>
        </div>
    </div>
    <div class="flex gap-3 items-center">
        <div class="flex flex-col"><img class="w-6 h-6" src="img/precip.svg" alt="">
        </div>
        <div class="flex flex-col">
            <div id="precipprob" class="text-base font-semibold">
            </div>
            <div class="text-white/50 text-xs">Осадки</div>
        </div>
    </div>
    <div class="flex gap-3 items-center">
        <div class="flex flex-col"><img class="w-6 h-6" src="img/humidity.svg"
                alt="">
        </div>
        <div class="flex flex-col">
            <div id="humidity" class="text-base font-semibold"></div>
            <div class="text-white/50 text-xs">Влажность</div>
        </div>
    </div>
</div>
</div>
<div id="nav" class="flex flex-row gap-10 pl-8 mt-6 mb-2">
<div id="buttonToday"
    class="z-50 font-semibold text-sm transition-all duration-700 text-yellow">
    Сегодня
</div>
<div id="buttonTomorrow"
    class="z-50 font-semibold text-sm transition-all duration-500">Завтра
</div>
</div>
<div class="h-[148px] grow-0">
<div id="hourlyToday"
    class="grid grid-flow-col gap-3 overflow-x-scroll no-scrollbar py-3 scroll px-4 transform transition duration-500 ease-[cubic-bezier(1,-0.24,0.33,1.01)]">
</div>
<div id="hourlyTomorrow"
    class="grid grid-flow-col gap-3 overflow-x-scroll no-scrollbar py-3 scroll px-4 transform transition duration-500 ease-[cubic-bezier(1,-0.24,0.33,1.01)] -translate-y-0 opacity-0 ">
</div>
</div>

<div class="block ml-6 mt-5 mb-3 text-xl leading-6 font-semibold">Прогноз на 10 дней
</div>
<div id="daily" class="mx-4 grid grid-flow-row divide-y divide-blue/20">
</div>`

function app() {
    return {
        touchstartX: 0,
        touchstartY: 0,
        touchendX: 0,
        touchendY: 0,
        previousIndex: 0,
        currentIndex: 0,
        previousTransition: {
            start: null,
            end: null,
        },
        currentTransition: {
            start: null,
            end: null,
        },
        slides: [
            {
                show: true,
                html: h1,
            },
            {
                html: h1,
            },
            {
                html: h1,
            }
        ],
        handleSwipe: function () {
            // Stop
            if (this.touchstartX - this.touchendX > -20 && this.touchstartX - this.touchendX < 20) return;
            // Set previous index
            this.previousIndex = this.currentIndex;
            // Swipe
            if (this.touchendX < this.touchstartX) {
                // Swipe left
                this.currentIndex = Math.min(this.slides.length - 1, this.currentIndex + 1);
                this.previousTransition.start = 'translate-x-none opacity-1';
                this.previousTransition.end = '-translate-x-1/4 opacity-0';
                this.currentTransition.start = 'translate-x-1/4 opacity-0';
                this.currentTransition.end = 'translate-x-none opacity-1';
            } else {
                // Swipe right
                this.currentIndex = Math.max(0, this.currentIndex - 1);
                this.previousTransition.start = 'translate-x-none opacity-1';
                this.previousTransition.end = 'translate-x-1/4 opacity-0';
                this.currentTransition.start = '-translate-x-1/4 opacity-0';
                this.currentTransition.end = 'translate-x-none opacity-1';
            }
            // Check previous index
            if (this.previousIndex !== this.currentIndex) {
                this.showSlide();
            }
        },
        showSlide: function () {
            for (let i = 0; i < this.slides.length; i++) {
                this.slides[i].show = i == this.currentIndex;
            }
        }
    }
}
