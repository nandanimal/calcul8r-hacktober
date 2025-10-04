import Link from "next/link";
import React from "react";

const Tabs = () => {
    return (
        <div className="fixed bottom-0 p-3 w-full bg-[#a7b694] border-t-1 border-dotted border-greenDark">
            <div className="tab-content flex flex-row w-full items-center justify-between">
                <div className="tab-link">
                    <Link href="/">
                        <img
                            src="/home.svg"
                            alt="calc"
                            className="h-8 w-auto"
                        />
                    </Link>
                </div>
                <div className="tab-link">
                    <Link href="/calculator">
                        <img
                            src="/calc.svg"
                            alt="calc"
                            className="h-8 w-auto"
                        />
                    </Link>
                </div>
                <div className="tab-link">
                    <Link href="/user">
                        <img
                            src="/profile.svg"
                            alt="calc"
                            className="h-8 w-auto"
                        />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Tabs;
