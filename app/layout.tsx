export const metadata = {
  title: "AJIO Discovery Engine",
  description: "AI-powered review discovery engine — deterministic aggregation + grounded LLM synthesis",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#ffffff" }}>{children}</body>
    </html>
  );
}
