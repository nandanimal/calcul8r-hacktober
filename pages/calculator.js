"use client";
import Header from "@/components/Header";
import Tabs from "@/components/Tabs";
import React, { useState } from "react";
import Layout from "@/components/Layout";

const buttons = [
    ["AC", "+/-", "%", "÷"],
    ["7", "8", "9", "×"],
    ["4", "5", "6", "-"],
    ["1", "2", "3", "+"],
    ["0", ".", "="],
];

export default function Calculator() {
    const [input, setInput] = useState("");
    const [result, setResult] = useState("");

    const handlePress = (value) => {
        if (value === "AC") {
            setInput("");
            setResult("");
        } else if (value === "=") {
            try {
                const formattedInput = input
                    .replace(/×/g, "*")
                    .replace(/÷/g, "/");
                // eval should be replaced with a safer parser later
                const evalResult = eval(formattedInput);
                setResult(evalResult.toString());
            } catch (error) {
                setResult("Error");
            }
        } else if (result) {
            setInput("");
            setResult("");
            setInput((prev) => prev + value);
        } else {
            setInput((prev) => prev + value);
        }
    };

    const displayResult =
        result.length > 10 ? result.slice(0, 10) + "..." : result;

    return (
        <>
            <Layout>
                {/* Display */}
                <div className="calc-container px-3">
                    <div className="mb-5 border border-dotted border-green-900 p-5 rounded-lg shadow h-[150px] flex flex-col justify-end">
                        <p className="text-right text-2xl text-darkGreen text-shadow-md">
                            {input}
                        </p>
                        <p className="text-right text-6xl text-darkGreen font-semibold text-shadow-md">
                            {displayResult}
                        </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col gap-2">
                        {buttons.map((row, rowIndex) => (
                            <div key={rowIndex} className="flex gap-2">
                                {row.map((button, buttonIndex) => (
                                    <button
                                        key={buttonIndex}
                                        onClick={() => handlePress(button)}
                                        className={`flex-1 text-shadow-md text-3xl border border-dotted border-darkGreen rounded-lg py-5 text-darkGreen font-medium shadow
                  ${button === "0" ? "flex-[2]" : ""}`}
                                    >
                                        {button}
                                    </button>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </Layout>
        </>
    );
}
