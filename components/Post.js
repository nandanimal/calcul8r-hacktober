"use client";
import React, { useState } from "react";
import Link from "next/link";

const Post = ({
    id, // post id for /posts/[id]
    href, // optional explicit URL override
    expression,
    result,
    likeCount,
    commentCount,
    user,
    date,
    hasLiked: initialHasLiked = false, // optional initial state (if you have it)
    className = "",
}) => {
    const dummy = {
        expression: "5 + 3",
        result: "8",
        likeCount: 0,
        commentCount: 0,
        user: "John_Doe",
        date: "2023-10-01",
    };

    const [liked, setLiked] = useState(!!initialHasLiked);
    const [likes, setLikes] = useState(likeCount ?? dummy.likeCount);
    const [status, setStatus] = useState(""); // "", "Posting…", "Error"

    const linkHref = href ?? (id ? `/posts/${id}` : null);

    const handleLikeClick = async (e) => {
        // prevent navigating when the card is a link
        e.preventDefault();
        e.stopPropagation();

        if (!id) return;

        try {
            setStatus("Posting…");

            // ensure user is logged in (and synced to DB)
            const meRes = await fetch("/api/me");
            const meJson = await meRes.json().catch(() => ({}));
            if (!meJson?.user) {
                const returnTo =
                    typeof window !== "undefined"
                        ? window.location.pathname + window.location.search
                        : "/";
                window.location.href = `/auth/login?returnTo=${encodeURIComponent(
                    returnTo
                )}`;
                return;
            }

            // optimistic update
            const nextLiked = !liked;
            setLiked(nextLiked);
            setLikes((c) => (nextLiked ? c + 1 : Math.max(0, c - 1)));

            const method = nextLiked ? "POST" : "DELETE";
            const res = await fetch(`/api/posts/${id}/like`, { method });

            if (!res.ok) {
                // rollback on failure
                setLiked(liked);
                setLikes((c) => (nextLiked ? Math.max(0, c - 1) : c + 1));
                const j = await res.json().catch(() => ({}));
                setStatus(j?.error || "Error");
                setTimeout(() => setStatus(""), 1200);
                return;
            }

            // trust server count if provided
            const j = await res.json().catch(() => ({}));
            if (typeof j?.likeCount === "number") setLikes(j.likeCount);

            setStatus("");
        } catch (err) {
            // rollback on exception
            const nextLiked = !liked;
            setLiked(liked);
            setLikes((c) => (nextLiked ? Math.max(0, c - 1) : c + 1));
            setStatus("Error");
            setTimeout(() => setStatus(""), 1200);
        }
    };

    const content = (
        <div
            className={`border p-4 rounded-lg shadow-md border-dotted text-shadow-md ${
                linkHref ? "hover:bg-accent/10 cursor-pointer transition" : ""
            } ${className}`}
        >
            <div className="flex justify-between items-center mb-2 text-shadow-md">
                <span className="text-sm">@{user ?? dummy.user}</span>
                <span className="text-sm">{date ?? dummy.date}</span>
            </div>

            <div className="mb-2">
                <p className="text-3xl flex flex-row gap-1 py-1">
                    {expression ?? dummy.expression}={result ?? dummy.result}
                </p>
            </div>

            <div className="flex justify-start items-center text-sm gap-4 text-greenDark">
                {/* Like button */}
                <button
                    onClick={handleLikeClick}
                    aria-pressed={liked}
                    className={`flex flex-row gap-2 items-center text-shadow-md select-none ${
                        liked ? "font-semibold" : ""
                    }`}
                    title={liked ? "Unlike" : "Like"}
                >
                    <img
                        src="/like.svg"
                        alt={liked ? "Unlike" : "Like"}
                        className={`h-4 w-4 ${
                            liked ? "opacity-100" : "opacity-70"
                        }`}
                    />
                    {likes}
                </button>

                {/* Comment count (non-interactive here) */}
                <span className="flex flex-row gap-2 text-shadow-md items-center">
                    <img
                        src="/comment.svg"
                        alt="Comments"
                        className="h-4 w-4"
                    />
                    {commentCount ?? dummy.commentCount}
                </span>

                {/* tiny status text */}
                {status && (
                    <span className="text-xs text-gray-500">{status}</span>
                )}
            </div>
        </div>
    );

    return linkHref ? (
        <Link href={linkHref} className="block">
            {content}
        </Link>
    ) : (
        content
    );
};

export default Post;
