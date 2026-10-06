import { Inter } from "next/font/google";
import "./globals.css";
import App from "./App";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: {
    default: "3Z Shop",
    template: "%s | 3Z Shop",
  },
  description: "Shop products from 3Z Shop.",
  icons: {
    icon: "/assets/favicon.ico",
    shortcut: "/assets/favicon.ico",
    apple: "/assets/logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <App>{children}</App>
      </body>
    </html>
  );
}
