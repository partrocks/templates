"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

import { ApiError, createApiService } from "@/lib/api";

import { AuthSplitLayout } from "../../../../components/auth-split-layout";
import {
    errorStyle,
    inputStyle,
    labelStyle,
    primaryButtonStyle,
} from "../../../../components/auth-field-styles";

export default function PasswordResetRequestPage() {
    const [email, setEmail] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [done, setDone] = useState(false);

    async function onSubmit(e: FormEvent) {
        e.preventDefault();
        setError(null);
        setSubmitting(true);
        try {
            const api = createApiService();
            await api.requestPasswordReset({ email });
            setDone(true);
        } catch (err) {
            const message =
                err instanceof ApiError
                    ? err.message
                    : "Could not send reset email.";
            setError(message);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <AuthSplitLayout
            title="Reset password"
            subtitle={
                done
                    ? "If an account exists for that email, we sent reset instructions."
                    : "Enter your email and we will send a link to choose a new password."
            }
            footer={
                <Link href="/login" style={{ color: "var(--amber)", fontWeight: 600 }}>
                    Return to sign in
                </Link>
            }
        >
            {done ? (
                <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--text-muted)" }}>
                    You can close this tab or{" "}
                    <Link href="/login" style={{ color: "var(--amber)", fontWeight: 600 }}>
                        go back to sign in
                    </Link>
                    .
                </p>
            ) : (
                <form onSubmit={onSubmit}>
                    <div>
                        <label htmlFor="reset-email" style={labelStyle}>
                            Email
                        </label>
                        <input
                            id="reset-email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(ev) => setEmail(ev.target.value)}
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
                        {submitting ? "Sending…" : "Send reset link"}
                    </button>
                    {error ? (
                        <div role="alert" style={errorStyle}>
                            {error}
                        </div>
                    ) : null}
                </form>
            )}
        </AuthSplitLayout>
    );
}
