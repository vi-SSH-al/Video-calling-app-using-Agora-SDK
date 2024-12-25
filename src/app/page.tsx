"use client";
//@ts-nocheck
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Basics = dynamic(() => import("@/components/Basics"), { ssr: false });

export default function Home() {
  const [AgoraRTCProvider, setAgoraRTCProvider] = useState<any>(null);
  const [client, setClient] = useState<any>(null);

  useEffect(() => {
    // Use `import()` instead of `require()`
    Promise.all([
      import("agora-rtc-react"),
      import("agora-rtc-sdk-ng"), // Dynamically import Agora SDK
    ])
      .then(([rtcReact, AgoraRTC]) => {
        const newClient = AgoraRTC.default.createClient({
          mode: "rtc",
          codec: "vp8",
        });

        setAgoraRTCProvider(() => rtcReact.AgoraRTCProvider);
        setClient(newClient);
      })
      .catch((err) => console.error("Failed to load Agora SDK:", err));
  }, []);

  if (!AgoraRTCProvider || !client) {
    return <div>Loading...</div>; // Fallback for SSR
  }

  return (
    <AgoraRTCProvider client={client}>
      <Basics />
    </AgoraRTCProvider>
  );
}
