import type { Metadata } from "next";

import { DashboardShell } from "../components/dashboard-shell";
import { ThemeSwitcher } from "../components/theme-switcher";

export const metadata: Metadata = {
    title: "Settings · Dashboard",
};

export default function SettingsPage() {
    return (
        <DashboardShell activeNav="settings" headerTitle="Settings">
            <main
                style={{
                    flex: 1,
                    padding: "1.5rem",
                    overflow: "auto",
                }}
            >
                <section
                    style={{
                        maxWidth: 560,
                        background: "var(--bg-elevated)",
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius)",
                        padding: "1.25rem 1.35rem",
                    }}
                >
                    <h2
                        style={{
                            margin: 0,
                            fontSize: "1.1rem",
                            fontWeight: 650,
                            letterSpacing: "-0.02em",
                        }}
                    >
                        Appearance
                    </h2>
                    <p
                        style={{
                            margin: "0.35rem 0 1.1rem",
                            fontSize: "0.85rem",
                            color: "var(--text-muted)",
                            lineHeight: 1.5,
                        }}
                    >
                        Choose light or dark interface. Your preference is saved in this
                        browser.
                    </p>
                    <div
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "center",
                            gap: "0.75rem",
                        }}
                    >
                        <span
                            style={{
                                fontSize: "0.82rem",
                                fontWeight: 600,
                                color: "var(--text-muted)",
                                minWidth: 56,
                            }}
                        >
                            Theme
                        </span>
                        <ThemeSwitcher />
                    </div>
                </section>
            </main>
        </DashboardShell>
    );
}
