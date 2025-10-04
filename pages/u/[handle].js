import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function UserProfile() {
    const router = useRouter();
    const { handle } = router.query;
    const [data, setData] = useState(null);
    const [status, setStatus] = useState("loading");

    useEffect(() => {
        if (!handle) return;
        (async () => {
            setStatus("loading");
            const res = await fetch(`/api/users/${handle}`);
            if (!res.ok) {
                setStatus("error");
                return;
            }
            const json = await res.json();
            setData(json);
            setStatus("ready");
        })();
    }, [handle]);

    if (status === "loading")
        return (
            <main style={{ maxWidth: 640, margin: "2rem auto" }}>Loading…</main>
        );
    if (status === "error")
        return (
            <main style={{ maxWidth: 640, margin: "2rem auto" }}>
                Profile not found.
            </main>
        );

    const { user, posts } = data || {};

    return (
        <main style={{ maxWidth: 640, margin: "2rem auto", padding: "0 1rem" }}>
            <h1 style={{ fontSize: 24, fontWeight: 700 }}>
                {user.displayName}{" "}
                <span style={{ color: "#6b7280" }}>@{user.handle}</span>
            </h1>

            <section style={{ marginTop: 16 }}>
                {posts?.length ? (
                    posts.map((p) => (
                        <article
                            key={p.id}
                            style={{
                                padding: 12,
                                border: "1px solid #e5e7eb",
                                borderRadius: 8,
                                marginBottom: 12,
                            }}
                        >
                            <div style={{ fontFamily: "monospace" }}>
                                {p.expression}
                            </div>
                            <div style={{ fontWeight: 600 }}>= {p.result}</div>
                            <div
                                style={{
                                    marginTop: 6,
                                    fontSize: 12,
                                    color: "#6b7280",
                                }}
                            >
                                {new Date(p.createdAt).toLocaleString()} • ❤️{" "}
                                {p._count?.likes || 0} • 💬{" "}
                                {p._count?.comments || 0}
                            </div>
                        </article>
                    ))
                ) : (
                    <div style={{ color: "#6b7280" }}>No posts yet.</div>
                )}
            </section>
        </main>
    );
}
