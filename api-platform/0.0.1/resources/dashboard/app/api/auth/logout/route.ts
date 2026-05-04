import { clearAuthCookies } from "@/lib/auth/session-cookies";
import { NextResponse } from "next/server";

export async function POST() {
    const res = NextResponse.json({ ok: true });
    clearAuthCookies(res);
    return res;
}
