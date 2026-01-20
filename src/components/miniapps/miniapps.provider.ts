import { toast } from "sonner";

export interface EthProviderRequest {
  method: string;
  params?: unknown[];
}

type EventCallback = (...args: unknown[]) => void;

/**
 * Creates an Ethereum provider bridge for mini apps.
 * Implements EIP-1193 provider interface with event support.
 */
export const createHostEthProvider = (walletAddress: string) => {
  const listeners: Map<string, Set<EventCallback>> = new Map();

  return {
    request: async ({ method, params }: EthProviderRequest): Promise<unknown> => {
      toast.info(`Eth Provider: ${method}`);

      switch (method) {
        case "eth_requestAccounts":
        case "eth_accounts":
          return [walletAddress];

        case "eth_chainId":
          // Base mainnet
          return "0x2105";

        case "net_version":
          // Base mainnet network ID
          return "8453";

        case "wallet_switchEthereumChain":
          // Already on Base, just acknowledge
          return null;

        case "personal_sign":
        case "eth_signTypedData":
        case "eth_signTypedData_v4":
          toast.warning(`Signing requested: ${method}`);
          // TODO: Connect to actual wallet signing
          throw new Error("Signing not yet implemented");

        case "eth_sendTransaction":
          toast.warning(`Transaction requested: ${method}`);
          // TODO: Connect to actual wallet transaction
          throw new Error("Transactions not yet implemented");

        default:
          toast.warning(`Unhandled eth method: ${method}`);
          throw new Error(`Method not supported: ${method}`);
      }
    },

    on: (event: string, callback: EventCallback) => {
      if (!listeners.has(event)) {
        listeners.set(event, new Set());
      }
      listeners.get(event)!.add(callback);
    },

    removeListener: (event: string, callback: EventCallback) => {
      listeners.get(event)?.delete(callback);
    },

    emit: (event: string, ...args: unknown[]) => {
      listeners.get(event)?.forEach((callback) => callback(...args));
    },
  };
};
