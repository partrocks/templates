"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { AuthSplitLayout } from "../components/auth-split-layout";
import {
    errorStyle,
    inputStyle,
    labelStyle,
    primaryButtonStyle,
} from "../components/auth-field-styles";

export default function RegisterPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function onSubmit(e: FormEvent) {
        e.preventDefault();
        setError(null);
        setSubmitting(true);
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = (await res.json()) as { message?: string };
            if (!res.ok) {
                setError(data.message ?? "Registration failed.");
                return;
            }
            router.replace("/");
            router.refresh();
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <AuthSplitLayout
            title="Create account"
            subtitle="Register to access the PartRocks dashboard."
            footer={
                <span>
                    Already registered?{" "}
                    <Link
                        href="/login"
                        style={{ color: "var(--amber)", fontWeight: 600 }}
                    >
                        Sign in
                    </Link>
                </span>
            }
        >
            <form onSubmit={onSubmit}>
                <div>
                    <label htmlFor="register-email" style={labelStyle}>
                        Email
                    </label>
                    <input
                        id="register-email"
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
                    <label htmlFor="register-password" style={labelStyle}>
                        Password
                    </label>
                    <input
                        id="register-password"
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
                    {submitting ? "Creating account…" : "Register"}
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
