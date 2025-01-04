import { Urbanist } from "next/font/google";
import "./globals.css";

const font = Urbanist({
  subsets: ["latin"],
});

export const metadata = {
  title: "LogScope",
  description: "Analyze and Track trails in CyberSecurity logs",
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className={font.className}>{children}</body>
    </html>
  );
}
