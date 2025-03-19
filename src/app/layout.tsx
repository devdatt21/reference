"use client";

import "./globals.css";
import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";



interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        <title>Reference - Credit Tracker</title>
      </head>
      <body>
        <SessionProvider>
            {children}
          
        </SessionProvider> {/* Wrap children inside Providers */}
      </body>
    </html>
  );
}
