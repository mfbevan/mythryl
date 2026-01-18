"use client";

import { useWindowActions } from "~/components/windows/provider";
import { Button } from "~/components/ui/button";

export default function WindowsPage() {
  const { addWindow, minimizeAllWindows, removeAllWindows } = useWindowActions();

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Window Manager Demo</h1>

      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">Singleton Windows</h2>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => addWindow({ type: "wallet" })}>
              Open Wallet
            </Button>
            <Button onClick={() => addWindow({ type: "message" })}>
              Open Messages
            </Button>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Miniapp Windows</h2>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              onClick={() => addWindow({ type: "miniapp", url: "https://example.com" })}
            >
              Open example.com
            </Button>
            <Button
              variant="secondary"
              onClick={() => addWindow({ type: "miniapp", url: "https://github.com" })}
            >
              Open github.com
            </Button>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Token Windows</h2>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              onClick={() =>
                addWindow({
                  type: "token",
                  chainId: 1,
                  address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
                })
              }
            >
              Open USDC (Ethereum)
            </Button>
            <Button
              variant="secondary"
              onClick={() =>
                addWindow({
                  type: "token",
                  chainId: 8453,
                  address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
                })
              }
            >
              Open USDC (Base)
            </Button>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Actions</h2>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={minimizeAllWindows}>
              Minimize All
            </Button>
            <Button variant="destructive" onClick={removeAllWindows}>
              Close All Windows
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
