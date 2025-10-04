// pages/index.js
"use client";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Layout from "@/components/Layout";
import Post from "@/components/Post";

export default function Home() {
    const [posts, setPosts] = useState([]);
    const [nextCursor, setNextCursor] = useState(null);
    const [loading, setLoading] = useState(false);
    const [firstLoadDone, setFirstLoadDone] = useState(false);
    const [error, setError] = useState("");

    const load = async (cursor) => {
        try {
            setLoading(true);
            setError("");

            const qs = new URLSearchParams({ limit: "10" });
            if (cursor?.cursorCreatedAt && cursor?.cursorId) {
                qs.set("cursorCreatedAt", cursor.cursorCreatedAt);
                qs.set("cursorId", cursor.cursorId);
            }

            const res = await fetch(`/api/feed?${qs.toString()}`);
            if (!res.ok) throw new Error("Failed to fetch feed");

            const data = await res.json();
            setPosts((prev) => [...prev, ...(data.posts || [])]);
            setNextCursor(data.nextCursor || null);
            setFirstLoadDone(true);
        } catch (e) {
            console.error(e);
            setError("Couldn’t load feed.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load(); // initial page
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            <Layout>
                <div className="text-center my-4">For you page</div>

                {error && (
                    <div className="text-center text-red-600 mb-2">{error}</div>
                )}

                {!firstLoadDone && loading && (
                    <div className="text-center mb-2">Loading…</div>
                )}

                <div className="home-container p-3">
                    <div className="posts-container flex flex-col gap-2 pb-48">
                        {posts.length === 0 && firstLoadDone && !loading ? (
                            <div className="text-center text-gray-500">
                                No posts yet.
                            </div>
                        ) : (
                            posts.map((p) => (
                                <Post
                                    key={p.id}
                                    id={p.id}
                                    user={
                                        p?.author?.displayName ||
                                        p?.author?.handle ||
                                        "Unknown"
                                    }
                                    expression={p.expression}
                                    result={p.result}
                                    likeCount={p?._count?.likes || 0}
                                    commentCount={p?._count?.comments || 0}
                                    date={new Date(
                                        p.createdAt
                                    ).toLocaleDateString("en-US", {
                                        month: "long",
                                        day: "numeric",
                                    })}
                                />
                            ))
                        )}
                    </div>

                    {/* <div className="flex justify-center mt-4">
                        {nextCursor ? (
                            <button
                                onClick={() => load(nextCursor)}
                                className="px-4 py-2 border rounded"
                                disabled={loading}
                            >
                                {loading ? "Loading…" : "Load more"}
                            </button>
                        ) : posts.length > 0 ? (
                            <div className="text-gray-500">End of feed</div>
                        ) : null}
                    </div> */}
                </div>
            </Layout>
        </div>
    );
}
