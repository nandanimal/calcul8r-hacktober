"use client";
import React, { useState } from "react";
import { useUser } from "@auth0/nextjs-auth0";

const Input = () => {
    const [text, setText] = useState("");
    const { user, isLoading } = useUser();

    const handleChange = (e) => {
        setText(e.target.value);
    };

    return (
        <div className="flex flex-col gap-1 fixed bottom-0 z-10 w-full p-3 bg-[#a7b694] border-t-1 border-dotted rounded-lg">
            <div className="flex flex-row justify-between">
                <div className="text-sm text-shadow-md">
                    {user && `@${user.name.split(" ")[0]}`}
                </div>
                <button
                    disabled={!text.trim()}
                    className={`focus:outline-none cursor-pointer shadow ${
                        !text.trim() ? "opacity-40" : ""
                    }`}
                >
                    <img src="/post.svg" />
                </button>{" "}
            </div>

            <input
                type="text"
                value={text}
                onChange={handleChange}
                placeholder="Say something smart..."
                className="focus:outline-none pb-24 text-shadow-md"
            />
        </div>
    );
};

export default Input;
