"use client";

import "./globals.css";
import { ReactNode } from "react";
// import { SessionProvider } from "next-auth/react";
import Provider from "@/components/provider";
import Navbar from "@/components/Navbar";


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
          <Provider>
            <Navbar />

            {children}
          </Provider>
         {/* Wrap children inside Providers */}
      </body>
    </html>
  );
}
