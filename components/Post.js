import React from "react";
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

    const linkHref = href ?? (id ? `/posts/${id}` : null);

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

            <div className="flex justify-start text-sm gap-4 text-greenDark">
                {/* Add onclick to toggle like */}
                <span className="flex flex-row gap-2 text-shadow-md items-center">
                    <img src="/like.svg" alt="Likes" className="h-4 w-4" />
                    {likeCount ?? dummy.likeCount}
                </span>
                <span className="flex flex-row gap-2 text-shadow-md items-center">
                    <img
                        src="/comment.svg"
                        alt="Comments"
                        className="h-4 w-4"
                    />
                    {commentCount ?? dummy.commentCount}
                </span>
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
