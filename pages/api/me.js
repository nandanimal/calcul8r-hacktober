import { auth0 } from "@/lib/auth0"; // your existing v5 client
import { ensureDbUserFromSession } from "@/lib/userSync";

export default async function handler(req, res) {
    const session = await auth0.getSession(req, res);
    if (!session) return res.status(200).json({ user: null });

    const dbUser = await ensureDbUserFromSession(session);
    if (!dbUser)
        return res
            .status(500)
            .json({ user: null, error: "Session missing sub" });

    return res.status(200).json({
        user: {
            id: dbUser.id,
            handle: dbUser.handle,
            displayName: dbUser.displayName,
            avatarUrl: dbUser.avatarUrl,
        },
    });
}
