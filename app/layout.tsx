import type { Metadata } from "next";
import { Mona_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Image from "next/image"; // ← Add this import

const monaSans = Mona_Sans({
    variable: "--font-mona-sans",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Questa",
    description: "Automated Role-Oriented Interview Question Generator from Job Descriptions.",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
        <body className={`${monaSans.className} antialiased pattern`}>
        {/* Added navigation bar with logo and sign-in/sign-up buttons */}
        <nav className="flex justify-between items-center p-6">
            <div className="flex items-center">
                {/* Replace with your actual logo path */}
                <Image
                    src="/logo.png" // ← Change this to your logo path
                    alt="Questa Logo"
                    width={120}
                    height={40}
                    className="h-8 w-auto"
                />
            </div>
            <div className="space-x-4">
                <a href="/sign-in" className="text-foreground hover:text-foreground/80 transition-colors">Sign In</a>
                <a href="/sign-up" className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">Sign Up</a>
            </div>
        </nav>

        {children}
        <Toaster />
        </body>
        </html>
    );
}