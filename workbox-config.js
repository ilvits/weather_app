module.exports = {
	globDirectory: '/',
	globPatterns: [
		'**/*.{css,svg,png,json,webp,jpg,zip,html,js,woff2}',
	],
	swDest: 'sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};