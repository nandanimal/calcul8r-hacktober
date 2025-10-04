import "@/styles/globals.css";

import localFont from "next/font/local";

const rombyte = localFont({
    src: [
        { path: "../public/rombyte.ttf", weight: "400", style: "medium" },
        {
            path: "../public/rombyte.ttf",
            weight: "400",
            style: "regular",
        },
    ],
    variable: "--font-dince",
});

export default function App({ Component, pageProps }) {
    return (
        <div className={rombyte.variable}>
            <Component {...pageProps} />
        </div>
    );
}
