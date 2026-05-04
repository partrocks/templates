import { Suspense } from "react";

import LoginClient from "./login-client";

export default function LoginPage() {
    return (
        <Suspense
            fallback={
                <div
                    style={{
                        minHeight: "100vh",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "var(--bg)",
                        color: "var(--text-muted)",
                    }}
                >
                    Loading…
                </div>
            }
        >
            <LoginClient />
        </Suspense>
    );
}
