const surface = "#ffffff";
const pageBg = "#f0f2f6";
const border = "#d8dee8";
const textMuted = "#5c6b7f";

export default async function Home() {
    return (
        <main
            style={{
                minHeight: "100vh",
                margin: 0,
                padding: "clamp(1.5rem, 5vw, 3rem)",
                backgroundColor: pageBg,
                color: "#0f172a",
                fontFamily:
                    "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
            }}
        >
            <div style={{ maxWidth: 720, margin: "0 auto" }}>
                <p
                    style={{
                        display: "inline-block",
                        margin: "0 0 0.85rem",
                        padding: "0.3rem 0.65rem",
                        borderRadius: 6,
                        backgroundColor: surface,
                        border: `1px solid ${border}`,
                        fontSize: "0.72rem",
                        fontWeight: 600,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        color: textMuted,
                    }}
                >
                    Next.js · frontend
                </p>
                <h1
                    style={{
                        margin: "0 0 0.35rem",
                        fontSize: "clamp(1.85rem, 4vw, 2.35rem)",
                        fontWeight: 700,
                        letterSpacing: "-0.02em",
                    }}
                >
                    [[ app.name ]] · PartRocks
                </h1>
                <p style={{ margin: 0, color: textMuted, fontSize: "0.95rem" }}>
                    This app is the browser UI. It talks to your Symfony / API
                    Platform backend.
                </p>
            </div>
        </main>
    );
}
