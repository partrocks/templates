type QuoteItem = {
    id?: number;
    content?: string;
    author?: string | null;
};

const surface = "#ffffff";
const pageBg = "#f0f2f6";
const border = "#d8dee8";
const textMuted = "#5c6b7f";
const accent = "#0d9488";

async function fetchQuotes(): Promise<QuoteItem[]> {
    const apiUrl = process.env["NEXT_PUBLIC_API_URL"] ?? "http://localhost:8000";
    try {
        const res = await fetch(`${apiUrl}/api/quotes`, {
            headers: { Accept: "application/ld+json" },
            cache: "no-store",
        });
        if (!res.ok) return [];
        const json = (await res.json()) as {
            "hydra:member"?: QuoteItem[];
            member?: QuoteItem[];
        };
        return json["hydra:member"] ?? json.member ?? [];
    } catch {
        return [];
    }
}

function pickRandomQuote(quotes: QuoteItem[]): QuoteItem | null {
    if (quotes.length === 0) return null;
    const i = Math.floor(Math.random() * quotes.length);
    return quotes[i] ?? null;
}

export default async function Home() {
    const quotes = await fetchQuotes();
    const quote = pickRandomQuote(quotes);
    const appName = process.env["APP_NAME"] ?? "partrocks-app";

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
                    Part Rocks
                </h1>
                <p style={{ margin: "0 0 0.25rem", color: textMuted, fontSize: "1.05rem" }}>
                    {appName}
                </p>
                <p style={{ margin: 0, color: textMuted, fontSize: "0.95rem" }}>
                    This app is the browser UI. It talks to your Symfony / API Platform backend.
                </p>

                <section
                    style={{
                        marginTop: "2.25rem",
                        padding: "1.35rem 1.5rem",
                        backgroundColor: surface,
                        border: `1px solid ${border}`,
                        borderRadius: 12,
                        boxShadow: "0 1px 2px rgba(15, 23, 42, 0.06)",
                    }}
                >
                    <h2
                        style={{
                            margin: "0 0 1rem",
                            fontSize: "0.8rem",
                            fontWeight: 600,
                            textTransform: "uppercase",
                            letterSpacing: "0.07em",
                            color: textMuted,
                        }}
                    >
                        Quote of the day
                    </h2>
                    {quote == null || !quote.content ? (
                        <p style={{ margin: 0, color: textMuted, lineHeight: 1.6 }}>
                            No quotes available. Is the API running at{" "}
                            <code
                                style={{
                                    padding: "0.15rem 0.4rem",
                                    borderRadius: 4,
                                    backgroundColor: pageBg,
                                    border: `1px solid ${border}`,
                                    fontSize: "0.88em",
                                }}
                            >
                                {process.env["NEXT_PUBLIC_API_URL"] ??
                                    "http://localhost:8000"}
                            </code>
                            ?
                        </p>
                    ) : (
                        <blockquote
                            style={{
                                margin: 0,
                                padding: "0 0 0 1rem",
                                borderLeft: `4px solid ${accent}`,
                                fontSize: "1.1rem",
                                lineHeight: 1.55,
                            }}
                        >
                            <p style={{ margin: 0 }}>&ldquo;{quote.content}&rdquo;</p>
                            {quote.author ? (
                                <footer
                                    style={{
                                        marginTop: "0.75rem",
                                        color: textMuted,
                                        fontSize: "0.95rem",
                                    }}
                                >
                                    — {quote.author}
                                </footer>
                            ) : null}
                        </blockquote>
                    )}
                </section>
            </div>
        </main>
    );
}
