module.exports = {
	globDirectory: 'weather/',
	globPatterns: [
		'**/*.{css,svg,png,json,webp,jpg,zip,html,js,woff2}',
		'*.{css,svg,png,json,webp,jpg,zip,html,js,woff2}',
		// '../node_modules/preline/dist/hs-ui.bundle.js',
		'../node_modules/preline/dist/components/hs-collapse/hs-collapse.js',
		'../node_modules/preline/dist/components/hs-modal/hs-modal.js',
		'../node_modules/preline/dist/components/hs-offcanvas/hs-offcanvas.js',
		'../node_modules/preline/dist/components/hs-remove-element/hs-remove-element.js',
	],
	swDest: 'weather/sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};