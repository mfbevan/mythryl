"use client";

import { useEffect, useState } from "react";
import sdk from "@farcaster/miniapp-sdk";
import type * as Context from "@farcaster/miniapp-core/dist/context";

export default function DemoPage() {
  const [isInMiniApp, setIsInMiniApp] = useState<boolean | null>(null);
  const [context, setContext] = useState<Context.MiniAppContext | null>(null);
  const [capabilities, setCapabilities] = useState<string[]>([]);
  const [chains, setChains] = useState<string[]>([]);
  const [logs, setLogs] = useState<string[]>([]);

  const log = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [`[${timestamp}] ${message}`, ...prev].slice(0, 50));
  };

  useEffect(() => {
    const init = async () => {
      try {
        const inMiniApp = await sdk.isInMiniApp();
        setIsInMiniApp(inMiniApp);
        log(`isInMiniApp: ${inMiniApp}`);

        if (inMiniApp) {
          // Call ready() immediately to hide splash screen
          await sdk.actions.ready();
          log("Called ready() - splash screen hidden");

          const ctx = await sdk.context;
          setContext(ctx);
          log(`Context loaded: fid=${ctx.user.fid}, username=${ctx.user.username}`);

          const caps = await sdk.getCapabilities();
          setCapabilities(caps);
          log(`Capabilities: ${caps.length} available`);

          const ch = await sdk.getChains();
          setChains(ch);
          log(`Chains: ${ch.join(", ")}`);
        }
      } catch (e) {
        log(`Init error: ${e instanceof Error ? e.message : String(e)}`);
      }
    };

    // Set up event listeners
    sdk.on("primaryButtonClicked", () => log("Event: primaryButtonClicked"));
    sdk.on("miniAppAdded", () => log("Event: miniAppAdded"));
    sdk.on("miniAppAddRejected", ({ reason }) => log(`Event: miniAppAddRejected - ${reason}`));
    sdk.on("miniAppRemoved", () => log("Event: miniAppRemoved"));
    sdk.on("notificationsEnabled", () => log("Event: notificationsEnabled"));
    sdk.on("notificationsDisabled", () => log("Event: notificationsDisabled"));
    sdk.on("backNavigationTriggered", () => log("Event: backNavigationTriggered"));

    void init();
  }, []);

  const actions = [
    {
      category: "Lifecycle",
      items: [
        {
          name: "ready()",
          action: async () => {
            await sdk.actions.ready();
            log("Called ready()");
          },
        },
        {
          name: "ready({ disableNativeGestures: true })",
          action: async () => {
            await sdk.actions.ready({ disableNativeGestures: true });
            log("Called ready({ disableNativeGestures: true })");
          },
        },
        {
          name: "close()",
          action: async () => {
            await sdk.actions.close();
            log("Called close()");
          },
        },
      ],
    },
    {
      category: "Navigation",
      items: [
        {
          name: "openUrl(https://farcaster.xyz)",
          action: async () => {
            await sdk.actions.openUrl("https://farcaster.xyz");
            log("Called openUrl()");
          },
        },
        {
          name: "viewProfile({ fid: 3 })",
          action: async () => {
            await sdk.actions.viewProfile({ fid: 3 });
            log("Called viewProfile({ fid: 3 })");
          },
        },
        {
          name: "viewCast({ hash: '0x...' })",
          action: async () => {
            await sdk.actions.viewCast({ hash: "0xa896c63fbc9a5019971e6c3f8c7b7e6e1e3a3a0a" });
            log("Called viewCast()");
          },
        },
        {
          name: "openMiniApp({ url: 'https://...' })",
          action: async () => {
            await sdk.actions.openMiniApp({ url: "https://yoink.party" });
            log("Called openMiniApp()");
          },
        },
      ],
    },
    {
      category: "Casting",
      items: [
        {
          name: "composeCast()",
          action: async () => {
            const result = await sdk.actions.composeCast();
            log(`composeCast result: ${JSON.stringify(result)}`);
          },
        },
        {
          name: "composeCast({ text: 'Hello!' })",
          action: async () => {
            const result = await sdk.actions.composeCast({ text: "Hello from Mythryl!" });
            log(`composeCast result: ${JSON.stringify(result)}`);
          },
        },
        {
          name: "composeCast({ close: true })",
          action: async () => {
            await sdk.actions.composeCast({ text: "Closing after cast", close: true });
            log("composeCast with close");
          },
        },
      ],
    },
    {
      category: "Authentication",
      items: [
        {
          name: "signIn({ nonce: 'test123' })",
          action: async () => {
            try {
              const result = await sdk.actions.signIn({ nonce: "test123" });
              log(`signIn result: ${JSON.stringify(result)}`);
            } catch (e) {
              log(`signIn error: ${e instanceof Error ? e.message : String(e)}`);
            }
          },
        },
      ],
    },
    {
      category: "Mini App Management",
      items: [
        {
          name: "addMiniApp()",
          action: async () => {
            try {
              const result = await sdk.actions.addMiniApp();
              log(`addMiniApp result: ${JSON.stringify(result)}`);
            } catch (e) {
              log(`addMiniApp error: ${e instanceof Error ? e.message : String(e)}`);
            }
          },
        },
      ],
    },
    {
      category: "Tokens",
      items: [
        {
          name: "viewToken({ token: 'eip155:8453/...' })",
          action: async () => {
            await sdk.actions.viewToken({
              token: "eip155:8453/erc20:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
            });
            log("Called viewToken()");
          },
        },
        {
          name: "sendToken()",
          action: async () => {
            try {
              const result = await sdk.actions.sendToken({
                token: "eip155:8453/erc20:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
                amount: "1000000",
              });
              log(`sendToken result: ${JSON.stringify(result)}`);
            } catch (e) {
              log(`sendToken error: ${e instanceof Error ? e.message : String(e)}`);
            }
          },
        },
        {
          name: "swapToken()",
          action: async () => {
            try {
              const result = await sdk.actions.swapToken({
                sellToken: "eip155:8453/erc20:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
                buyToken: "eip155:8453/native",
              });
              log(`swapToken result: ${JSON.stringify(result)}`);
            } catch (e) {
              log(`swapToken error: ${e instanceof Error ? e.message : String(e)}`);
            }
          },
        },
      ],
    },
    {
      category: "UI",
      items: [
        {
          name: "setPrimaryButton({ text: 'Click Me' })",
          action: async () => {
            await sdk.actions.setPrimaryButton({ text: "Click Me" });
            log("Set primary button");
          },
        },
        {
          name: "setPrimaryButton({ hidden: true })",
          action: async () => {
            await sdk.actions.setPrimaryButton({ text: "", hidden: true });
            log("Hidden primary button");
          },
        },
        {
          name: "setPrimaryButton({ loading: true })",
          action: async () => {
            await sdk.actions.setPrimaryButton({ text: "Loading...", loading: true });
            log("Set primary button loading");
          },
        },
      ],
    },
    {
      category: "Haptics",
      items: [
        {
          name: "impactOccurred('light')",
          action: async () => {
            await sdk.haptics.impactOccurred("light");
            log("Haptic: light impact");
          },
        },
        {
          name: "impactOccurred('medium')",
          action: async () => {
            await sdk.haptics.impactOccurred("medium");
            log("Haptic: medium impact");
          },
        },
        {
          name: "impactOccurred('heavy')",
          action: async () => {
            await sdk.haptics.impactOccurred("heavy");
            log("Haptic: heavy impact");
          },
        },
        {
          name: "notificationOccurred('success')",
          action: async () => {
            await sdk.haptics.notificationOccurred("success");
            log("Haptic: success notification");
          },
        },
        {
          name: "notificationOccurred('error')",
          action: async () => {
            await sdk.haptics.notificationOccurred("error");
            log("Haptic: error notification");
          },
        },
        {
          name: "selectionChanged()",
          action: async () => {
            await sdk.haptics.selectionChanged();
            log("Haptic: selection changed");
          },
        },
      ],
    },
    {
      category: "Wallet",
      items: [
        {
          name: "eth_accounts",
          action: async () => {
            try {
              const provider = await sdk.wallet.getEthereumProvider();
              if (provider) {
                const accounts = await provider.request({ method: "eth_accounts" });
                log(`eth_accounts: ${JSON.stringify(accounts)}`);
              } else {
                log("No ethereum provider");
              }
            } catch (e) {
              log(`eth_accounts error: ${e instanceof Error ? e.message : String(e)}`);
            }
          },
        },
        {
          name: "eth_chainId",
          action: async () => {
            try {
              const provider = await sdk.wallet.getEthereumProvider();
              if (provider) {
                const chainId = await provider.request({ method: "eth_chainId" });
                log(`eth_chainId: ${chainId}`);
              } else {
                log("No ethereum provider");
              }
            } catch (e) {
              log(`eth_chainId error: ${e instanceof Error ? e.message : String(e)}`);
            }
          },
        },
        {
          name: "eth_requestAccounts",
          action: async () => {
            try {
              const provider = await sdk.wallet.getEthereumProvider();
              if (provider) {
                const accounts = await provider.request({ method: "eth_requestAccounts" });
                log(`eth_requestAccounts: ${JSON.stringify(accounts)}`);
              } else {
                log("No ethereum provider");
              }
            } catch (e) {
              log(`eth_requestAccounts error: ${e instanceof Error ? e.message : String(e)}`);
            }
          },
        },
        {
          name: "personal_sign",
          action: async () => {
            try {
              const provider = await sdk.wallet.getEthereumProvider();
              if (provider) {
                const accounts = (await provider.request({ method: "eth_accounts" })) as `0x${string}`[];
                if (accounts[0]) {
                  // Message must be hex-encoded
                  const message = `0x${Buffer.from("Hello from Mythryl!").toString("hex")}` as `0x${string}`;
                  const sig = await provider.request({
                    method: "personal_sign",
                    params: [message, accounts[0]],
                  });
                  log(`personal_sign: ${sig}`);
                }
              }
            } catch (e) {
              log(`personal_sign error: ${e instanceof Error ? e.message : String(e)}`);
            }
          },
        },
      ],
    },
    {
      category: "Back Navigation",
      items: [
        {
          name: "back.show()",
          action: async () => {
            await sdk.back.show();
            log("Back button visible");
          },
        },
        {
          name: "back.hide()",
          action: async () => {
            await sdk.back.hide();
            log("Back button hidden");
          },
        },
        {
          name: "back.enableWebNavigation()",
          action: async () => {
            await sdk.back.enableWebNavigation();
            log("Web navigation enabled");
          },
        },
        {
          name: "back.disableWebNavigation()",
          action: async () => {
            await sdk.back.disableWebNavigation();
            log("Web navigation disabled");
          },
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Miniapp SDK Demo</h1>

        {/* Status */}
        <div className="bg-zinc-900 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold mb-2">Status</h2>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-zinc-400">In Mini App:</span>{" "}
              <span className={isInMiniApp ? "text-green-400" : "text-red-400"}>
                {isInMiniApp === null ? "checking..." : isInMiniApp ? "Yes" : "No"}
              </span>
            </div>
            {context && (
              <>
                <div>
                  <span className="text-zinc-400">FID:</span> {context.user.fid}
                </div>
                <div>
                  <span className="text-zinc-400">Username:</span> {context.user.username ?? "N/A"}
                </div>
                <div>
                  <span className="text-zinc-400">Platform:</span> {context.client.platformType}
                </div>
              </>
            )}
          </div>
          {capabilities.length > 0 && (
            <div className="mt-2">
              <span className="text-zinc-400 text-sm">Capabilities:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {capabilities.map((cap) => (
                  <span key={cap} className="bg-zinc-800 px-2 py-0.5 rounded text-xs">
                    {cap}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-6 mb-6">
          {actions.map((category) => (
            <div key={category.category}>
              <h2 className="text-lg font-semibold mb-2">{category.category}</h2>
              <div className="flex flex-wrap gap-2">
                {category.items.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      item.action().catch((e) => {
                        log(`Error: ${e instanceof Error ? e.message : String(e)}`);
                      });
                    }}
                    className="bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded text-sm transition-colors"
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Logs */}
        <div className="bg-zinc-900 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">Logs</h2>
            <button
              onClick={() => setLogs([])}
              className="text-xs text-zinc-400 hover:text-white"
            >
              Clear
            </button>
          </div>
          <div className="font-mono text-xs space-y-1 max-h-64 overflow-y-auto">
            {logs.length === 0 ? (
              <div className="text-zinc-500">No logs yet...</div>
            ) : (
              logs.map((log, i) => (
                <div key={i} className="text-zinc-300">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
