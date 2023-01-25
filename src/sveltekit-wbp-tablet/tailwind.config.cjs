/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			gridTemplateRows: {
				7: 'repeat(7, minmax(0, 1fr))',
				8: 'repeat(8, minmax(0, 1fr))'
			},
			gridRow: {
				'span-7': 'span 7 / span 7',
				'span-8': 'span 8 / span 8',
				'span-9': 'span 9 / span 9',
			},
			gridRowStart: {
				7: '7',
				8: '8'
			},
			gridRowEnd: {
				'8': '8',
				'9': '9',
				'10': '10',
				'11': '11',
				'12': '12',
				'13': '13',
			}
		}
	},
	plugins: []
};
