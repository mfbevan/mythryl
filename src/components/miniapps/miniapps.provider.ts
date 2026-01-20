import type { Account } from "thirdweb/wallets";
import type { Chain } from "thirdweb/chains";
import { hexToString } from "thirdweb/utils";
import {
  getRpcClient,
  eth_call,
  eth_estimateGas,
  eth_getBalance,
  eth_getTransactionCount,
  eth_blockNumber,
  eth_getBlockByNumber,
  eth_getTransactionReceipt,
  eth_getLogs,
  eth_getCode,
} from "thirdweb/rpc";
import { client } from "~/services/thirdweb.service";

export interface EthProviderRequest {
  method: string;
  params?: unknown[];
}

type EventCallback = (...args: unknown[]) => void;

export interface HostEthProviderOptions {
  account: Account;
  chain: Chain;
}

/**
 * Creates an Ethereum provider bridge for mini apps.
 * Implements EIP-1193 provider interface with full wallet support via Thirdweb.
 */
export const createHostEthProvider = ({
  account,
  chain,
}: HostEthProviderOptions) => {
  const listeners = new Map<string, Set<EventCallback>>();

  const emit = (event: string, ...args: unknown[]) => {
    listeners.get(event)?.forEach((callback) => callback(...args));
  };

  const getChainIdHex = () => `0x${chain.id.toString(16)}`;

  const rpcRequest = getRpcClient({ client, chain });

  return {
    request: async ({
      method,
      params,
    }: EthProviderRequest): Promise<unknown> => {
      switch (method) {
        // Account methods
        case "eth_requestAccounts":
        case "eth_accounts":
          return [account.address];

        // Chain methods
        case "eth_chainId":
          return getChainIdHex();

        case "net_version":
          return String(chain.id);

        case "wallet_switchEthereumChain": {
          const [{ chainId }] = params as [{ chainId: string }];
          if (chainId === getChainIdHex()) {
            return null;
          }
          // Emit event for chain change request - host should handle this
          emit("chainChanged", chainId);
          return null;
        }

        case "wallet_addEthereumChain": {
          // Accept but don't actually add - just return success
          return null;
        }

        // Signing methods
        case "personal_sign": {
          const [message, address] = params as [string, string];
          if (address.toLowerCase() !== account.address.toLowerCase()) {
            throw new Error("Address mismatch");
          }
          const messageString = message.startsWith("0x")
            ? hexToString(message as `0x${string}`)
            : message;
          return await account.signMessage({ message: messageString });
        }

        case "eth_sign": {
          const [address, message] = params as [string, string];
          if (address.toLowerCase() !== account.address.toLowerCase()) {
            throw new Error("Address mismatch");
          }
          return await account.signMessage({
            message: { raw: message as `0x${string}` },
          });
        }

        case "eth_signTypedData":
        case "eth_signTypedData_v3":
        case "eth_signTypedData_v4": {
          const [address, typedDataJson] = params as [string, string];
          if (address.toLowerCase() !== account.address.toLowerCase()) {
            throw new Error("Address mismatch");
          }
          const typedData =
            typeof typedDataJson === "string"
              ? JSON.parse(typedDataJson)
              : typedDataJson;
          return await account.signTypedData(typedData);
        }

        // Transaction methods
        case "eth_sendTransaction": {
          const [txParams] = params as [
            {
              from: string;
              to: string;
              data?: string;
              value?: string;
              gas?: string;
              gasPrice?: string;
              maxFeePerGas?: string;
              maxPriorityFeePerGas?: string;
            },
          ];
          if (txParams.from.toLowerCase() !== account.address.toLowerCase()) {
            throw new Error("From address mismatch");
          }
          const result = await account.sendTransaction({
            to: txParams.to as `0x${string}`,
            data: txParams.data as `0x${string}` | undefined,
            value: txParams.value ? BigInt(txParams.value) : undefined,
            gas: txParams.gas ? BigInt(txParams.gas) : undefined,
            maxFeePerGas: txParams.maxFeePerGas
              ? BigInt(txParams.maxFeePerGas)
              : undefined,
            maxPriorityFeePerGas: txParams.maxPriorityFeePerGas
              ? BigInt(txParams.maxPriorityFeePerGas)
              : undefined,
            chainId: chain.id,
          });
          return result.transactionHash;
        }

        // RPC read methods - proxy to chain RPC
        case "eth_call": {
          const [callParams, blockTag] = params as [
            { to: string; data: string },
            string,
          ];
          return await eth_call(rpcRequest, {
            to: callParams.to as `0x${string}`,
            data: callParams.data as `0x${string}`,
            blockTag: blockTag as "latest" | "pending" | "earliest" | undefined,
          });
        }

        case "eth_estimateGas": {
          const [txParams] = params as [
            { from?: string; to: string; data?: string; value?: string },
          ];
          const gas = await eth_estimateGas(rpcRequest, {
            from: txParams.from as `0x${string}` | undefined,
            to: txParams.to as `0x${string}`,
            data: txParams.data as `0x${string}` | undefined,
          });
          return `0x${gas.toString(16)}`;
        }

        case "eth_getBalance": {
          const [address, blockTag] = params as [string, string];
          const balance = await eth_getBalance(rpcRequest, {
            address: address as `0x${string}`,
            blockTag: blockTag as "latest" | "pending" | "earliest" | undefined,
          });
          return `0x${balance.toString(16)}`;
        }

        case "eth_getTransactionCount": {
          const [address, blockTag] = params as [string, string];
          const count = await eth_getTransactionCount(rpcRequest, {
            address: address as `0x${string}`,
            blockTag: blockTag as "latest" | "pending" | "earliest" | undefined,
          });
          return `0x${count.toString(16)}`;
        }

        case "eth_blockNumber": {
          const blockNumber = await eth_blockNumber(rpcRequest);
          return `0x${blockNumber.toString(16)}`;
        }

        case "eth_getBlockByNumber": {
          const [blockTag, includeTransactions] = params as [string, boolean];
          return await eth_getBlockByNumber(rpcRequest, {
            blockTag: blockTag as "latest" | "pending" | "earliest",
            includeTransactions,
          });
        }

        case "eth_getTransactionReceipt": {
          const [txHash] = params as [string];
          return await eth_getTransactionReceipt(rpcRequest, {
            hash: txHash as `0x${string}`,
          });
        }

        case "eth_getLogs": {
          const [filterParams] = params as [
            {
              address?: string | string[];
              topics?: (string | string[] | null)[];
              fromBlock?: string;
              toBlock?: string;
            },
          ];
          // Handle single address case
          const address = Array.isArray(filterParams.address)
            ? (filterParams.address[0] as `0x${string}` | undefined)
            : (filterParams.address as `0x${string}` | undefined);
          return await eth_getLogs(rpcRequest, {
            address,
            topics: filterParams.topics as
              | (`0x${string}` | `0x${string}`[] | null)[]
              | undefined,
            fromBlock: filterParams.fromBlock
              ? BigInt(filterParams.fromBlock)
              : undefined,
            toBlock: filterParams.toBlock
              ? BigInt(filterParams.toBlock)
              : undefined,
          });
        }

        case "eth_getCode": {
          const [address, blockTag] = params as [string, string];
          return await eth_getCode(rpcRequest, {
            address: address as `0x${string}`,
            blockTag: blockTag as "latest" | "pending" | "earliest" | undefined,
          });
        }

        case "eth_gasPrice": {
          // Use a reasonable default or fetch from RPC
          return "0x" + (30000000000).toString(16); // 30 gwei
        }

        case "eth_getTransactionByHash": {
          const [txHash] = params as [string];
          // Thirdweb doesn't have a direct method, use raw RPC
          const response = await fetch(chain.rpc, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              jsonrpc: "2.0",
              id: 1,
              method: "eth_getTransactionByHash",
              params: [txHash],
            }),
          });
          const data = await response.json();
          return data.result;
        }

        case "eth_getBlockByHash": {
          const [blockHash, includeTransactions] = params as [string, boolean];
          const response = await fetch(chain.rpc, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              jsonrpc: "2.0",
              id: 1,
              method: "eth_getBlockByHash",
              params: [blockHash, includeTransactions],
            }),
          });
          const data = await response.json();
          return data.result;
        }

        case "eth_getStorageAt": {
          const [address, position, blockTag] = params as [
            string,
            string,
            string,
          ];
          const response = await fetch(chain.rpc, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              jsonrpc: "2.0",
              id: 1,
              method: "eth_getStorageAt",
              params: [address, position, blockTag],
            }),
          });
          const data = await response.json();
          return data.result;
        }

        case "wallet_getPermissions":
          return [{ parentCapability: "eth_accounts" }];

        case "wallet_requestPermissions":
          return [{ parentCapability: "eth_accounts" }];

        default:
          console.warn(`Unhandled eth method: ${method}`);
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

    emit,

    isMetaMask: false,
    isConnected: () => true,
    chainId: getChainIdHex(),
    selectedAddress: account.address,
  };
};

export type HostEthProvider = ReturnType<typeof createHostEthProvider>;
