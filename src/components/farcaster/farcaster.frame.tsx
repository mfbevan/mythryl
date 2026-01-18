"use client";

import { sdk } from "@farcaster/miniapp-sdk";
import { useEffect, useState } from "react";

export const SetupFrame = () => {
  const [isFrameSetup, setIsFrameSetup] = useState(false);

  useEffect(() => {
    if (!isFrameSetup) {
      setIsFrameSetup(true);
      void sdk.actions.ready({ disableNativeGestures: false });
      void sdk.wallet.ethProvider;
      void sdk.back.enableWebNavigation();
      void sdk.back.show();
    }
  }, [isFrameSetup]);

  return null;
};
