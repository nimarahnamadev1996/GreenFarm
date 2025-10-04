import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs'


import "./globals.css";
import CustomLayout from "@/layout-provider";
import { Toaster } from "react-hot-toast";



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GreenFarm",
  description: "A simple online marketplace for farmers to sell their products and for buyers to buy fresh organic foods.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
       <html lang="en">
         <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
           <CustomLayout>{children}</CustomLayout>
           <Toaster position='top-center' reverseOrder={false} />
          </body>
        </html>
    </ClerkProvider>
  );
}
