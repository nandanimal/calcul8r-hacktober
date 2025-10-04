import React from "react";

const Comment = ({ user, date, body }) => {
    const dummyUser = {
        user: "John_doe",
        date: "today",
        body: "this is a test comment",
    };

    return (
        <div className="flex flex-col gap-2 border-b-1 py-2 border-dotted">
            <div className="flex flex-row justify-between text-xs text-shadow-md">
                <span className="">@{user || dummyUser.user}</span>
                <span className="">{date || dummyUser.date}</span>
            </div>
            <div className="text-sm text-shadow-md">
                {body || dummyUser.body}
            </div>
        </div>
    );
};

export default Comment;
