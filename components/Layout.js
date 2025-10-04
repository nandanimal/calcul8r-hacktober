import React from "react";
import Header from "./Header";
import Tabs from "./Tabs";
import { useEffect } from "react";

const Layout = ({ children }) => {
    useEffect(() => {
        fetch("/api/me").catch(() => {});
    }, []);

    return (
        <div className="w-full h-screen overflow-y-scroll relative">
            <Header />
            {children}
            <Tabs />
        </div>
    );
};

export default Layout;
