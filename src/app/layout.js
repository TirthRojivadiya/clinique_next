import { Manrope, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const fontSans = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const fontDisplay = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
});

export const metadata = {
  title: "Clinique CMS",
  description: "Clinic queue management front-end",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${fontSans.variable} ${fontDisplay.variable} antialiased`}>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
