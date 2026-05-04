import { ACCESS_COOKIE, REFRESH_COOKIE } from "@/lib/auth/session-cookies";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

function isPublicPath(pathname: string): boolean {
    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/api/") ||
        pathname === "/favicon.ico"
    ) {
        return true;
    }
    if (pathname === "/login" || pathname === "/register") {
        return true;
    }
    if (pathname.startsWith("/auth/")) {
        return true;
    }
    return false;
}

function hasSession(request: NextRequest): boolean {
    return Boolean(
        request.cookies.get(ACCESS_COOKIE)?.value ||
        request.cookies.get(REFRESH_COOKIE)?.value,
    );
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (isPublicPath(pathname)) {
        const session = hasSession(request);
        if (session && (pathname === "/login" || pathname === "/register")) {
            return NextResponse.redirect(new URL("/", request.url));
        }
        return NextResponse.next();
    }

    if (!hasSession(request)) {
        const login = new URL("/login", request.url);
        login.searchParams.set("next", pathname);
        return NextResponse.redirect(login);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
