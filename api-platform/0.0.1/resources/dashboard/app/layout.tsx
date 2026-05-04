import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

export const metadata: Metadata = {
    title: "Dashboard",
    description: "Admin dashboard",
};

const themeBootstrap = `
(function(){
  try {
    if (localStorage.getItem('dashboard-theme') === 'light') {
      document.documentElement.setAttribute('data-theme','light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  } catch (e) {
    document.documentElement.removeAttribute('data-theme');
  }
})();`;

export default function RootLayout({
    children,
}: Readonly<{ children: ReactNode }>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body suppressHydrationWarning>
                <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
                {children}
            </body>
        </html>
    );
}
