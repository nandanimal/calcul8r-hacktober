// pages/api/posts/[id]/like.js
import prisma from "@/lib/prisma";
import { auth0 } from "@/lib/auth0";

export default async function handler(req, res) {
    const { id: postId } = req.query;

    const session = await auth0.getSession(req, res);
    if (!session) return res.status(401).json({ error: "Not authenticated" });

    const me = await prisma.user.findUnique({
        where: { auth0UserId: session.user.sub },
    });
    if (!me) return res.status(403).json({ error: "User missing" });

    if (req.method === "POST") {
        try {
            await prisma.like
                .create({ data: { postId, userId: me.id } })
                .catch((e) => {
                    if (e.code !== "P2002") throw e;
                }); // ignore duplicate
            const count = await prisma.like.count({ where: { postId } });
            return res.status(200).json({ ok: true, likeCount: count });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Failed to like post" });
        }
    }

    if (req.method === "DELETE") {
        try {
            await prisma.like.deleteMany({ where: { postId, userId: me.id } });
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
