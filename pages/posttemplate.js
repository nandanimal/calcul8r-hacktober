import Layout from "@/components/Layout";
import Post from "@/components/Post";
import Link from "next/link";
import Comment from "@/components/Comment";
import React from "react";
import Input from "@/components/Input";

const posttemplate = () => {
    return (
        <div>
            <Layout>
                <button
                    onClick={() => window.history.back()}
                    className="flex flex-row text-shadow-md text-sm cursor-pointer ml-3 mt-8 mb-4"
                >
                    <img src="/arrow-left.svg" /> back
                </button>
                <div className="post-container p-3">
                    <Post />
                </div>
                <div className="comment-container p-3 flex flex-col gap-2">
                    <Comment />
                    <Comment />
                </div>

                <Input />
            </Layout>
        </div>
    );
};

export default posttemplate;
