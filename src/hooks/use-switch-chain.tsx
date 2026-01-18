import { useMutation } from "@tanstack/react-query";
import {
  useActiveWalletChain,
  useSwitchActiveWalletChain,
} from "thirdweb/react";
import { resolveChain } from "~/services/chains.service";

export const useSwitchChain = (expectedChainId?: number) => {
  const chain = useActiveWalletChain();
  const switchChain = useSwitchActiveWalletChain();

  const correctChain = resolveChain(expectedChainId);
  const isCorrectChain = chain?.id === expectedChainId;

  const mutation = useMutation({
    mutationFn: async () => {
      if (!isCorrectChain) {
        await switchChain(resolveChain(expectedChainId));
      }
    },
  });

  return {
    isCorrectChain,
    correctChain,
    ...mutation,
  };
};
