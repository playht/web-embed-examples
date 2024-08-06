"use client"
import { useEffect, useState } from "react";
import Image from "next/image";
import * as fal from "@fal-ai/serverless-client";

fal.config({
  proxyUrl: "/api/fal/proxy",
});

interface FalResult {
  images?: { url: string }[];
}

export default function Home() {
  const [image, setImage] = useState<string>("https://fal.media/files/koala/Chls9L2ZnvuipUTEwlnJC.png")

  async function callFalAPI(modelName: string, input: { prompt: string; image_url?: string }) {
    const result = await fal.subscribe(modelName, {
      input,
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          update?.logs?.map((log) => log.message).forEach(console.log);
        }
      },
    }) as FalResult;
  
    if (result?.images?.length && result?.images?.length > 0) {
      setImage(result.images[0].url);
    }
  }
  
  async function generateImage(prompt: string) {
    await callFalAPI("fal-ai/flux/schnell", { prompt });
  }
  
  async function modifyImage(prompt: string, previousImage: string) {
    await callFalAPI("fal-ai/flux/dev", { prompt, image_url: previousImage });
  }

  const onEvent = async (ev: any) => {
    // event returns a stringified object with name and parameters
    const { name, parameters } = JSON.parse(ev?.payload ?? '{}');
    const { userPrompt } = parameters;
    if (!userPrompt) return;
    switch (name) {
      case 'generate-image':
        await generateImage(userPrompt);
        break;
      case 'modify-image':
        await modifyImage(userPrompt, image);
        break;
    }
  };

  const events = [
    {
      name: 'generate-image',
      description: `This function is called every time the user asks you to create or make or generate something`,
      parameters: {
        userPrompt: { type: 'string', description: "The user's desired image" }
      },
    },
    {
      name: 'modify-image',
      description: `This function is called every time the user asks you to change something about the current image. So if the user says something like "make it taller" or "make it green" or "add a sloth", use this tool`,
      parameters: {
        userPrompt: { type: 'string', description: "The user's desired changes" }
      },
    }
  ];

  // const scriptUrl = "https://cdn.jsdelivr.net/npm/play-ai-embed"
  const scriptUrl = "http://localhost:4304/index.js"
  const webEmbedId = "7a84d3cNElXiHS3pveLh8"

  const windowObj = typeof window !== 'undefined' ? window : undefined;
  
  useEffect(() => {
    // @ts-ignore
    windowObj?.PlayAI?.open(webEmbedId, { events, onEvent })
  }, [windowObj])
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <script type="text/javascript" src={scriptUrl} async></script>
     <Image src={image} alt="Generated Image" width={500} height={500} />
     <button className="bg-blue-500 text-white p-2 rounded-md" onClick={async () => generateImage('a brown dog')}>Test Fal</button>
    </main>
  );
}