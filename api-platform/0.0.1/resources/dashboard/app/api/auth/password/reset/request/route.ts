import { ApiError, createApiService } from "@/lib/api";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as { email?: string };
        if (!body.email?.trim()) {
            return NextResponse.json(
                { message: "Email is required." },
                { status: 400 },
            );
        }

        const api = createApiService();
        const result = await api.requestPasswordReset({
            email: body.email.trim(),
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
