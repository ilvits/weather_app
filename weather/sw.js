if(!self.define){let s,e={};const i=(i,a)=>(i=new URL(i+".js",a).href,e[i]||new Promise((e=>{if("document"in self){const s=document.createElement("script");s.src=i,s.onload=e,document.head.appendChild(s)}else s=i,importScripts(i),e()})).then((()=>{let s=e[i];if(!s)throw new Error(`Module ${i} didn’t register its module`);return s})));self.define=(a,o)=>{const n=s||("document"in self?document.currentScript.src:"")||location.href;if(e[n])return;let r={};const c=s=>i(s,n),d={module:{uri:n},exports:r,require:c};e[n]=Promise.all(a.map((s=>d[s]||c(s)))).then((s=>(o(...s),r)))}}define(["./workbox-8541467f"],(function(s){"use strict";self.addEventListener("message",(s=>{s.data&&"SKIP_WAITING"===s.data.type&&self.skipWaiting()})),s.precacheAndRoute([{url:"css/style.css",revision:"eff20a810f5a4551230112a585893355"},{url:"css/swiper-bundle.min.css",revision:"ac30a6a63cc8cd4f7bf6fd8046586aff"},{url:"fonts/Noto_Emoji/static/NotoEmoji-Bold.woff2",revision:"917e92458c92f718f301d478b01d5b59"},{url:"fonts/Noto_Emoji/static/NotoEmoji-Light.woff2",revision:"18730484ab91887a5d196f197d0573f2"},{url:"fonts/Noto_Emoji/static/NotoEmoji-Medium.woff2",revision:"4eea4ed7aa9c7570e73add5b4580067f"},{url:"fonts/Noto_Emoji/static/NotoEmoji-Regular.woff2",revision:"870dd847cfa518b7f9b0b5d02045f9ee"},{url:"fonts/Noto_Emoji/static/NotoEmoji-SemiBold.woff2",revision:"2fb5da07fa38d98bfc123ddcf49df43c"},{url:"fonts/Nunito/Nunito-Light.woff2",revision:"a76e04f90c0b6e82e0c689a55b566fdc"},{url:"fonts/Nunito/Nunito-Medium.woff2",revision:"9138ec914a097c3277287d9d340ae7db"},{url:"fonts/Nunito/Nunito-Regular.woff2",revision:"05d5f24c1d3bf90b29771b3ebda6ab15"},{url:"fonts/Nunito/Nunito-SemiBold.woff2",revision:"d4b057af9f753df761f4bb8298514e03"},{url:"img/arrow-left.svg",revision:"83a5f451943bfb4f8f5ccd809bfbffa1"},{url:"img/arrow.svg",revision:"2a2f8e13edd9c0aadc76aea770097ea6"},{url:"img/assets/icons/details/clarity_compass-line.svg",revision:"57831ca6858c5ac2d2f00ec9874c6aa3"},{url:"img/assets/icons/details/ion_water-humidity.svg",revision:"add1f4c90837665aa0ef83330b38bc24"},{url:"img/assets/icons/details/precip.svg",revision:"2839e12a08bcedc8f9633ef3798e00f1"},{url:"img/assets/icons/details/sunrise.svg",revision:"120743a29488abc82f7a0f61331a5e9b"},{url:"img/assets/icons/details/sunset.svg",revision:"60cc632576ce0e3913bd6734fd572857"},{url:"img/assets/icons/details/wi_barometer.svg",revision:"369c699fa79ce4429f6b458edaa8e8b5"},{url:"img/assets/icons/pwa/android/android-launchericon-144-144.png",revision:"89fa6b744208d892bec7d105e81aedd7"},{url:"img/assets/icons/pwa/android/android-launchericon-192-192.png",revision:"8e4eeae2777a9c7ae986d5fc2a3bf521"},{url:"img/assets/icons/pwa/android/android-launchericon-48-48.png",revision:"a309a9b498e66a590b0122d2948a40ca"},{url:"img/assets/icons/pwa/android/android-launchericon-512-512.png",revision:"fada60c77ffefa22f57444349de44364"},{url:"img/assets/icons/pwa/android/android-launchericon-72-72.png",revision:"303e4ccf8769ff2feb0966161075a6bf"},{url:"img/assets/icons/pwa/android/android-launchericon-96-96.png",revision:"06ac4235e3244ae7ad396aee2edc8d1d"},{url:"img/assets/icons/pwa/icons.json",revision:"5dbbc3fe59816e65ba28e355a58ea45c"},{url:"img/assets/icons/pwa/ios/100.png",revision:"7c198077dafa532393592af340e427ba"},{url:"img/assets/icons/pwa/ios/1024.png",revision:"aad1999136031742c29e410bef95c584"},{url:"img/assets/icons/pwa/ios/114.png",revision:"4fed527607e4b47cece422c58c3a344a"},{url:"img/assets/icons/pwa/ios/120.png",revision:"2117fe9d84e36a76777701ba8120ba6c"},{url:"img/assets/icons/pwa/ios/128.png",revision:"1d4e0837102b8f34d03511735af8be75"},{url:"img/assets/icons/pwa/ios/144.png",revision:"89fa6b744208d892bec7d105e81aedd7"},{url:"img/assets/icons/pwa/ios/152.png",revision:"d1d4cac8fc0564cb11dcf68c20e8561c"},{url:"img/assets/icons/pwa/ios/16.png",revision:"1fa95d5d01c546291db0ea1f22c49640"},{url:"img/assets/icons/pwa/ios/167.png",revision:"c193088afbe272afbb6458631b2ba048"},{url:"img/assets/icons/pwa/ios/180.png",revision:"db843a116301ff195de2c7b966632887"},{url:"img/assets/icons/pwa/ios/192.png",revision:"8e4eeae2777a9c7ae986d5fc2a3bf521"},{url:"img/assets/icons/pwa/ios/20.png",revision:"ec319caed5877a9c9c69ae41b5408bce"},{url:"img/assets/icons/pwa/ios/256.png",revision:"3dc7d2dd96e28040adb54a1869691878"},{url:"img/assets/icons/pwa/ios/29.png",revision:"68074cf67f110bcc8f037e03f3b43b0d"},{url:"img/assets/icons/pwa/ios/32.png",revision:"bd823af22a716e35ca698e96438cfe0d"},{url:"img/assets/icons/pwa/ios/40.png",revision:"fc6ccb13e6c0b78eab14f93517bab652"},{url:"img/assets/icons/pwa/ios/50.png",revision:"8a28acd367c349313dd6058988b093ca"},{url:"img/assets/icons/pwa/ios/512.png",revision:"fada60c77ffefa22f57444349de44364"},{url:"img/assets/icons/pwa/ios/57.png",revision:"8ca42df783faf382604df16355bedbd8"},{url:"img/assets/icons/pwa/ios/58.png",revision:"0e13a93bf3cbd420ead6c115f362e055"},{url:"img/assets/icons/pwa/ios/60.png",revision:"a00913b6824397ffcfc1d7086db3f008"},{url:"img/assets/icons/pwa/ios/64.png",revision:"86edfa3911d4a35799cda5c6b6f57d8b"},{url:"img/assets/icons/pwa/ios/72.png",revision:"303e4ccf8769ff2feb0966161075a6bf"},{url:"img/assets/icons/pwa/ios/76.png",revision:"b9f2a83a5e2ef3f414df677a25b222c9"},{url:"img/assets/icons/pwa/ios/80.png",revision:"4d0e9f3c72ddc2a3dbc759583049915e"},{url:"img/assets/icons/pwa/ios/87.png",revision:"e8bb8ffbd3c7ebf0ee16142464cde4f9"},{url:"img/assets/icons/pwa/windows11/LargeTile.scale-100.png",revision:"98fcb61fdcf8c9ddbc5a17904ae9f0ef"},{url:"img/assets/icons/pwa/windows11/LargeTile.scale-125.png",revision:"c96ba17429b649e8dbbb2727b3587e3e"},{url:"img/assets/icons/pwa/windows11/LargeTile.scale-150.png",revision:"9de3a673ab84e065d7d0716f1fb23886"},{url:"img/assets/icons/pwa/windows11/LargeTile.scale-200.png",revision:"09f3e552c42b1bc2784dfe63716d4831"},{url:"img/assets/icons/pwa/windows11/LargeTile.scale-400.png",revision:"bc525aa9d3efeae69d4188263bc5d952"},{url:"img/assets/icons/pwa/windows11/SmallTile.scale-100.png",revision:"c5b19ca7e0677e065e5451dae8e01675"},{url:"img/assets/icons/pwa/windows11/SmallTile.scale-125.png",revision:"ff127f47ed97e58d095be030cac93c9a"},{url:"img/assets/icons/pwa/windows11/SmallTile.scale-150.png",revision:"bfe0a2b9590a49cda8ca5a095d8137f4"},{url:"img/assets/icons/pwa/windows11/SmallTile.scale-200.png",revision:"2266c1efe65e9745d13a20749d3d886a"},{url:"img/assets/icons/pwa/windows11/SmallTile.scale-400.png",revision:"cb589422be77e741b6d707f3cf53c1bd"},{url:"img/assets/icons/pwa/windows11/SplashScreen.scale-100.png",revision:"e2dd6985c62dd32790aec8b9cadb0a51"},{url:"img/assets/icons/pwa/windows11/SplashScreen.scale-125.png",revision:"b624f261c559ceea4df4da038b18223c"},{url:"img/assets/icons/pwa/windows11/SplashScreen.scale-150.png",revision:"72984a2eab6ebc83c780ba33c58592f1"},{url:"img/assets/icons/pwa/windows11/SplashScreen.scale-200.png",revision:"7936e45fa8fb1fafe71978ec1e400ac0"},{url:"img/assets/icons/pwa/windows11/SplashScreen.scale-400.png",revision:"e148dd5286387a8b7b10ee9ff2a1a473"},{url:"img/assets/icons/pwa/windows11/Square150x150Logo.scale-100.png",revision:"64ece6603a450ae9312bb6647518b412"},{url:"img/assets/icons/pwa/windows11/Square150x150Logo.scale-125.png",revision:"33e9e8c6d8a37358edd69ec65ff55221"},{url:"img/assets/icons/pwa/windows11/Square150x150Logo.scale-150.png",revision:"4f6e2f30634bec9163a26c5745ce468d"},{url:"img/assets/icons/pwa/windows11/Square150x150Logo.scale-200.png",revision:"d9a5502376eb617605feb21507c6e6ab"},{url:"img/assets/icons/pwa/windows11/Square150x150Logo.scale-400.png",revision:"51bcbee8e96f0e2c77dedccf2d3dac39"},{url:"img/assets/icons/pwa/windows11/Square44x44Logo.altform-lightunplated_targetsize-16.png",revision:"e8bf244fb1241dd285e7fab116583a49"},{url:"img/assets/icons/pwa/windows11/Square44x44Logo.altform-lightunplated_targetsize-20.png",revision:"cbc2937b99409f74ffd1d2a00398de05"},{url:"img/assets/icons/pwa/windows11/Square44x44Logo.altform-lightunplated_targetsize-24.png",revision:"13ee1645bdb98e29a35e856eae5d28ed"},{url:"img/assets/icons/pwa/windows11/Square44x44Logo.altform-lightunplated_targetsize-256.png",revision:"5d465ae3b04af39d1d642563db65798e"},{url:"img/assets/icons/pwa/windows11/Square44x44Logo.altform-lightunplated_targetsize-30.png",revision:"14c532940f2ad205a2bfb9c5993f611a"},{url:"img/assets/icons/pwa/windows11/Square44x44Logo.altform-lightunplated_targetsize-32.png",revision:"917754c7afc47835fd0d13dda2925158"},{url:"img/assets/icons/pwa/windows11/Square44x44Logo.altform-lightunplated_targetsize-36.png",revision:"5db90252058b53f8cc23f90eb6b8796a"},{url:"img/assets/icons/pwa/windows11/Square44x44Logo.altform-lightunplated_targetsize-40.png",revision:"7d6bcbd15b66406484e7c96854109a45"},{url:"img/assets/icons/pwa/windows11/Square44x44Logo.altform-lightunplated_targetsize-44.png",revision:"49216d889735df4d6022e433de787b66"},{url:"img/assets/icons/pwa/windows11/Square44x44Logo.altform-lightunplated_targetsize-48.png",revision:"4349d8d0ed69ea56661f4e7f2237a616"},{url:"img/assets/icons/pwa/windows11/Square44x44Logo.altform-lightunplated_targetsize-60.png",revision:"f70f5b1ba3e48d6070de41b16a4e0973"},{url:"img/assets/icons/pwa/windows11/Square44x44Logo.altform-lightunplated_targetsize-64.png",revision:"5e30b120242c9b66ab0098791cc91430"},{url:"img/assets/icons/pwa/windows11/Square44x44Logo.altform-lightunplated_targetsize-72.png",revision:"892ff1584d893b5eb3505afa76b31412"},{url:"img/assets/icons/pwa/windows11/Square44x44Logo.altform-lightunplated_targetsize-80.png",revision:"91a75ba140c269755f0cce5a40deb2dc"},{url:"img/assets/icons/pwa/windows11/Square44x44Logo.altform-lightunplated_targetsize-96.png",revision:"5e66c1e21cddac171b013a625a602b66"},{url:"img/assets/icons/pwa/windows11/Square44x44Logo.altform-unplated_targetsize-16.png",revision:"e8bf244fb1241dd285e7fab116583a49"},{url:"img/assets/icons/pwa/windows11/Square44x44Logo.altform-unplated_targetsize-20.png",revision:"cbc2937b99409f74ffd1d2a00398de05"},{url:"img/assets/icons/pwa/windows11/Square44x44Logo.altform-unplated_targetsize-24.png",revision:"13ee1645bdb98e29a35e856eae5d28ed"},{url:"img/assets/icons/pwa/windows11/Square44x44Logo.altform-unplated_targetsize-256.png",revision:"5d465ae3b04af39d1d642563db65798e"},{url:"img/assets/icons/pwa/windows11/Square44x44Logo.altform-unplated_targetsize-30.png",revision:"14c532940f2ad205a2bfb9c5993f611a"},{url:"img/assets/icons/pwa/windows11/Square44x44Logo.altform-unplated_targetsize-32.png",revision:"917754c7afc47835fd0d13dda2925158"},{url:"img/assets/icons/pwa/windows11/Square44x44Logo.altform-unplated_targetsize-36.png",revision:"5db90252058b53f8cc23f90eb6b8796a"},{url:"img/assets/icons/pwa/windows11/Square44x44Logo.altform-unplated_targetsize-40.png",revision:"7d6bcbd15b66406484e7c96854109a45"},{url:"img/assets/icons/pwa/windows11/Square44x44Logo.altform-unplated_targetsize-44.png",revision:"49216d889735df4d6022e433de787b66"},{url:"img/assets/icons/pwa/windows11/Square44x44Logo.altform-unplated_targetsize-48.png",revision:"4349d8d0ed69ea56661f4e7f2237a616"},{url:"img/assets/icons/pwa/windows11/Square44x44Logo.altform-unplated_targetsize-60.png",revision:"f70f5b1ba3e48d6070de41b16a4e0973"},{url:"img/assets/icons/pwa/windows11/Square44x44Logo.altform-unplated_targetsize-64.png",revision:"5e30b120242c9b66ab0098791cc91430"},{url:"img/assets/icons/pwa/windows11/Square44x44Logo.altform-unplated_targetsize-72.png",revision:"892ff1584d893b5eb3505afa76b31412"},{url:"img/assets/icons/pwa/windows11/Square44x44Logo.altform-unplated_targetsize-80.png",revision:"91a75ba140c269755f0cce5a40deb2dc"},{url:"img/assets/icons/pwa/windows11/Square44x44Logo.altform-unplated_targetsize-96.png",revision:"5e66c1e21cddac171b013a625a602b66"},{url:"img/assets/icons/pwa/windows11/Square44x44Logo.scale-100.png",revision:"49216d889735df4d6022e433de787b66"},{url:"img/assets/icons/pwa/windows11/Square44x44Logo.scale-125.png",revision:"544af119a8a3ab887efef9ef76ca4f2e"},{url:"img/assets/icons/pwa/windows11/Square44x44Logo.scale-150.png",revision:"8a5baefe22e3d5ad5d4a1258ad56f253"},{url:"img/assets/icons/pwa/windows11/Square44x44Logo.scale-200.png",revision:"43b83b06ba313560d29b0120c78b2483"},{url:"img/assets/icons/pwa/windows11/Square44x44Logo.scale-400.png",revision:"fe6316a68951ce99ad3a11fb9ce93a9c"},{url:"img/assets/icons/pwa/windows11/Square44x44Logo.targetsize-16.png",revision:"e8bf244fb1241dd285e7fab116583a49"},{url:"img/assets/icons/pwa/windows11/Square44x44Logo.targetsize-20.png",revision:"cbc2937b99409f74ffd1d2a00398de05"},{url:"img/assets/icons/pwa/windows11/Square44x44Logo.targetsize-24.png",revision:"13ee1645bdb98e29a35e856eae5d28ed"},{url:"img/assets/icons/pwa/windows11/Square44x44Logo.targetsize-256.png",revision:"5d465ae3b04af39d1d642563db65798e"},{url:"img/assets/icons/pwa/windows11/Square44x44Logo.targetsize-30.png",revision:"14c532940f2ad205a2bfb9c5993f611a"},{url:"img/assets/icons/pwa/windows11/Square44x44Logo.targetsize-32.png",revision:"917754c7afc47835fd0d13dda2925158"},{url:"img/assets/icons/pwa/windows11/Square44x44Logo.targetsize-36.png",revision:"5db90252058b53f8cc23f90eb6b8796a"},{url:"img/assets/icons/pwa/windows11/Square44x44Logo.targetsize-40.png",revision:"7d6bcbd15b66406484e7c96854109a45"},{url:"img/assets/icons/pwa/windows11/Square44x44Logo.targetsize-44.png",revision:"49216d889735df4d6022e433de787b66"},{url:"img/assets/icons/pwa/windows11/Square44x44Logo.targetsize-48.png",revision:"4349d8d0ed69ea56661f4e7f2237a616"},{url:"img/assets/icons/pwa/windows11/Square44x44Logo.targetsize-60.png",revision:"f70f5b1ba3e48d6070de41b16a4e0973"},{url:"img/assets/icons/pwa/windows11/Square44x44Logo.targetsize-64.png",revision:"5e30b120242c9b66ab0098791cc91430"},{url:"img/assets/icons/pwa/windows11/Square44x44Logo.targetsize-72.png",revision:"892ff1584d893b5eb3505afa76b31412"},{url:"img/assets/icons/pwa/windows11/Square44x44Logo.targetsize-80.png",revision:"91a75ba140c269755f0cce5a40deb2dc"},{url:"img/assets/icons/pwa/windows11/Square44x44Logo.targetsize-96.png",revision:"5e66c1e21cddac171b013a625a602b66"},{url:"img/assets/icons/pwa/windows11/StoreLogo.scale-100.png",revision:"8a28acd367c349313dd6058988b093ca"},{url:"img/assets/icons/pwa/windows11/StoreLogo.scale-125.png",revision:"38da637d4fcb1815dbb66ce58c7b8bcc"},{url:"img/assets/icons/pwa/windows11/StoreLogo.scale-150.png",revision:"652d274b09fb08de745777549fc21590"},{url:"img/assets/icons/pwa/windows11/StoreLogo.scale-200.png",revision:"7c198077dafa532393592af340e427ba"},{url:"img/assets/icons/pwa/windows11/StoreLogo.scale-400.png",revision:"b6215b1722edd7e0c83b7fe53f1df8d8"},{url:"img/assets/icons/pwa/windows11/Wide310x150Logo.scale-100.png",revision:"1a07f800db85a072cd3261035a625d11"},{url:"img/assets/icons/pwa/windows11/Wide310x150Logo.scale-125.png",revision:"7f0f9c1accbf08b1719adb7bb08b408b"},{url:"img/assets/icons/pwa/windows11/Wide310x150Logo.scale-150.png",revision:"03e368afb7967ba547a3f5a9084e54d8"},{url:"img/assets/icons/pwa/windows11/Wide310x150Logo.scale-200.png",revision:"e2dd6985c62dd32790aec8b9cadb0a51"},{url:"img/assets/icons/pwa/windows11/Wide310x150Logo.scale-400.png",revision:"7936e45fa8fb1fafe71978ec1e400ac0"},{url:"img/assets/icons/weather-conditions/clear-day.svg",revision:"b807fca843f781149090b2b7a470fce5"},{url:"img/assets/icons/weather-conditions/clear-night.svg",revision:"9f93b8f181844c36631abd2bc01d9566"},{url:"img/assets/icons/weather-conditions/cloudy.svg",revision:"87bfcacb61503c700d94151e91ad073d"},{url:"img/assets/icons/weather-conditions/fog.svg",revision:"7b3e769aac64a6dc2b466c30f16d1c73"},{url:"img/assets/icons/weather-conditions/hail.svg",revision:"cf496c128a51e6fa5b08aa8cbb9c3a8f"},{url:"img/assets/icons/weather-conditions/partly-cloudy-day.svg",revision:"5b025219dfb1fa2f8278114057296f63"},{url:"img/assets/icons/weather-conditions/partly-cloudy-night.svg",revision:"72d547efa94a77e87901e0a76fadb16c"},{url:"img/assets/icons/weather-conditions/rain-snow-showers-day.svg",revision:"db262afb732bf8b3de0d699c9c5f638f"},{url:"img/assets/icons/weather-conditions/rain-snow-showers-night.svg",revision:"e09969e228f7329d18da286548b53b47"},{url:"img/assets/icons/weather-conditions/rain-snow.svg",revision:"0a96246d98265ffc713b341c94601b1e"},{url:"img/assets/icons/weather-conditions/rain.svg",revision:"225f1896bc77f8fcf5dea951eacded56"},{url:"img/assets/icons/weather-conditions/showers-day.svg",revision:"eefd62b22f9cb3af43f6382430f6ef9e"},{url:"img/assets/icons/weather-conditions/showers-night.svg",revision:"d1e0faddd2e80791c6f6969719463f19"},{url:"img/assets/icons/weather-conditions/sleet.svg",revision:"bd1147c1b5c62e13142eb901522cbf31"},{url:"img/assets/icons/weather-conditions/small/clear-day.svg",revision:"dcde0adac2dbd181fa3eaa481efd1689"},{url:"img/assets/icons/weather-conditions/small/cloudy.svg",revision:"d5bf32c2a7a30fe8879fb1fbcaa0b10c"},{url:"img/assets/icons/weather-conditions/small/fog.svg",revision:"46012129257ad3e8edf061900f634976"},{url:"img/assets/icons/weather-conditions/small/hail.svg",revision:"bbe290fae95d4f8e784da9846e799a19"},{url:"img/assets/icons/weather-conditions/small/partly-cloudy-day.svg",revision:"6ee38041f68557115f47b02cc681712b"},{url:"img/assets/icons/weather-conditions/small/rain-snow-showers-day.svg",revision:"04f72441b50d539af7fdfe0b2c55371a"},{url:"img/assets/icons/weather-conditions/small/rain-snow.svg",revision:"f4f0c76597fa32a9cc0b122ead8b5b24"},{url:"img/assets/icons/weather-conditions/small/rain.svg",revision:"f1b45058ee23146decd4652f834b0286"},{url:"img/assets/icons/weather-conditions/small/showers-day.svg",revision:"a2a0e4341da171628499a855fb1ef5d9"},{url:"img/assets/icons/weather-conditions/small/sleet.svg",revision:"9069fe65e8511c503049264746e524dd"},{url:"img/assets/icons/weather-conditions/small/snow-showers-day.svg",revision:"bb2cd1f4ef3e13aa50f868405804f419"},{url:"img/assets/icons/weather-conditions/small/snow.svg",revision:"e755da4f4f9ccea99c2d0463af210de2"},{url:"img/assets/icons/weather-conditions/small/thunder-rain.svg",revision:"390250d2a29a2f275829338a9a761b0f"},{url:"img/assets/icons/weather-conditions/small/thunder-showers-day.svg",revision:"e1c8052f2b0f56d884c136c6b7fa3c0c"},{url:"img/assets/icons/weather-conditions/small/thunder.svg",revision:"c2d139b400e7b6929935e0fea5144bef"},{url:"img/assets/icons/weather-conditions/small/wind.svg",revision:"700d270acc6bf58a4a9cb22cbb6de765"},{url:"img/assets/icons/weather-conditions/snow-showers-day.svg",revision:"6d0e0b3e469dbdb23e58720697a36473"},{url:"img/assets/icons/weather-conditions/snow-showers-night.svg",revision:"937407719149d071b1e0f79e6affbc34"},{url:"img/assets/icons/weather-conditions/snow.svg",revision:"0a6bb0c117f5db441291d15b997938e9"},{url:"img/assets/icons/weather-conditions/thunder-rain.svg",revision:"92e93c621445a8c51706d2e5314b54cc"},{url:"img/assets/icons/weather-conditions/thunder-showers-day.svg",revision:"a644e5fbc974f9c28cc947656b29d2c7"},{url:"img/assets/icons/weather-conditions/thunder-showers-nignt.svg",revision:"42168fe53aab39d9d67167692750c517"},{url:"img/assets/icons/weather-conditions/thunder.svg",revision:"d19712e8a1155499c6a92d6175257a03"},{url:"img/assets/icons/weather-conditions/wind.svg",revision:"494e8748bc5cd449afaf96b529d488a4"},{url:"img/clear-day.svg",revision:"b807fca843f781149090b2b7a470fce5"},{url:"img/clear-night.svg",revision:"9f93b8f181844c36631abd2bc01d9566"},{url:"img/cloudy.svg",revision:"87bfcacb61503c700d94151e91ad073d"},{url:"img/delete.svg",revision:"ec0368ee5eae4834ab703d3c90675fe9"},{url:"img/drag.svg",revision:"d73c81246563a0e0010959dac5903101"},{url:"img/edit.svg",revision:"5ffa1075396d61dc940b2cd570348bbb"},{url:"img/favicon.png",revision:"d1f7ab226fa68cdb75f8cf89e42ce502"},{url:"img/fog.svg",revision:"7b3e769aac64a6dc2b466c30f16d1c73"},{url:"img/hail.svg",revision:"cf496c128a51e6fa5b08aa8cbb9c3a8f"},{url:"img/humidity.svg",revision:"ae2cbdeba29816b4116420405a0bea07"},{url:"img/location-icon.svg",revision:"e9c6810ab2cb2a469c299603ba40433e"},{url:"img/precip.svg",revision:"09a15406ebe00e8891fa088c181d1859"},{url:"img/pressure.svg",revision:"305c5974f40e54db4caa27892aea8034"},{url:"img/rename.svg",revision:"5ffa1075396d61dc940b2cd570348bbb"},{url:"img/screenshots/weather_homescreen.png",revision:"eb98bd995c68ffcdcdba7db10596d8a4"},{url:"img/search.svg",revision:"68c9744c402603c0fec8bb2078485e63"},{url:"img/settings-icon.svg",revision:"e143a596806e36145f1af84c21f003b9"},{url:"img/showers-day.png",revision:"762b0d3f14180a1c000e502c05f62f89"},{url:"img/sleet.svg",revision:"bd1147c1b5c62e13142eb901522cbf31"},{url:"img/temp/Best-Wood-For-Desk-Top-Red-Oak-scaled.jpg.webp",revision:"abbca9d42163bcdfc0323e179b1f6c89"},{url:"img/temp/clear-day.svg",revision:"7b8dab325c1a0ce9aad98a560d676cc2"},{url:"img/temp/clear-night.svg",revision:"a21a93c577e1c9d62e73bf734c342839"},{url:"img/temp/cloudy.svg",revision:"87bfcacb61503c700d94151e91ad073d"},{url:"img/temp/fog.svg",revision:"7b3e769aac64a6dc2b466c30f16d1c73"},{url:"img/temp/hail.svg",revision:"cf496c128a51e6fa5b08aa8cbb9c3a8f"},{url:"img/temp/istockphoto-868697268-1024x1024.jpg",revision:"2727fbbe604fbb0afac9269b6dad9b48"},{url:"img/temp/myrkwood_small.jpg",revision:"1a8f7e7d4915338d2d71706af1e1a0aa"},{url:"img/temp/myrkwood.jpg",revision:"cd71cf497c052a5470886ec5928e6e6c"},{url:"img/temp/Office-Desk-4.jpg",revision:"493d99f163afed9a10c587df48a597bc"},{url:"img/temp/partly-cloudy-day.svg",revision:"704e4382b91658478ba2bb95054a9d03"},{url:"img/temp/partly-cloudy-night.svg",revision:"ee003d1bba502bc1f18e82d22db3a5da"},{url:"img/temp/rain-snow-showers-day.svg",revision:"1eb6572af072a0ec12e1d228c20dfeb3"},{url:"img/temp/rain-snow-showers-night.svg",revision:"11e533c16c2c322bd2f6d80fd73c02fd"},{url:"img/temp/rain-snow.svg",revision:"7b2e98ba6391e479970deead945b14cb"},{url:"img/temp/rain.svg",revision:"49cbcdff96219df36da1a5ebf9925666"},{url:"img/temp/showers-day-1.svg",revision:"1587c442a598c4c3548a1421c6f1b751"},{url:"img/temp/showers-day-2.svg",revision:"43dc8941f969b0e0a2e7ab8e64f6cd47"},{url:"img/temp/showers-day.svg",revision:"3c6f354a7913a8cdf4187b7b3d446c1d"},{url:"img/temp/showers-night.svg",revision:"b465eed535d8f359a62974ce8c02fc00"},{url:"img/temp/sleet.svg",revision:"72bddad2deb17c99530adb1648543c1e"},{url:"img/temp/snow-showers-day.svg",revision:"2f61dbd541ed98d00255a0d6425e630d"},{url:"img/temp/snow-showers-night.svg",revision:"502f55f89486b1e9dd64ab0580ca44d9"},{url:"img/temp/snow.svg",revision:"1a4dc59e3f867c5ea7e18b31f8fb8e36"},{url:"img/temp/thunder-rain.svg",revision:"5491f26ea2e54220155966ce0e40a42e"},{url:"img/temp/thunder.svg",revision:"2b412b867a2d6f051189cef18f59d523"},{url:"img/temp/wind.svg",revision:"494e8748bc5cd449afaf96b529d488a4"},{url:"img/Weather Mobile App Design (Community).zip",revision:"932650ea7ebd7b7e23db993dd449b624"},{url:"img/wind.svg",revision:"494e8748bc5cd449afaf96b529d488a4"},{url:"index.html",revision:"c06768aee71bc37e7b6b19a16177990b"},{url:"js/addToObject.js",revision:"da5fba1ce26b8349e78cf95c658d4a30"},{url:"js/cookies.js",revision:"91de0c9c64fbd9b7a9504cf68466cfd2"},{url:"js/haptic.js",revision:"a1822e5254c31148b6a6c2901e6c8a03"},{url:"js/preline/hs-collapse.js",revision:"9ed5e266fa8212f73801c3c82c4a8a4b"},{url:"js/preline/hs-overlay.js",revision:"6956ada3499bb90ce3ea31825b3f8204"},{url:"js/preline/hs-remove-element.js",revision:"df4900431f02e6a9cb2e3c849f40d4a8"},{url:"js/preline/preline.js",revision:"a0f894ff019366fe75332ab781609c5b"},{url:"js/script.js",revision:"33f466ba57a21ee7a623ad581e264181"},{url:"js/scroll.js",revision:"6bc57a98d56088170c4ab532a6adbacc"},{url:"js/slider.js",revision:"7615cfae6d909893d23d548268ce5bbc"},{url:"js/slip.js",revision:"88dbfd43afd7a243c69c9327e034dded"},{url:"js/swiper.js",revision:"4e26991150777eabb8a7dfa95cc30dff"},{url:"manifest.json",revision:"cbc2e73c68c491e32a796136459a1744"},{url:"panteleyki.json",revision:"f4b504af345ebb187e3863e44da55f0d"},{url:"test.html",revision:"b23c54d4cbd610af7cbe95b683ff89c8"}],{ignoreURLParametersMatching:[/^utm_/,/^fbclid$/]})}));
//# sourceMappingURL=sw.js.map
