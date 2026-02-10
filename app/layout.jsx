import "./globals.css";

export const metadata = {
  title: "ConceptBench",
  description: "Bench-test AI product-design tools by comparing simulated tool outputs and evaluation agents.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
