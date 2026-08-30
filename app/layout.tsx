import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MK Legacy",
  description: "Premium products, delivered with trust",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      </head>
      <body>{children}</body>
    </html>
  );
}
