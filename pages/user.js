"use client";
import Layout from "@/components/Layout";
import Post from "@/components/Post";
import Profile from "@/components/Profile";

import { useUser } from "@auth0/nextjs-auth0";

export default function User() {
    const { user, isLoading } = useUser();

    return (
        <>
            <Layout>
                <div className=" p-3 text-shadow-md">
                    {user && (
                        <div className="text-3xl flex flex-row gap-1 items-center">
                            {/* <img
                                src={user.picture}
                                alt="Profile"
                                style={{
                                    borderRadius: "2px",
                                    width: "24px",
                                    height: "24px",
                                }}
                            /> */}
                            @{user.name.split(" ")[0]} <img src="/star.svg" />
                        </div>
                    )}

                    <div className="text-md mt-2">138 calculations</div>
                    <div className="posts-container flex flex-col gap-2 py-4 pb-48">
                        <Post />
                        <Post />
                        <Post />
                        <Post />
                        <Post />
                    </div>
                </div>
            </Layout>
        </>
    );
}
