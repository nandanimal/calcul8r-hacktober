import React from "react";

const Post = ({ expression, result, likeCount, commentCount, user, date }) => {
    const dummyData = {
        expression: "5 + 3",
        result: "8",
        likeCount: 0,
        commentCount: 0,
        user: "John_Doe",
        date: "2023-10-01",
    };

    return (
        <div className="border p-4 rounded-lg shadow-md border-dotted text-shadow-md">
            <div className="flex justify-between items-center mb-2 text-shadow-md">
                <span className="text-sm ">@{user || dummyData.user}</span>
                <span className="text-sm">{date || dummyData.date}</span>
            </div>
            <div className="mb-2">
                <p className="text-3xl flex flex-row gap-1 py-1">
                    {expression || dummyData.expression} ={" "}
                    {result || dummyData.result}
                </p>
            </div>
            <div className="flex justify-start text-sm gap-4 text-greenDark">
                <span className="flex flex-row gap-2 text-shadow-md ">
                    <img src="/like.svg" />
                    {likeCount || dummyData.likeCount}
                </span>
                <span className="flex flex-row gap-2 text-shadow-md">
                    <img src="/comment.svg" />
                    {commentCount || dummyData.commentCount}
                </span>
            </div>
        </div>
    );
};

export default Post;
