import Link from "next/link";
import type { ReactNode } from "react";

import { SignOutButton } from "./sign-out-button";

export type DashboardNavKey = "overview" | "users" | "settings";

const navItems: { label: string; href: string; key: DashboardNavKey }[] = [
    { label: "Overview", href: "/", key: "overview" },
    { label: "Users", href: "/#users", key: "users" },
    { label: "Settings", href: "/settings", key: "settings" },
];

type DashboardShellProps = {
    activeNav: DashboardNavKey;
    headerEyebrow?: string;
    headerTitle: string;
    headerRight?: ReactNode;
    children: ReactNode;
};

export function DashboardShell({
    activeNav,
    headerEyebrow = "Workspace",
    headerTitle,
    headerRight,
    children,
}: DashboardShellProps) {
    return (
        <div
            style={{
                display: "flex",
                minHeight: "100vh",
                background: "var(--bg)",
                color: "var(--text)",
            }}
        >
            <aside
                style={{
                    width: 232,
                    flexShrink: 0,
                    background: "var(--bg-sidebar)",
                    borderRight: "1px solid var(--border)",
                    padding: "1.25rem 1rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.5rem",
                }}
            >
                <div style={{ padding: "0 0.5rem" }}>
                    <p
                        style={{
                            margin: 0,
                            fontSize: "0.65rem",
                            fontWeight: 700,
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                            color: "var(--text-muted)",
                        }}
                    >
                        Console
                    </p>
                    <p
                        style={{
                            margin: "0.35rem 0 0",
                            fontSize: "1.05rem",
                            fontWeight: 650,
                            letterSpacing: "-0.02em",
                        }}
                    >
                        Dashboard
                    </p>
                </div>
                <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {navItems.map((item) => {
                        const active = item.key === activeNav;
                        return (
                            <Link
                                key={item.key}
                                href={item.href}
                                style={{
                                    display: "block",
                                    padding: "0.55rem 0.75rem",
                                    borderRadius: 8,
                                    fontSize: "0.9rem",
                                    textDecoration: "none",
                                    color: active ? "var(--text)" : "var(--text-muted)",
                                    background: active ? "var(--amber-dim)" : "transparent",
                                    border: active
                                        ? "1px solid var(--amber-border)"
                                        : "1px solid transparent",
                                    fontWeight: active ? 600 : 500,
                                }}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
                <div style={{ marginTop: "auto", padding: "0 0.5rem" }}>
                    <p
                        style={{
                            margin: 0,
                            fontSize: "0.75rem",
                            color: "var(--text-muted)",
                            lineHeight: 1.45,
                        }}
                    >
                        A PartRocks Dashboard
                    </p>
                </div>
            </aside>

            <div
                style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    minWidth: 0,
                }}
            >
                <header
                    style={{
                        height: 56,
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "0 1.5rem",
                        borderBottom: "1px solid var(--border)",
                        background: "var(--bg-elevated)",
                    }}
                >
                    <div>
                        <p
                            style={{
                                margin: 0,
                                fontSize: "0.7rem",
                                fontWeight: 600,
                                letterSpacing: "0.08em",
                                textTransform: "uppercase",
                                color: "var(--text-muted)",
                            }}
                        >
                            {headerEyebrow}
                        </p>
                        <p
                            style={{
                                margin: "0.15rem 0 0",
                                fontSize: "0.95rem",
                                fontWeight: 600,
                            }}
                        >
                            {headerTitle}
                        </p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <SignOutButton />
                        {headerRight}
                    </div>
                </header>
                {children}
            </div>
        </div>
    );
}
