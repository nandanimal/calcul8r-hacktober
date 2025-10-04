import "@/styles/globals.css";

import localFont from "next/font/local";

const dince = localFont({
    src: [
        { path: "../public/fonts/rombyte.ttf", weight: "400", style: "medium" },
        {
            path: "../public/fonts/rombyte.ttf",
            weight: "400",
            style: "regular",
        },
    ],
    variable: "--font-dince",
});

export default function App({ Component, pageProps }) {
    return <Component {...pageProps} />;
}
