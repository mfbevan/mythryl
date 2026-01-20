import type {
  MiniAppHost,
  MiniAppHostCapability,
  SetPrimaryButtonOptions,
} from "@farcaster/miniapp-core";
import type * as Context from "@farcaster/miniapp-core/dist/context";
import type * as ComposeCast from "@farcaster/miniapp-core/dist/actions/ComposeCast";
import type * as ViewCast from "@farcaster/miniapp-core/dist/actions/ViewCast";
import type * as ViewProfile from "@farcaster/miniapp-core/dist/actions/ViewProfile";
import type * as ViewToken from "@farcaster/miniapp-core/dist/actions/ViewToken";
import type * as SendToken from "@farcaster/miniapp-core/dist/actions/SendToken";
import type * as SwapToken from "@farcaster/miniapp-core/dist/actions/SwapToken";
import type * as OpenMiniApp from "@farcaster/miniapp-core/dist/actions/OpenMiniApp";
import type * as AddMiniApp from "@farcaster/miniapp-core/dist/actions/AddMiniApp";
import type * as SignIn from "@farcaster/miniapp-core/dist/actions/SignIn";
import type * as SignManifest from "@farcaster/miniapp-core/dist/actions/SignManifest";
import type * as Ready from "@farcaster/miniapp-core/dist/actions/Ready";
import type * as Haptics from "@farcaster/miniapp-core/dist/actions/Haptics";
import type * as Back from "@farcaster/miniapp-core/dist/back";
import { SiweMessage } from "siwe";
import { toast } from "sonner";

import type { MiniAppHostOptions } from "./miniapps.types";

/**
 * Creates the SDK implementation for mini app host actions.
 * Unimplemented actions show toasts for debugging.
 */
export const createMiniAppHostSDK = (
  options: MiniAppHostOptions,
  context: Context.MiniAppContext,
): Omit<MiniAppHost, "ethProviderRequestV2"> => ({
  context,

  close: () => {
    options.onClose();
  },

  ready: (_readyOptions?: Partial<Ready.ReadyOptions>) => {
    options.onReady();
  },

  openUrl: (url: string) => {
    window.open(url, "_blank");
  },

  composeCast: async <close extends boolean | undefined = undefined>(
    params: ComposeCast.Options<close>,
  ): Promise<ComposeCast.Result<close>> => {
    toast.info(`Mini App: composeCast - ${JSON.stringify(params)}`);
    // Return null cast for now (will connect to casting flow later)
    if (params.close) {
      options.onClose();
      return undefined as ComposeCast.Result<close>;
    }
    return { cast: null } as ComposeCast.Result<close>;
  },

  signIn: async (signInOptions: SignIn.SignInOptions): Promise<SignIn.SignInResult> => {
    const miniAppOrigin = new URL(options.miniAppUrl);

    // Create SIWE message with Farcaster-required format
    const siweMessage = new SiweMessage({
      domain: miniAppOrigin.host,
      address: options.account.address,
      statement: "Farcaster Auth",
      uri: miniAppOrigin.origin,
      version: "1",
      chainId: 10, // Farcaster uses Optimism for auth
      nonce: signInOptions.nonce,
      issuedAt: new Date().toISOString(),
      notBefore: signInOptions.notBefore,
      expirationTime: signInOptions.expirationTime,
      resources: [`farcaster://fid/${options.user.fid}`],
    });

    const message = siweMessage.prepareMessage();

    // Sign the message with the wallet
    const signature = await options.account.signMessage({ message });

    return {
      signature,
      message,
      authMethod: "custody",
    };
  },

  signManifest: async (params: SignManifest.SignManifestOptions): Promise<SignManifest.SignManifestResult> => {
    toast.info(`Mini App: signManifest - ${params.domain}`);
    return {
      header: "",
      payload: "",
      signature: "0x",
    };
  },

  viewProfile: async (params: ViewProfile.ViewProfileOptions): Promise<void> => {
    toast.info(`Mini App: viewProfile - fid: ${params.fid}`);
  },

  viewCast: async (params: ViewCast.ViewCastOptions): Promise<void> => {
    toast.info(`Mini App: viewCast - hash: ${params.hash}`);
  },

  viewToken: async (params: ViewToken.ViewTokenOptions): Promise<void> => {
    toast.info(`Mini App: viewToken - ${params.token}`);
  },

  sendToken: async (params: SendToken.SendTokenOptions): Promise<SendToken.SendTokenResult> => {
    toast.info(`Mini App: sendToken - ${JSON.stringify(params)}`);
    return {
      success: false,
      reason: "rejected_by_user",
    };
  },

  swapToken: async (params: SwapToken.SwapTokenOptions): Promise<SwapToken.SwapTokenResult> => {
    toast.info(`Mini App: swapToken - ${JSON.stringify(params)}`);
    return {
      success: false,
      reason: "rejected_by_user",
    };
  },

  openMiniApp: async (params: OpenMiniApp.OpenMiniAppOptions): Promise<void> => {
    toast.info(`Mini App: openMiniApp - ${params.url}`);
  },

  addFrame: async (): Promise<AddMiniApp.AddMiniAppResult> => {
    toast.info("Mini App: addFrame (deprecated)");
    return {};
  },

  addMiniApp: async (): Promise<AddMiniApp.AddMiniAppResult> => {
    toast.info("Mini App: addMiniApp");
    return {};
  },

  requestCameraAndMicrophoneAccess: async (): Promise<void> => {
    toast.info("Mini App: requestCameraAndMicrophoneAccess");
    throw new Error("Camera and microphone access not supported");
  },

  setPrimaryButton: (buttonOptions: SetPrimaryButtonOptions) => {
    toast.info(`Mini App: setPrimaryButton - ${buttonOptions.text}`);
  },

  ethProviderRequest: async ({ method, params }) => {
    toast.info(`Mini App: ethProviderRequest - ${method}`);
    // This is handled by the ethProvider passed to exposeToIframe
    throw new Error("Use ethProvider instead");
  },

  eip6963RequestProvider: () => {
    toast.info("Mini App: eip6963RequestProvider");
  },

  impactOccurred: async (type: Haptics.ImpactOccurredType): Promise<void> => {
    toast.info(`Mini App: haptics.impactOccurred - ${type}`);
  },

  notificationOccurred: async (type: Haptics.NotificationOccurredType): Promise<void> => {
    toast.info(`Mini App: haptics.notificationOccurred - ${type}`);
  },

  selectionChanged: async (): Promise<void> => {
    toast.info("Mini App: haptics.selectionChanged");
  },

  getCapabilities: async (): Promise<MiniAppHostCapability[]> => {
    return [
      "wallet.getEthereumProvider",
      "actions.ready",
      "actions.openUrl",
      "actions.close",
      "actions.setPrimaryButton",
      "actions.addMiniApp",
      "actions.signIn",
      "actions.viewCast",
      "actions.viewProfile",
      "actions.composeCast",
      "actions.viewToken",
      "actions.sendToken",
      "actions.swapToken",
      "actions.openMiniApp",
    ];
  },

  getChains: async (): Promise<string[]> => {
    return ["eip155:8453"];
  },

  updateBackState: async (state: Back.BackState): Promise<void> => {
    toast.info(`Mini App: updateBackState - visible: ${state.visible}`);
  },
});
