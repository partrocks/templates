"use client";

import { useEffect, useState, type CSSProperties } from "react";

type Appearance = "light" | "dark";

const STORAGE_KEY = "dashboard-theme";

function readTheme(): Appearance {
    if (typeof document === "undefined") return "dark";
    return document.documentElement.getAttribute("data-theme") === "light"
        ? "light"
        : "dark";
}

export function ThemeSwitcher() {
    const [theme, setTheme] = useState<Appearance>("dark");

    useEffect(() => {
        setTheme(readTheme());
    }, []);

    function apply(next: Appearance) {
        if (next === "light") {
            document.documentElement.setAttribute("data-theme", "light");
        } else {
            document.documentElement.removeAttribute("data-theme");
        }
        try {
            localStorage.setItem(STORAGE_KEY, next);
        } catch {
            /* ignore */
        }
        setTheme(next);
    }

    const segmentBase: CSSProperties = {
        flex: 1,
        padding: "0.4rem 0.85rem",
        border: "none",
        borderRadius: 7,
        fontSize: "0.82rem",
        fontWeight: 600,
        cursor: "pointer",
        background: "transparent",
        color: "var(--text-muted)",
        transition: "background 0.12s ease, color 0.12s ease",
    };

    return (
        <div
            role="group"
            aria-label="Appearance"
            style={{
                display: "inline-flex",
                padding: 3,
                borderRadius: 10,
                background: "var(--bg)",
                border: "1px solid var(--border)",
                gap: 2,
                minWidth: 220,
            }}
        >
            <button
                type="button"
                aria-pressed={theme === "light"}
                onClick={() => apply("light")}
                style={{
                    ...segmentBase,
                    ...(theme === "light"
                        ? {
                              background: "var(--amber-dim)",
                              color: "var(--amber)",
                              boxShadow: `inset 0 0 0 1px var(--amber-border)`,
                          }
                        : {}),
                }}
            >
                Light
            </button>
            <button
                type="button"
                aria-pressed={theme === "dark"}
                onClick={() => apply("dark")}
                style={{
                    ...segmentBase,
                    ...(theme === "dark"
                        ? {
                              background: "var(--amber-dim)",
                              color: "var(--amber)",
                              boxShadow: `inset 0 0 0 1px var(--amber-border)`,
                          }
                        : {}),
                }}
            >
                Dark
            </button>
        </div>
    );
}
