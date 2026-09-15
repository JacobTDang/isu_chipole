import type { Metadata, Viewport } from "next";
import {
  Bricolage_Grotesque,
  Instrument_Sans,
  JetBrains_Mono,
} from "next/font/google";
import "./globals.css";
import { PhoneFrame } from "../components/PhoneFrame";
import { TabBar } from "../components/TabBar";
import { ToastProvider } from "../components/Toast";
import { AuthProvider } from "../state/AuthProvider";
import { BagProvider } from "../state/BagProvider";
import { OrdersProvider } from "../state/OrdersProvider";

const display = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: "800",
});

const body = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: ["400", "600"],
});

const ticket = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: "500",
});

export const metadata: Metadata = {
  title: "Andrew's",
  description: "Meal prep for Cyclones. Pick up on campus.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Andrew's",
  },
  icons: {
    apple: "/icons/apple-touch-icon.png",
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#C8102E",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${ticket.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <AuthProvider>
          <BagProvider>
            <OrdersProvider>
              <PhoneFrame>
                <ToastProvider>
                  {children}
                  <TabBar />
                </ToastProvider>
              </PhoneFrame>
            </OrdersProvider>
          </BagProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
