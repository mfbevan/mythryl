"use client";

import { useWindowActions } from "~/components/windows/provider";
import { Button } from "~/components/ui/button";

export default function WindowsPage() {
  const { addWindow, minimizeAllWindows, removeAllWindows } =
    useWindowActions();

  return (
    <div className="space-y-6 p-8">
      <h1 className="text-2xl font-bold">Window Manager Demo</h1>

      <div className="space-y-4">
        <div>
          <h2 className="mb-2 text-lg font-semibold">Singleton Windows</h2>
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
          <h2 className="mb-2 text-lg font-semibold">Miniapp Windows</h2>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              onClick={() =>
                addWindow({ type: "miniapp", url: "https://warptown.com" })
              }
            >
              Open Warptown
            </Button>
            <Button
              variant="secondary"
              onClick={() =>
                addWindow({ type: "miniapp", url: "https://example.com" })
              }
            >
              Open example.com
            </Button>
            <Button
              variant="secondary"
              onClick={() =>
                addWindow({
                  type: "miniapp",
                  url: "https://myers-associate-ricky-hybrid.trycloudflare.com/demo",
                })
              }
            >
              Open Test
            </Button>
          </div>
        </div>

        <div>
          <h2 className="mb-2 text-lg font-semibold">Token Windows</h2>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              onClick={() =>
                addWindow({
                  type: "token",
                  chainId: 8453,
                  address: "0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed",
                })
              }
            >
              Open DEGEN (Base)
            </Button>
            <Button
              variant="secondary"
              onClick={() =>
                addWindow({
                  type: "token",
                  chainId: 8453,
                  address: "0x0578d8A44db98B23BF096A382e016e29a5Ce0ffe",
                })
              }
            >
              Open HIGHER (Base)
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
          <h2 className="mb-2 text-lg font-semibold">Actions</h2>
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
