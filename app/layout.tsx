import "./globals.css";
import { WalletConnectionProvider } from "@/components/WalletConnectionProvider";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Cosmo Frontend",
  description: "Solana token tracker + transfer task",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <WalletConnectionProvider>
          <Toaster />
          {children}
        </WalletConnectionProvider>
      </body>
    </html>
  );
}
