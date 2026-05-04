import type { AuthTokensResponse } from "@/lib/api";
import { NextResponse } from "next/server";

export const ACCESS_COOKIE = "dashboard_access";
export const REFRESH_COOKIE = "dashboard_refresh";

export function applyAuthCookies(
    res: NextResponse,
    tokens: AuthTokensResponse,
): void {
    const secure = process.env.NODE_ENV === "production";
    res.cookies.set(ACCESS_COOKIE, tokens.token, {
        httpOnly: true,
        secure,
        sameSite: "lax",
        path: "/",
        maxAge: Math.max(120, tokens.expires_in),
    });
    res.cookies.set(REFRESH_COOKIE, tokens.refresh_token, {
        httpOnly: true,
        secure,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 60,
    });
}

export function clearAuthCookies(res: NextResponse): void {
    const secure = process.env.NODE_ENV === "production";
    for (const name of [ACCESS_COOKIE, REFRESH_COOKIE]) {
        res.cookies.set(name, "", {
            httpOnly: true,
            secure,
            sameSite: "lax",
            path: "/",
            maxAge: 0,
        });
    }
}
