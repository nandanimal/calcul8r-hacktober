// pages/api/posts/index.js
import prisma from "@/lib/prisma";

export default async function handler(req, res) {
    if (req.method === "POST") {
        try {
            const { authorId, expression, result } = req.body || {};

            if (!authorId || !expression || !result) {
                return res
                    .status(400)
                    .json({ error: "authorId, expression, result required" });
            }

            const post = await prisma.post.create({
                data: { authorId, expression, result },
            });

            return res.status(201).json({ post });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Failed to create post" });
        }
    }

    // (Optional) GET here could return feed, but we’ll keep feed on its own route for clarity
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end("Method Not Allowed");
}
