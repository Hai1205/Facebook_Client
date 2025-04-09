// import localFont from "next/font/local";
import "./globals.css";
// import { ThemeProvider } from "next-themes";
// import AuthWrapper from "./auth-wrapper";
import { Toaster } from "react-hot-toast";
import React from "react";

// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

// export const metadata = {
//   title: "Facebook",
//   description: "Making clone of Facebook",
// };

interface UserLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: UserLayoutProps) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        <Toaster/>
        {/* <ThemeProvider attribute="class">
          <AuthWrapper>
          {children}
          </AuthWrapper>
        </ThemeProvider> */}
        {children}
      </body>
    </html>
  );
}
