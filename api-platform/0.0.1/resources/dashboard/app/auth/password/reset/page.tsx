"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, type FormEvent } from "react";

import { AuthSplitLayout } from "../../../components/auth-split-layout";
import {
    errorStyle,
    inputStyle,
    labelStyle,
    primaryButtonStyle,
} from "../../../components/auth-field-styles";

function PasswordResetCompleteForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const selector =
        searchParams.get("selector") ?? searchParams.get("Selector") ?? "";
    const token =
        searchParams.get("token") ?? searchParams.get("Token") ?? "";

    const [password, setPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const missingToken = !selector || !token;

    async function onSubmit(e: FormEvent) {
        e.preventDefault();
        if (missingToken) return;
        setError(null);
        setSubmitting(true);
        try {
            const res = await fetch("/api/auth/password/reset", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ selector, token, password }),
            });
            const data = (await res.json()) as { message?: string };
            if (!res.ok) {
                setError(data.message ?? "Could not reset password.");
                return;
            }
            router.replace("/auth/password/reset/confirm");
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Could not reset password.",
            );
        } finally {
            setSubmitting(false);
        }
    }

    if (missingToken) {
        return (
            <AuthSplitLayout
                title="Reset link incomplete"
                subtitle="Open the reset link from your email, or request a new one."
                footer={
                    <Link
                        href="/auth/password/reset/request"
                        style={{ color: "var(--amber)", fontWeight: 600 }}
                    >
                        Request a new reset email
                    </Link>
                }
            >
                <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--text-muted)" }}>
                    <Link href="/login" style={{ color: "var(--amber)", fontWeight: 600 }}>
                        Sign in
                    </Link>
                </p>
            </AuthSplitLayout>
        );
    }

    return (
        <AuthSplitLayout
            title="Choose a new password"
            subtitle="Your reset link is valid for this browser session."
            footer={
                <Link href="/login" style={{ color: "var(--amber)", fontWeight: 600 }}>
                    Cancel and sign in
                </Link>
            }
        >
            <form onSubmit={onSubmit}>
                <div>
                    <label htmlFor="new-password" style={labelStyle}>
                        New password
                    </label>
                    <input
                        id="new-password"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        required
                        minLength={8}
                        value={password}
                        onChange={(ev) => setPassword(ev.target.value)}
                        style={inputStyle}
                    />
                </div>
                <button
                    type="submit"
                    disabled={submitting}
                    style={{
                        ...primaryButtonStyle,
                        opacity: submitting ? 0.72 : 1,
                        cursor: submitting ? "wait" : "pointer",
                    }}
                >
                    {submitting ? "Updating…" : "Update password"}
                </button>
                {error ? (
                    <div role="alert" style={errorStyle}>
                        {error}
                    </div>
                ) : null}
            </form>
        </AuthSplitLayout>
    );
}

export default function PasswordResetPage() {
    return (
        <Suspense
            fallback={
                <div
                    style={{
                        minHeight: "100vh",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "var(--bg)",
                        color: "var(--text-muted)",
                    }}
                >
                    Loading…
                </div>
            }
        >
            <PasswordResetCompleteForm />
        </Suspense>
    );
}
