import type { AuthTokensResponse } from "@/lib/api";
import { NextResponse } from "next/server";

import { jwtSecondsUntilExpiry } from "./jwt-payload";

export const ACCESS_COOKIE = "dashboard_access";
export const REFRESH_COOKIE = "dashboard_refresh";

const DEFAULT_ACCESS_MAX_AGE = 3600;
const DEFAULT_REFRESH_MAX_AGE = 60 * 60 * 24 * 60;

function accessCookieMaxAge(tokens: AuthTokensResponse): number {
    if (tokens.expires_in != null && tokens.expires_in > 0) {
        return Math.max(120, tokens.expires_in);
    }
    const fromJwt = jwtSecondsUntilExpiry(tokens.token);
    if (fromJwt != null) {
        return Math.max(120, fromJwt);
    }
    return DEFAULT_ACCESS_MAX_AGE;
}

function refreshCookieMaxAge(tokens: AuthTokensResponse): number {
    if (
        tokens.refresh_token_expiration != null &&
        tokens.refresh_token_expiration > 0
    ) {
        const ttl = Math.floor(
            tokens.refresh_token_expiration - Date.now() / 1000,
        );
        if (ttl > 0) {
            return Math.max(120, ttl);
        }
    }
    return DEFAULT_REFRESH_MAX_AGE;
}

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
        maxAge: accessCookieMaxAge(tokens),
    });
    res.cookies.set(REFRESH_COOKIE, tokens.refresh_token, {
        httpOnly: true,
        secure,
        sameSite: "lax",
        path: "/",
        maxAge: refreshCookieMaxAge(tokens),
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
