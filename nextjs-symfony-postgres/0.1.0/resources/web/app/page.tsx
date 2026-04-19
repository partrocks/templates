async function fetchGreetings(): Promise<unknown[]> {
    const apiUrl = process.env["NEXT_PUBLIC_API_URL"] ?? "http://localhost:8000";
    try {
        const res = await fetch(`${apiUrl}/api/greetings`, {
            headers: { Accept: "application/ld+json" },
            cache: "no-store",
        });
        if (!res.ok) return [];
        const json = (await res.json()) as { "hydra:member"?: unknown[] };
        return json["hydra:member"] ?? [];
    } catch {
        return [];
    }
}

export default async function Home() {
    const greetings = await fetchGreetings();
    const appName = process.env["APP_NAME"] ?? "partrocks-app";

    return (
        <main style={{ padding: "3rem", maxWidth: 720, margin: "0 auto" }}>
            <h1 style={{ marginBottom: "0.5rem" }}>{appName}</h1>
            <p style={{ color: "#666", marginTop: 0 }}>
                Next.js frontend &middot; Symfony / API Platform backend
            </p>

            <section style={{ marginTop: "2rem" }}>
                <h2>Greetings from the API</h2>
                {greetings.length === 0 ? (
                    <p style={{ color: "#888" }}>
                        No greetings returned. Is the API running at{" "}
                        <code>
                            {process.env["NEXT_PUBLIC_API_URL"] ??
                                "http://localhost:8000"}
                        </code>
                        ?
                    </p>
                ) : (
                    <ul>
                        {greetings.map((g, i) => (
                            <li key={i}>{JSON.stringify(g)}</li>
                        ))}
                    </ul>
                )}
            </section>
        </main>
    );
}
