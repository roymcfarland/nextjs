import "./globals.css";

export const metadata = {
  title: "Wholesale Portal",
  description: "B2B wholesale ordering",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
