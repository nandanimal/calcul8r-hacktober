// pages/me.js (or wherever your "Me" tab lives)
"use client";
import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import Post from "@/components/Post";
import { useUser } from "@auth0/nextjs-auth0";
import Link from "next/link";

export default function MePage() {
    const { user: authUser, isLoading: authLoading } = useUser();

    const [me, setMe] = useState(null); // { id, handle, displayName, avatarUrl }
    const [posts, setPosts] = useState([]); // my posts from DB
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                setError("");

                // 1) Get DB user (also syncs Auth0 → DB)
                const meRes = await fetch("/api/me");
                const meJson = await meRes.json();
                if (!meJson?.user) {
                    setMe(null);
                    setPosts([]);
                    return;
                }
                setMe(meJson.user);

                // 2) Load my posts (requires /api/users/[handle].js)
                const pRes = await fetch(`/api/users/${meJson.user.handle}`);
                if (!pRes.ok) throw new Error("Failed to load posts");
                const { posts } = await pRes.json();
                setPosts(posts || []);
            } catch (e) {
                console.error(e);
                setError("Couldn’t load your profile.");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (!authLoading && !authUser) {
        return (
            <Layout>
                <div className="p-6 text-center">
                    <p className="mb-3">You’re not logged in.</p>
                    <a href="/auth/login" className="underline">
                        Login
                    </a>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="p-3 text-shadow-md">
                {/* Header */}
                <div className="flex items-center gap-2 text-3xl">
                    {me?.avatarUrl ? (
                        <img
                            src={me.avatarUrl}
                            alt="Avatar"
                            className="w-6 h-6 rounded"
                        />
                    ) : null}
                    <span>
                        @{me?.handle || (authUser?.name?.split(" ")[0] ?? "me")}
                    </span>
                    <img src="/star.svg" alt="" />
                </div>

                {/* Counts / status */}
                <div className="text-md mt-2">
                    {loading ? "Loading…" : `${posts.length} calculations`}
                    {error && (
                        <span className="text-red-600 ml-2">{error}</span>
                    )}
                </div>

                {/* Post history */}
                <div className="posts-container flex flex-col gap-2 py-4 pb-48">
                    {loading && !posts.length ? (
                        <div className="text-gray-500">Loading your posts…</div>
                    ) : posts.length === 0 ? (
                        <div className="text-gray-500">
                            No posts yet. Try the{" "}
                            <Link href="/calc" className="underline">
                                calculator
                            </Link>
                            !
                        </div>
                    ) : (
                        posts.map((p) => (
                            <Post
                                key={p.id}
                                id={p.id} // makes the card link to /posts/[id]
                                user={me?.displayName || me?.handle || "You"}
                                expression={p.expression}
                                result={p.result}
                                likeCount={p._count?.likes ?? 0}
                                commentCount={p._count?.comments ?? 0}
                                date={new Date(p.createdAt).toLocaleDateString(
                                    "en-US",
                                    {
                                        month: "long",
                                        day: "numeric",
                                    }
                                )}
                            />
                        ))
                    )}
                </div>
            </div>
        </Layout>
    );
}
