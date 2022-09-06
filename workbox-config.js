module.exports = {
	globDirectory: 'weather/',
	globPatterns: [
		'**/*.{css,svg,png,json,webp,jpg,zip,html,js,woff2}',
	],
	swDest: 'weather/sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};