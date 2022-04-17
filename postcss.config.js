module.exports = {
	purge: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
	plugins: {
		"postcss-100vh-fix": {},
		tailwindcss: {},
		autoprefixer: {},
	},
};
