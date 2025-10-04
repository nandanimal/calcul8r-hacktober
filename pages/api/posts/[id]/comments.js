// pages/api/posts/[id]/comments.js
import prisma from "@/lib/prisma";
import { auth0 } from "@/lib/auth0";

export default async function handler(req, res) {
    const { id: postId } = req.query;

    if (req.method === "POST") {
        const session = await auth0.getSession(req, res);
        if (!session)
            return res.status(401).json({ error: "Not authenticated" });

        const me = await prisma.user.findUnique({
            where: { auth0UserId: session.user.sub },
        });
        if (!me) return res.status(403).json({ error: "User missing" });

        try {
            const { body } = req.body || {};
            if (!body?.trim())
                return res.status(400).json({ error: "body required" });
            if (body.length > 1000)
                return res.status(400).json({ error: "Comment too long" });

            const comment = await prisma.comment.create({
                data: { postId, authorId: me.id, body },
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
            });

            const commentCount = await prisma.comment.count({
                where: { postId },
            });
            return res.status(201).json({ comment, commentCount });
        } catch (err) {
            if (err.code === "P2003") {
                return res
                    .status(400)
                    .json({ error: "Invalid postId (FK failed)" });
            }
            console.error(err);
            return res.status(500).json({ error: "Failed to add comment" });
        }
    }

    if (req.method === "GET") {
        // … your existing GET logic (unchanged)
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end("Method Not Allowed");
}
