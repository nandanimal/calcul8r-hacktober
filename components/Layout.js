import React from "react";
import Header from "./Header";
import Tabs from "./Tabs";

const Layout = ({ children }) => {
    return (
        <div className="w-full h-screen overflow-y-scroll relative">
            <Header />
            {children}
            <Tabs />
        </div>
    );
};

export default Layout;
