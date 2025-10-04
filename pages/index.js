import Header from "@/components/Header";
import Layout from "@/components/Layout";
import Post from "@/components/Post";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export default function Home() {
    return (
        <div>
            <Layout>
                <div className="text-center my-4">For you page</div>
                <div className="home-container p-3">
                    <div className="posts-container flex flex-col gap-2 pb-48">
                        <Post
                            user={"goat"}
                            expression={"4205 / 3"}
                            result={"100"}
                        />
                        <Post />
                        <Post />
                        <Post />
                        <Post />
                    </div>
                </div>
            </Layout>
            {/* <a href="/auth/login">Login</a> */}
        </div>
    );
}
