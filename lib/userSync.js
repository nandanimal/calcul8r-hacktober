// lib/userSync.js
import prisma from "@/lib/prisma";

function sanitizeHandle(s) {
    return (
        (s || "user")
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "")
            .slice(0, 20) || "user"
    );
}

// Call this from Node API routes (NOT middleware)
export async function ensureDbUserFromSession(session) {
    if (!session?.user?.sub) return null;

    const sub = session.user.sub;
    const displayName = session.user.name || session.user.nickname || "User";
    const avatarUrl = session.user.picture || null;

    // Already present?
    let user = await prisma.user.findUnique({ where: { auth0UserId: sub } });
    if (user) {
        // keep a couple fields in sync (optional)
        if (user.displayName !== displayName || user.avatarUrl !== avatarUrl) {
            user = await prisma.user.update({
                where: { auth0UserId: sub },
                data: { displayName, avatarUrl },
            });
        }
        return user;
    }

    // First time → generate a unique handle
    let base = sanitizeHandle(
        session.user.nickname || session.user.name || sub
    );
    let candidate = base,
        i = 0;
    // small scale => naive loop is fine
    // eslint-disable-next-line no-constant-condition
    while (true) {
        const taken = await prisma.user.findUnique({
            where: { handle: candidate },
        });
        if (!taken) break;
        i += 1;
        candidate = `${base}${i}`;
    }

    return prisma.user.create({
        data: { auth0UserId: sub, handle: candidate, displayName, avatarUrl },
    });
}
