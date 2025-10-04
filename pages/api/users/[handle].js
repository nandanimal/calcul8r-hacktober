// pages/api/users/[handle].js
import prisma from "@/lib/prisma";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        res.setHeader("Allow", ["GET"]);
        return res.status(405).end("Method Not Allowed");
    }

    try {
        const { handle } = req.query;
        const { limit = "20", cursorCreatedAt, cursorId } = req.query;
        const take = Math.min(parseInt(limit, 10), 50);

        // Find the user by handle
        const user = await prisma.user.findUnique({
            where: { handle },
            select: {
                id: true,
                handle: true,
                displayName: true,
                avatarUrl: true,
                createdAt: true,
            },
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Build cursor condition for this user's timeline
        const cursorWhere =
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

        // Fetch posts for this user
        const posts = await prisma.post.findMany({
            where: { authorId: user.id, ...cursorWhere },
            orderBy: [{ createdAt: "desc" }, { id: "desc" }],
            take,
            select: {
                id: true,
                expression: true,
                result: true,
                createdAt: true,
                _count: { select: { likes: true, comments: true } },
            },
        });

        // Optional: total number of posts for this user (useful for UI counters)
        const postCount = await prisma.post.count({
            where: { authorId: user.id },
        });

        // Next cursor (if any)
        const last = posts[posts.length - 1];
        const nextCursor = last
            ? {
                  cursorCreatedAt: last.createdAt.toISOString(),
                  cursorId: last.id,
              }
            : null;

        return res.status(200).json({ user, posts, nextCursor, postCount });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to fetch profile" });
    }
}
