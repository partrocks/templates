import { cookies } from "next/headers";

import { createApiService } from "@/lib/api";

import { ACCESS_COOKIE } from "./session-cookies";

function extractEmail(me: Record<string, unknown>): string | null {
    if (typeof me.email === "string" && me.email.trim()) {
        return me.email.trim();
    }
    const user = me.user;
    if (
        user &&
        typeof user === "object" &&
        user !== null &&
        typeof (user as { email?: unknown }).email === "string"
    ) {
        const nested = (user as { email: string }).email.trim();
        return nested || null;
    }
    return null;
}

/** Loads GET /me using the httpOnly access cookie; returns email when present. */
export async function getMeEmail(): Promise<string | null> {
    const jar = await cookies();
    const token = jar.get(ACCESS_COOKIE)?.value;
    if (!token) return null;

    try {
        const api = createApiService();
        const me = await api.me(token);
        return extractEmail(me as Record<string, unknown>);
    } catch {
        return null;
    }
}
