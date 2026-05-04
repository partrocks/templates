import type { CSSProperties } from "react";

export const inputStyle: CSSProperties = {
    width: "100%",
    padding: "0.55rem 0.7rem",
    borderRadius: 8,
    border: "1px solid var(--border)",
    background: "var(--bg-elevated)",
    color: "var(--text)",
    fontSize: "0.9rem",
    outline: "none",
};

export const labelStyle: CSSProperties = {
    display: "block",
    fontSize: "0.78rem",
    fontWeight: 600,
    marginBottom: "0.35rem",
    color: "var(--text-muted)",
};

export const primaryButtonStyle: CSSProperties = {
    width: "100%",
    marginTop: "1.1rem",
    padding: "0.6rem 1rem",
    borderRadius: 8,
    border: "1px solid var(--amber-border)",
    background: "var(--amber-dim)",
    color: "var(--amber)",
    fontSize: "0.9rem",
    fontWeight: 650,
    cursor: "pointer",
};

export const errorStyle: CSSProperties = {
    marginTop: "0.85rem",
    padding: "0.55rem 0.65rem",
    borderRadius: 8,
    fontSize: "0.82rem",
    background: "rgba(239, 68, 68, 0.12)",
    border: "1px solid rgba(239, 68, 68, 0.35)",
    color: "#fca5a5",
};
