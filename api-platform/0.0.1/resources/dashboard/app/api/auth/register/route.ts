import { ApiError, createApiService } from "@/lib/api";
import { applyAuthCookies } from "@/lib/auth/session-cookies";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as { email?: string; password?: string };
        if (!body.email || !body.password) {
            return NextResponse.json(
                { message: "Email and password are required." },
                { status: 400 },
            );
        }

        const api = createApiService();
        const tokens = await api.register({
            email: body.email,
            password: body.password,
        });

        const res = NextResponse.json({ ok: true });
        applyAuthCookies(res, tokens);
        return res;
    } catch (error) {
        if (error instanceof ApiError) {
            return NextResponse.json(
                { message: error.message },
                { status: error.status >= 400 ? error.status : 500 },
            );
        }
        throw error;
    }
}
