"use client";

import { useEffect } from "react";

const webEmbedSrc = "https://cdn.jsdelivr.net/npm/play-ai-embed";
const webEmbedId = "cqtpW3R1taG6kn7PZM2IB";

export default function Home() {
  useEffect(() => {
    // window?.PlayAI.open(webEmbedId, { events, onEvent });
    window?.PlayAI.open(webEmbedId);
  }, [() => window]);

  return (
    <>
      {/* Include play web embed library */}
      <script type="text/javascript" src={webEmbedSrc} async />
    </>
  );
}
