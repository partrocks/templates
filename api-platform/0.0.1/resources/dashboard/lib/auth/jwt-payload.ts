/** Decode JWT payload (middle segment); does not verify signature. */
export function parseJwtPayload(token: string): Record<string, unknown> | null {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    try {
        const segment = parts[1];
        const padded =
            segment + "=".repeat((4 - (segment.length % 4)) % 4);
        const json = atob(padded.replace(/-/g, "+").replace(/_/g, "/"));
        return JSON.parse(json) as Record<string, unknown>;
    } catch {
        return null;
    }
}

/** Seconds remaining until JWT `exp`, or null if missing / expired. */
export function jwtSecondsUntilExpiry(token: string): number | null {
    const payload = parseJwtPayload(token);
    if (!payload) return null;
    const exp = payload.exp;
    if (typeof exp !== "number") return null;
    const ttl = Math.floor(exp - Date.now() / 1000);
    return ttl > 0 ? ttl : null;
}
