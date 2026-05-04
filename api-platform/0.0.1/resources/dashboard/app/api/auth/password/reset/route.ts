import { ApiError, createApiService } from "@/lib/api";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as {
            selector?: string;
            token?: string;
            password?: string;
        };
        if (!body.selector?.trim() || !body.token?.trim() || !body.password) {
            return NextResponse.json(
                { message: "Selector, token, and password are required." },
                { status: 400 },
            );
        }

        const api = createApiService();
        const result = await api.completePasswordReset({
            selector: body.selector.trim(),
            token: body.token.trim(),
            password: body.password,
        });
        return NextResponse.json(result);
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
