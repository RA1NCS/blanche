import type { Config } from 'tailwindcss';

const config: Config = {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			colors: {
				'drexel-blue': '#002F6C',
				'drexel-yellow': '#F2CA00',
			},
			fontFamily: {
				'miller-display': ['MillerDisplay', 'serif'],
				'miller-text': ['MillerText', 'serif'],
				poppins: ['Poppins', 'sans-serif'],
			},
			backgroundImage: {
				'gradient-radial':
					'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic':
					'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
			},
			keyframes: {
				bounce1: {
					'0%, 80%, 100%': { transform: 'scale(0.8)' },
					'40%': { transform: 'scale(1.35)' },
				},
				bounce2: {
					'0%, 80%, 100%': { transform: 'scale(0.8)' },
					'40%': { transform: 'scale(1.35)' },
				},
				bounce3: {
					'0%, 80%, 100%': { transform: 'scale(0.8)' },
					'40%': { transform: 'scale(1.35)' },
				},
			},
			animation: {
				bounce1: 'bounce1 1.2s infinite ease-in-out',
				bounce2: 'bounce2 1.2s infinite ease-in-out 0.2s',
				bounce3: 'bounce3 1.2s infinite ease-in-out 0.4s',
			},
		},
	},
	plugins: [require('@tailwindcss/forms')],
};

export default config;
