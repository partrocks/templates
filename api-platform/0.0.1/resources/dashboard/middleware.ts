import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { ACCESS_COOKIE } from "@/lib/auth/session-cookies";

const PUBLIC_PATH_PREFIXES = ["/login", "/register", "/auth"] as const;

function isPublicPath(pathname: string): boolean {
    if (pathname.startsWith("/api/auth/")) return true;
    return PUBLIC_PATH_PREFIXES.some(
        (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
    );
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (isPublicPath(pathname)) {
        return NextResponse.next();
    }

    if (!request.cookies.get(ACCESS_COOKIE)?.value) {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        const next = pathname + (request.nextUrl.search || "");
        url.searchParams.set("next", next || "/");
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
