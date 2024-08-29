"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { open as openEmbed } from "@play-ai/web-embed";

export default function Home() {
  const [toggleOrSetMinimizedFunction, setToggleOrSetMinimizedFunction] =
    useState<((minimize?: boolean) => void) | null>(null);

  const webEmbedId = "your-web-embed-id";

  // open the Play AI embed
  useEffect(() => {
    const { setOrToggleMinimized } = openEmbed(webEmbedId);
    // save the minimize setter in a state variable
    setToggleOrSetMinimizedFunction(() => setOrToggleMinimized);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="flex h-1/4 flex-row items-center justify-center p-24 gap-4 mt-[-200px]">
        <button
          // if the minimize setter is defined, call it
          onClick={() => toggleOrSetMinimizedFunction?.()}
          className="bg-blue-500 text-white p-2 rounded-md"
        >
          Toggle Minimize
        </button>
        <button
          // if the minimize setter is defined, call it
          onClick={() => toggleOrSetMinimizedFunction?.(true)}
          className="bg-blue-500 text-white p-2 rounded-md"
        >
          Minimize Embed
        </button>
        <button
          // if the minimize setter is defined, call it
          onClick={() => toggleOrSetMinimizedFunction?.(false)}
          className="bg-blue-500 text-white p-2 rounded-md"
        >
          Unminimize Embed
        </button>
      </div>
    </main>
  );
}
