"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { AuthSplitLayout } from "../../../../components/auth-split-layout";

export default function PasswordResetConfirmPage() {
    const router = useRouter();

    useEffect(() => {
        const id = window.setTimeout(() => {
            router.replace("/");
        }, 600);
        return () => window.clearTimeout(id);
    }, [router]);

    return (
        <AuthSplitLayout
            title="Password updated"
            subtitle="You can sign in with your new password. Taking you to the dashboard…"
        >
            <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--text-muted)" }}>
                If you are not redirected,{" "}
                <button
                    type="button"
                    onClick={() => router.replace("/")}
                    style={{
                        padding: 0,
                        border: "none",
                        background: "none",
                        color: "var(--amber)",
                        fontWeight: 600,
                        cursor: "pointer",
                        font: "inherit",
                    }}
                >
                    continue to home
                </button>
                .
            </p>
        </AuthSplitLayout>
    );
}
