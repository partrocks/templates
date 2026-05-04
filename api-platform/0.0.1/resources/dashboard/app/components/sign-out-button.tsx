"use client";

export function SignOutButton() {
    async function signOut() {
        await fetch("/api/auth/logout", { method: "POST" });
        window.location.href = "/login";
    }

    return (
        <button
            type="button"
            onClick={() => void signOut()}
            style={{
                padding: "0.45rem 0.75rem",
                borderRadius: 8,
                border: "1px solid var(--border)",
                background: "transparent",
                color: "var(--text-muted)",
                fontSize: "0.82rem",
                fontWeight: 600,
                cursor: "pointer",
            }}
        >
            Sign out
        </button>
    );
}
