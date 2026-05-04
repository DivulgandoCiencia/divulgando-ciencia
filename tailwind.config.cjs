/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ["class"],
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		fontFamily: {
			'generalsans': ['General Sans Regular', 'sans-serif'],
			'generalsans-semibold': ['General Sans Semibold', 'sans-serif'],
			'generalsans-medium': ['General Sans Medium', 'sans-serif'],
			'halloween-titles':['Halloween Titles'],
			'halloween-semititles':['Halloween Semititles']
		},
		container: {
			center: true,
		},
		extend: {
			colors: {
				'principal-white': '#F5F5F5',
				'principal-black': '#222222',
				'light-gray': '#C3C3C3',
				'dark-gray': '#444444',
				'light-math': '#A8C6E3',
				'dark-math': '#004193',
				'light-biology': '#64DB62',
				'dark-biology': '#005100',
				'light-geology': '#E2BBA5',
				'dark-geology': '#6E3400',
				'light-physics': '#FFAAA2',
				'dark-physics': '#950000',
				'light-chemistry': '#FF99FF',
				'dark-chemistry': '#820083',
				'light-technology': '#F2BA48',
				'dark-technology': '#623B00',
				'light-coding': '#E9AAFF',
				'dark-coding': '#5A12B0',
				'light-scientifics': '#16DAC0',
				'dark-scientifics': '#004F3E',
				'shop-white': '#F5F2F0',
				'shop-black': '#242229',
				'faded-white': 'rgb(245, 245, 245, .25)',
				'faded-black': 'rgb(34, 34, 34, .1)',
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
					rgb: "var(--primary-rgb)",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
				float: {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				"float": "float 6s ease-in-out infinite",
			},
		},
	},
	plugins: [
		require('@tailwindcss/typography'),
	],
}
