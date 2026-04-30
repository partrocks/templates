type QuoteItem = {
    id?: number;
    content?: string;
    author?: string | null;
};

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
        <main style={{ padding: "3rem", maxWidth: 720, margin: "0 auto" }}>
            <h1 style={{ marginBottom: "0.5rem" }}>{appName}</h1>
            <p style={{ color: "#666", marginTop: 0 }}>
                Next.js frontend &middot; Symfony / API Platform backend
            </p>

            <section style={{ marginTop: "2rem" }}>
                <h2>Quote of the Day</h2>
                {quote == null || !quote.content ? (
                    <p style={{ color: "#888" }}>
                        No quotes available. Is the API running at{" "}
                        <code>
                            {process.env["NEXT_PUBLIC_API_URL"] ??
                                "http://localhost:8000"}
                        </code>
                        ?
                    </p>
                ) : (
                    <blockquote
                        style={{
                            margin: "1rem 0 0",
                            padding: "1rem 1.25rem",
                            borderLeft: "4px solid #ccc",
                            background: "#f9f9f9",
                            fontSize: "1.1rem",
                            lineHeight: 1.5,
                        }}
                    >
                        <p style={{ margin: 0 }}>&ldquo;{quote.content}&rdquo;</p>
                        {quote.author ? (
                            <footer
                                style={{
                                    marginTop: "0.75rem",
                                    color: "#555",
                                    fontSize: "0.95rem",
                                }}
                            >
                                — {quote.author}
                            </footer>
                        ) : null}
                    </blockquote>
                )}
            </section>
        </main>
    );
}
