import { cookies } from "next/headers";

import { createApiService } from "@/lib/api";

import { ACCESS_COOKIE } from "./session-cookies";
import { parseJwtPayload } from "./jwt-payload";

function asTrimmedString(value: unknown): string | null {
    if (typeof value !== "string") return null;
    const t = value.trim();
    return t.length > 0 ? t : null;
}

function extractEmail(me: Record<string, unknown>): string | null {
    const top = asTrimmedString(me.email);
    if (top) return top;

    for (const key of ["user", "data", "profile", "account"] as const) {
        const nested = me[key];
        if (nested && typeof nested === "object" && nested !== null) {
            const inner = asTrimmedString(
                (nested as Record<string, unknown>).email,
            );
            if (inner) return inner;
        }
    }

    const preferred = asTrimmedString(me.preferred_username);
    if (preferred?.includes("@")) return preferred;

    const username = asTrimmedString(me.username);
    if (username?.includes("@")) return username;

    const sub = asTrimmedString(me.sub);
    if (sub?.includes("@")) return sub;

    const meta = me.user_metadata;
    if (meta && typeof meta === "object" && meta !== null) {
        const fromMeta = asTrimmedString(
            (meta as Record<string, unknown>).email,
        );
        if (fromMeta) return fromMeta;
    }

    return null;
}

function emailFromAccessToken(token: string): string | null {
    const payload = parseJwtPayload(token);
    return payload ? extractEmail(payload) : null;
}

/** Loads GET /me using the httpOnly access cookie; returns email when present. */
export async function getMeEmail(): Promise<string | null> {
    const jar = await cookies();
    const token = jar.get(ACCESS_COOKIE)?.value;
    if (!token) return null;

    try {
        const api = createApiService();
        const me = await api.me(token);
        const fromApi = extractEmail(me as Record<string, unknown>);
        if (fromApi) return fromApi;
    } catch {
        // e.g. unreachable API from the Next server — try JWT payload
    }

    return emailFromAccessToken(token);
}
