// pages/api/posts/[id]/like.js
import prisma from "@/lib/prisma";

export default async function handler(req, res) {
    const { id: postId } = req.query;

    if (req.method === "POST") {
        // Like a post
        try {
            const { userId } = req.body || {};
            if (!postId || !userId)
                return res
                    .status(400)
                    .json({ error: "postId and userId required" });

            // Ensure post exists (optional but nice)
            const post = await prisma.post.findUnique({
                where: { id: postId },
                select: { id: true },
            });
            if (!post) return res.status(404).json({ error: "Post not found" });

            await prisma.like
                .create({
                    data: { postId, userId },
                })
                .catch((e) => {
                    // Ignore duplicate like (unique constraint)
                    if (e.code !== "P2002") throw e;
                });

            const count = await prisma.like.count({ where: { postId } });
            return res.status(200).json({ ok: true, likeCount: count });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Failed to like post" });
        }
    }

    if (req.method === "DELETE") {
        // Unlike a post
        try {
            const { userId } = req.body || {};
            if (!postId || !userId)
                return res
                    .status(400)
                    .json({ error: "postId and userId required" });

            await prisma.like.deleteMany({ where: { postId, userId } });
            const count = await prisma.like.count({ where: { postId } });
            return res.status(200).json({ ok: true, likeCount: count });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Failed to unlike post" });
        }
    }

    res.setHeader("Allow", ["POST", "DELETE"]);
    return res.status(405).end("Method Not Allowed");
}
