// pages/api/feed.js
import prisma from "@/lib/prisma";

export default async function handler(req, res) {
    try {
        const { cursorCreatedAt, cursorId, limit } = req.query;
        const take = Math.min(parseInt(limit || "20", 10), 50);

        // Build cursor pagination condition
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
                  }
                : {};

        const posts = await prisma.post.findMany({
            where,
            orderBy: [{ createdAt: "desc" }, { id: "desc" }],
            take,
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
                _count: {
                    select: { likes: true, comments: true },
                },
            },
        });

        // next cursor (if any)
        const last = posts[posts.length - 1];
        const nextCursor = last
            ? {
                  cursorCreatedAt: last.createdAt.toISOString(),
                  cursorId: last.id,
              }
            : null;

        return res.status(200).json({ posts, nextCursor });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to fetch feed" });
    }
}
