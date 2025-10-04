/** @type {import('tailwindcss').Config} */
module.exports = {
    // NOTE: Update this to include the paths to all of your component files.
    content: [
        "./components/**/*.{js,jsx,ts,tsx}",
        "./pages/**/*.{js,jsx,ts,tsx}",
    ],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                greenLight: "#A7B694",
                greenDark: "#44513B",
                accent: "rgba(68, 81, 59, 0.20)",
            },
            boxShadow: {
                shadow: "0px 1px 4px 0px rgba(0, 0, 0, 0.25)",
            },
            fontFamily: {
                sans: ["rombyte", "system-ui"],
            },
        },
    },
    plugins: [],
};
