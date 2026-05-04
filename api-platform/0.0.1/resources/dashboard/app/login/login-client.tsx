"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";

import { AuthSplitLayout } from "../components/auth-split-layout";
import {
    errorStyle,
    inputStyle,
    labelStyle,
    primaryButtonStyle,
} from "../components/auth-field-styles";

export default function LoginClient() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const nextPath = searchParams.get("next") || "/";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function onSubmit(e: FormEvent) {
        e.preventDefault();
        setError(null);
        setSubmitting(true);
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = (await res.json()) as { message?: string };
            if (!res.ok) {
                setError(data.message ?? "Sign in failed.");
                return;
            }
            router.replace(nextPath.startsWith("/") ? nextPath : "/");
            router.refresh();
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <AuthSplitLayout
            title="Sign in"
            subtitle="Use your PartRocks account to open the dashboard."
            footer={
                <span>
                    No account?{" "}
                    <Link
                        href="/register"
                        style={{ color: "var(--amber)", fontWeight: 600 }}
                    >
                        Create one
                    </Link>
                    {" · "}
                    <Link
                        href="/auth/password/reset/request"
                        style={{ color: "var(--amber)", fontWeight: 600 }}
                    >
                        Forgot password
                    </Link>
                </span>
            }
        >
            <form onSubmit={onSubmit}>
                <div>
                    <label htmlFor="login-email" style={labelStyle}>
                        Email
                    </label>
                    <input
                        id="login-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(ev) => setEmail(ev.target.value)}
                        style={inputStyle}
                    />
                </div>
                <div style={{ marginTop: "0.85rem" }}>
                    <label htmlFor="login-password" style={labelStyle}>
                        Password
                    </label>
                    <input
                        id="login-password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
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
                    {submitting ? "Signing in…" : "Sign in"}
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
