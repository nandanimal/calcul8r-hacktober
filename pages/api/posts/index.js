// pages/api/posts/index.js
import prisma from "@/lib/prisma";
import { auth0 } from "@/lib/auth0";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        res.setHeader("Allow", ["POST"]);
        return res.status(405).end("Method Not Allowed");
    }

    const session = await auth0.getSession(req, res);
    if (!session) return res.status(401).json({ error: "Not authenticated" });

    const me = await prisma.user.findUnique({
        where: { auth0UserId: session.user.sub },
        select: { id: true },
    });
    if (!me) return res.status(403).json({ error: "User missing" });

    const { expression, result } = req.body || {};
    if (!expression || result === undefined) {
        return res
            .status(400)
            .json({ error: "expression and result required" });
    }

    const post = await prisma.post.create({
        data: { authorId: me.id, expression, result: String(result) },
    });

    return res.status(201).json({ post });
}
