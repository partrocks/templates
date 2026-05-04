import { getMeEmail } from "@/lib/auth/me-email";

import { DashboardShell } from "./components/dashboard-shell";

const demoUsers = [
    { name: "Alex Morgan", email: "alex@example.com", role: "Admin", status: "Active" },
    { name: "Jordan Lee", email: "jordan@example.com", role: "Editor", status: "Active" },
    { name: "Sam Rivera", email: "sam@example.com", role: "Viewer", status: "Invited" },
];

export default async function Home() {
    const email = await getMeEmail();

    return (
        <DashboardShell
            activeNav="users"
            headerTitle="Users management"
            headerRight={
                <span
                    title={email ?? undefined}
                    style={{
                        maxWidth: 280,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        fontSize: "0.75rem",
                        color: "var(--green)",
                        padding: "0.25rem 0.5rem",
                        borderRadius: 6,
                        background: "var(--green-dim)",
                        border: "1px solid var(--green-border)",
                    }}
                >
                    {email ?? "Signed in"}
                </span>
            }
        >
            <main
                id="users"
                style={{
                    flex: 1,
                    padding: "1.5rem",
                    overflow: "auto",
                }}
            >
                <section
                    style={{
                        maxWidth: 960,
                        background: "var(--bg-elevated)",
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius)",
                        padding: "1.25rem 1.35rem",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "flex-start",
                            justifyContent: "space-between",
                            gap: "1rem",
                            marginBottom: "1.15rem",
                        }}
                    >
                        <div>
                            <h2
                                style={{
                                    margin: 0,
                                    fontSize: "1.1rem",
                                    fontWeight: 650,
                                    letterSpacing: "-0.02em",
                                }}
                            >
                                Users
                            </h2>
                            <p
                                style={{
                                    margin: "0.35rem 0 0",
                                    fontSize: "0.85rem",
                                    color: "var(--text-muted)",
                                }}
                            >
                                Invite, roles, and access for your team.
                            </p>
                        </div>
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                            <input
                                type="search"
                                placeholder="Search users…"
                                aria-label="Search users"
                                style={{
                                    width: 200,
                                    padding: "0.45rem 0.65rem",
                                    borderRadius: 8,
                                    border: "1px solid var(--border)",
                                    background: "var(--bg)",
                                    color: "var(--text)",
                                    fontSize: "0.85rem",
                                    outline: "none",
                                }}
                            />
                            <button
                                type="button"
                                style={{
                                    padding: "0.45rem 0.9rem",
                                    borderRadius: 8,
                                    border: "1px solid var(--amber)",
                                    background: "var(--amber-dim)",
                                    color: "var(--amber)",
                                    fontSize: "0.85rem",
                                    fontWeight: 600,
                                    cursor: "pointer",
                                }}
                            >
                                Add user
                            </button>
                        </div>
                    </div>

                    <div style={{ overflowX: "auto" }}>
                        <table
                            style={{
                                width: "100%",
                                borderCollapse: "collapse",
                                fontSize: "0.85rem",
                            }}
                        >
                            <thead>
                                <tr
                                    style={{
                                        textAlign: "left",
                                        color: "var(--text-muted)",
                                        fontWeight: 600,
                                        fontSize: "0.72rem",
                                        letterSpacing: "0.04em",
                                        textTransform: "uppercase",
                                    }}
                                >
                                    <th style={{ padding: "0.65rem 0.5rem 0.65rem 0" }}>
                                        Name
                                    </th>
                                    <th style={{ padding: "0.65rem 0.5rem" }}>Email</th>
                                    <th style={{ padding: "0.65rem 0.5rem" }}>Role</th>
                                    <th style={{ padding: "0.65rem 0" }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {demoUsers.map((user) => (
                                    <tr
                                        key={user.email}
                                        style={{
                                            borderTop: "1px solid var(--border)",
                                        }}
                                    >
                                        <td
                                            style={{
                                                padding: "0.75rem 0.5rem 0.75rem 0",
                                                fontWeight: 550,
                                            }}
                                        >
                                            {user.name}
                                        </td>
                                        <td
                                            style={{
                                                padding: "0.75rem 0.5rem",
                                                color: "var(--text-muted)",
                                            }}
                                        >
                                            {user.email}
                                        </td>
                                        <td style={{ padding: "0.75rem 0.5rem" }}>
                                            {user.role}
                                        </td>
                                        <td style={{ padding: "0.75rem 0" }}>
                                            <span
                                                style={{
                                                    display: "inline-block",
                                                    padding: "0.2rem 0.5rem",
                                                    borderRadius: 6,
                                                    fontSize: "0.72rem",
                                                    fontWeight: 600,
                                                    ...(user.status === "Active"
                                                        ? {
                                                              color: "var(--green)",
                                                              background: "var(--green-dim)",
                                                              border: `1px solid var(--green-border)`,
                                                          }
                                                        : {
                                                              color: "var(--amber)",
                                                              background: "var(--amber-dim)",
                                                              border: `1px solid var(--amber-border)`,
                                                          }),
                                                }}
                                            >
                                                {user.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
        </DashboardShell>
    );
}
