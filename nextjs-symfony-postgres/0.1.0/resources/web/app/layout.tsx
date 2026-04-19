import type { Metadata, ReactNode } from "next";

export const metadata: Metadata = {
    title: process.env["APP_NAME"] ?? "partrocks-app",
    description: "Next.js frontend for a Symfony / API Platform API",
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
