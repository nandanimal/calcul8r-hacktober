// lib/requireAuth.js
import { auth0 } from "@/lib/auth0";

/**
 * Wrap a page with a server-side auth check.
 * If no session, redirects to /auth/login?returnTo=<current-url>.
 *
 * Usage:
 *   export const getServerSideProps = requireAuth();
 *   // or pass your own GSSP that receives (ctx, session)
 */
export function requireAuth(gssp) {
    return async (ctx) => {
        const session = await auth0.getSession(ctx.req, ctx.res);
        if (!session) {
            const returnTo = ctx.resolvedUrl || "/";
            return {
                redirect: {
                    destination: `/auth/login?returnTo=${encodeURIComponent(
                        returnTo
                    )}`,
                    permanent: false,
                },
            };
        }

        // If you passed a GSSP, run it and pass the session along
        if (typeof gssp === "function") {
            return gssp(ctx, session);
        }

        // Default: just render the page
        return { props: {} };
    };
}
