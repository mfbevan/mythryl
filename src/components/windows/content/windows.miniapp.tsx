"use client";

interface MiniappWindowContentProps {
  url: string;
}

export function MiniappWindowContent({ url }: MiniappWindowContentProps) {
  const fullUrl = url.startsWith("http") ? url : `https://${url}`;

  return (
    <iframe
      src={fullUrl}
      className="w-full h-full border-0"
      allow="clipboard-write; web-share"
      sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
    />
  );
}
