// pages/api/posts/[id]/comments.js
import prisma from "@/lib/prisma";

export default async function handler(req, res) {
    const { id: postId } = req.query;

    if (req.method === "POST") {
        // Add a comment
        try {
            const { authorId, body } = req.body || {};
            if (!postId || !authorId || !body) {
                return res
                    .status(400)
                    .json({ error: "postId, authorId and body required" });
            }
            // Optional: small length guard
            if (body.length > 1000)
                return res.status(400).json({ error: "Comment too long" });

            // Ensure post exists (optional)
            const post = await prisma.post.findUnique({
                where: { id: postId },
                select: { id: true },
            });
            if (!post) return res.status(404).json({ error: "Post not found" });

            const comment = await prisma.comment.create({
                data: { postId, authorId, body },
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
            console.error(err);
            return res.status(500).json({ error: "Failed to add comment" });
        }
    }

    if (req.method === "GET") {
        // List comments (newest first) with simple pagination
        try {
            const { limit = "20", cursorCreatedAt, cursorId } = req.query;
            const take = Math.min(parseInt(limit, 10), 50);

            const where =
                cursorCreatedAt && cursorId
                    ? {
                          OR: [
                              { createdAt: { lt: new Date(cursorCreatedAt) } },
                              {
                                  createdAt: new Date(cursorCreatedAt),
                                  id: { lt: cursorId },
                              },
                          ],
                          postId,
                      }
                    : { postId };

            const comments = await prisma.comment.findMany({
                where,
                orderBy: [{ createdAt: "desc" }, { id: "desc" }],
                take,
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

            const last = comments[comments.length - 1];
            const nextCursor = last
                ? {
                      cursorCreatedAt: last.createdAt.toISOString(),
                      cursorId: last.id,
                  }
                : null;

            return res.status(200).json({ comments, nextCursor });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Failed to fetch comments" });
        }
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end("Method Not Allowed");
}
