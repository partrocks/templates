import type { ReactNode } from "react";

type AuthSplitLayoutProps = {
    eyebrow?: string;
    title: string;
    subtitle?: ReactNode;
    children: ReactNode;
    footer?: ReactNode;
};

export function AuthSplitLayout({
    eyebrow = "PartRocks",
    title,
    subtitle,
    children,
    footer,
}: AuthSplitLayoutProps) {
    return (
        <div className="auth-split">
            <section
                style={{
                    flex: 1,
                    minWidth: 0,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    padding: "clamp(1.5rem, 4vw, 3rem)",
                    background: "var(--bg)",
                    borderRight: "1px solid var(--border)",
                }}
            >
                <div style={{ width: "100%", maxWidth: 400, margin: "0 auto" }}>
                    <p
                        style={{
                            margin: 0,
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            letterSpacing: "0.14em",
                            textTransform: "uppercase",
                            color: "var(--text-muted)",
                        }}
                    >
                        {eyebrow}
                    </p>
                    <h1
                        style={{
                            margin: "0.45rem 0 0",
                            fontSize: "1.65rem",
                            fontWeight: 650,
                            letterSpacing: "-0.03em",
                        }}
                    >
                        {title}
                    </h1>
                    {subtitle ? (
                        <div
                            style={{
                                marginTop: "0.5rem",
                                fontSize: "0.9rem",
                                color: "var(--text-muted)",
                                lineHeight: 1.5,
                            }}
                        >
                            {subtitle}
                        </div>
                    ) : null}
                    <div style={{ marginTop: "1.75rem" }}>{children}</div>
                    {footer ? (
                        <div
                            style={{
                                marginTop: "1.5rem",
                                fontSize: "0.85rem",
                                color: "var(--text-muted)",
                            }}
                        >
                            {footer}
                        </div>
                    ) : null}
                </div>
            </section>
            <aside
                className="auth-split-panel"
                style={{
                    flex: 1,
                    minWidth: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "clamp(1.25rem, 3vw, 2rem)",
                    background:
                        "linear-gradient(145deg, #12202e 0%, #0b2438 42%, #142a4a 100%)",
                }}
            >
                <p
                    style={{
                        margin: 0,
                        textAlign: "center",
                        fontSize: "clamp(1.75rem, 4.2vw, 3rem)",
                        fontWeight: 750,
                        letterSpacing: "-0.04em",
                        lineHeight: 1.15,
                        color: "#c8e9ff",
                        textShadow: "0 12px 48px rgba(0, 0, 0, 0.35)",
                    }}
                >
                    PartRocks:: Authentication
                </p>
            </aside>
        </div>
    );
}
