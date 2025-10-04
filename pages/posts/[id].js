// pages/posts/[id].js
import React, { useState } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import Post from "@/components/Post";
import Comment from "@/components/Comment";
import prisma from "@/lib/prisma";

export default function PostPage({ post, initialComments }) {
    const router = useRouter();
    const [comments, setComments] = useState(initialComments);
    const [body, setBody] = useState("");
    const [status, setStatus] = useState("");

    if (!post) {
        return (
            <Layout>
                <div className="p-6 text-center text-gray-600">
                    Post not found.
                </div>
            </Layout>
        );
    }

    const addComment = async (e) => {
        e.preventDefault();
        if (!body.trim()) return;

        try {
            setStatus("Posting…");

            // Ensure user is logged in; /api/me also syncs user into DB
            const meRes = await fetch("/api/me");
            const meJson = await meRes.json();
            if (!meJson?.user) {
                // send to Auth0 then return here
                const returnTo = `${router.asPath}`;
                window.location.href = `/auth/login?returnTo=${encodeURIComponent(
                    returnTo
                )}`;
                return;
            }

            const res = await fetch(`/api/posts/${post.id}/comments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ body }),
            });

            if (!res.ok) {
                const j = await res.json().catch(() => ({}));
                throw new Error(j?.error || "Failed to add comment");
            }

            const { comment } = await res.json();
            // Prepend new comment to the list
            setComments((prev) => [
                {
                    id: comment.id,
                    body: comment.body,
                    createdAt: comment.createdAt,
                    author: comment.author,
                },
                ...prev,
            ]);
            setBody("");
            setStatus("Posted!");
            setTimeout(() => setStatus(""), 1000);
        } catch (err) {
            console.error(err);
            setStatus("Failed to post");
            setTimeout(() => setStatus(""), 1200);
        }
    };

    return (
        <div>
            <Layout>
                <button
                    onClick={() => window.history.back()}
                    className="flex flex-row items-center gap-2 text-shadow-md text-sm cursor-pointer ml-3 mt-8 mb-4"
                >
                    <img src="/arrow-left.svg" alt="Back" className="h-4 w-4" />
                    back
                </button>

                <div className="post-container p-3">
                    <Post
                        user={
                            post.author?.displayName ||
                            post.author?.handle ||
                            "Unknown"
                        }
                        expression={post.expression}
                        result={post.result}
                        likeCount={post._count?.likes || 0}
                        commentCount={post._count?.comments || 0}
                        date={new Date(post.createdAt).toLocaleDateString(
                            "en-US",
                            {
                                month: "long",
                                day: "numeric",
                            }
                        )}
                    />
                </div>

                {/* Comments */}
                <div className="comment-container p-3 flex flex-col gap-2">
                    {comments.length === 0 ? (
                        <div className="text-gray-500 text-sm">
                            No comments yet.
                        </div>
                    ) : (
                        comments.map((c) => (
                            <Comment
                                key={c.id}
                                user={
                                    c.author?.displayName ||
                                    c.author?.handle ||
                                    "user"
                                }
                                body={c.body}
                                date={new Date(c.createdAt).toLocaleString()}
                            />
                        ))
                    )}
                </div>

                {/* Simple comment form */}
                <form
                    onSubmit={addComment}
                    className="p-3 flex gap-2 items-start flex flex-col gap-1 fixed bottom-0 z-10 w-full p-3 bg-[#a7b694] border-t-1 border-dotted rounded-lg"
                >
                    <input
                        type="text"
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        placeholder="Add a comment…"
                        className="focus:outline-none pb-24 text-shadow-md w-full"
                    />
                    <button
                        type="submit"
                        className="rounded-md"
                        disabled={!body.trim()}
                    >
                        <img src="/post.svg" />
                    </button>
                    <span className="text-sm text-gray-500">{status}</span>
                </form>
            </Layout>
        </div>
    );
}

// --- Server-side data fetch (Node runtime) ---
export async function getServerSideProps(context) {
    const { id } = context.params || {};
    if (!id) return { notFound: true };

    // Fetch post + author + counts
    const postRow = await prisma.post.findUnique({
        where: { id },
        select: {
            id: true,
            expression: true,
            result: true,
            createdAt: true,
            author: {
                select: {
                    id: true,
                    handle: true,
                    displayName: true,
                    avatarUrl: true,
                },
            },
            _count: { select: { likes: true, comments: true } },
        },
    });

    if (!postRow) return { notFound: true };

    // Fetch recent comments (newest first)
    const commentsRows = await prisma.comment.findMany({
        where: { postId: id },
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        select: {
            id: true,
            body: true,
            createdAt: true,
            author: {
                select: {
                    id: true,
                    handle: true,
                    displayName: true,
                    avatarUrl: true,
                },
            },
        },
        take: 50,
    });

    // Serialize Dates for JSON
    const post = {
        ...postRow,
        createdAt: postRow.createdAt.toISOString(),
    };
    const initialComments = commentsRows.map((c) => ({
        ...c,
        createdAt: c.createdAt.toISOString(),
    }));

    return { props: { post, initialComments } };
}
