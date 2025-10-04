"use client";
import React, { useEffect, useState } from "react";
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
    const [me, setMe] = useState(null);
    const [isPosting, setIsPosting] = useState(false);
    const [postStatus, setPostStatus] = useState("");

    useEffect(() => {
        (async () => {
            try {
                const r = await fetch("/api/me");
                const j = await r.json();
                setMe(j.user || null);
            } catch {}
        })();
    }, []);

    const submitPost = async (expression, evaluated) => {
        if (!me) {
            const returnTo =
                typeof window !== "undefined"
                    ? window.location.pathname + window.location.search
                    : "/";
            window.location.href = `/auth/login?returnTo=${encodeURIComponent(
                returnTo
            )}`;
            return;
        }

        try {
            setIsPosting(true);
            setPostStatus("Posting…");
            const res = await fetch("/api/posts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ expression, result: String(evaluated) }),
            });
            if (!res.ok) {
                const j = await res.json().catch(() => ({}));
                setPostStatus(j?.error || "Failed to post");
                return;
            }
            setPostStatus("Posted!");
        } catch (e) {
            setPostStatus("Failed to post");
        } finally {
            setIsPosting(false);
            setTimeout(() => setPostStatus(""), 1500);
        }
    };

    const handlePress = (value) => {
        if (value === "AC") {
            setInput("");
            setResult("");
            setPostStatus("");
            return;
        }

        if (value === "=") {
            try {
                const formattedInput = input
                    .replace(/×/g, "*")
                    .replace(/÷/g, "/");
                // NOTE: eval is for MVP only; swap for a safe parser later
                const evalResult = eval(formattedInput);
                const asText = evalResult.toString();
                setResult(asText);
                submitPost(input, asText);
            } catch {
                setResult("Error");
                setPostStatus("Failed to post");
            }
            return;
        }

        if (result) {
            // start a fresh expression after a result
            setInput(value);
            setResult("");
            setPostStatus("");
        } else {
            setInput((prev) => prev + value);
        }
    };

    const displayResult =
        result.length > 10 ? result.slice(0, 10) + "..." : result;

    return (
        <Layout>
            <div className="calc-container px-3">
                <div className="mb-2 text-right text-xs h-5">
                    {postStatus ? postStatus : "\u00A0"}
                </div>

                <div className="mb-5 border border-dotted border-green-900 p-5 rounded-lg shadow h-[150px] flex flex-col justify-end">
                    <p className="text-right text-2xl text-darkGreen text-shadow-md">
                        {input}
                    </p>
                    <p className="text-right text-6xl text-darkGreen font-semibold text-shadow-md">
                        {displayResult}
                    </p>
                </div>

                <div className="flex flex-col gap-2">
                    {buttons.map((row, rowIndex) => (
                        <div key={rowIndex} className="flex gap-2">
                            {row.map((button, buttonIndex) => (
                                <button
                                    key={buttonIndex}
                                    onClick={() => handlePress(button)}
                                    className={`flex-1 text-shadow-md text-3xl border border-dotted border-darkGreen rounded-lg py-5 text-darkGreen font-medium shadow ${
                                        button === "0" ? "flex-[2]" : ""
                                    }`}
                                    disabled={isPosting && button === "="}
                                >
                                    {button}
                                </button>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
}

import { requireAuth } from "@/lib/requireAuth";
export const getServerSideProps = requireAuth();
