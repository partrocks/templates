import type { Metadata } from "next";
import type { ReactNode } from "react";

const appName = process.env["APP_NAME"] ?? "partrocks-app";

export const metadata: Metadata = {
    title: `${appName} · Part Rocks`,
    description:
        "PartRocks — Next.js frontend for the Symfony / API Platform template API.",
};

export default function RootLayout({
    children,
}: Readonly<{ children: ReactNode }>) {
    return (
        <html lang="en">
            <body
                style={{
                    margin: 0,
                    fontFamily:
                        "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
                }}
            >
                {children}
            </body>
        </html>
    );
}
