"use client";

interface MiniappWindowContentProps {
  url: string;
}

export function MiniappWindowContent({ url }: MiniappWindowContentProps) {
  return (
    <div className="p-4">
      <p className="text-sm text-muted-foreground">Miniapp: {url}</p>
    </div>
  );
}
