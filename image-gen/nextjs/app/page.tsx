"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import * as fal from "@fal-ai/serverless-client";
import { open as openEmbed } from "@play-ai/web-embed";
interface FalResult {
  images?: { url: string }[];
}

// configure the fal proxy, see the full documentation here: https://fal.ai/docs/integrations/nextjs
fal.config({
  proxyUrl: "/api/fal/proxy",
});

/*
 * this global variable is necessary for embed event handlers to access the current image url as react's useState hook
 * does not point to the same object in memory when updating a state variable
 */
let image_url = "";

export default function Home() {
  const [image, setImage] = useState<string | null>(null);

  async function callFalAPI(
    modelName: string,
    input: { prompt: string; image_url?: string }
  ) {
    const result = (await fal.subscribe(modelName, { input })) as FalResult;
    if (result?.images?.length && result?.images?.length > 0) {
      // store the image in state to update the image in the UI
      setImage(result.images[0].url);
      // store the image in a global variable to access in the embed event handlers for subsequent modifications
      image_url = result.images[0].url;
    }
  }

  async function generateImage(prompt: string) {
    // call the fal api to generate an image
    // we've chosen flux/schnell as it is very fast, but feel free to choose any text to image model
    await callFalAPI("fal-ai/flux/schnell", { prompt });
  }

  async function modifyImage(prompt: string, previousImage: string) {
    // call the fal api to modify the current image
    // we've chosen flux/dev/image-to-image as it is very fast, but feel free to choose any image to image model
    await callFalAPI("fal-ai/flux/dev/image-to-image", {
      prompt,
      image_url: previousImage,
    });
  }

  /* 
    This is the list of events that the agent can trigger.
    These events are used to trigger the image generation and modification functions we've defined.
  */
  const events = [
    {
      name: "generate-image",
      when: `the user wants to generate an image`,
      data: {
        userPrompt: { type: "string", description: "The user's desired image" },
      },
    },
    {
      name: "modify-image",
      when: `the user wants to modify an existing image`,
      data: {
        userPrompt: {
          type: "string",
          description: "The user's desired changes",
        },
      },
    },
  ];

  // this is the event handler for the embed
  // it is called whenever the agent sends an event to the embed
  const onEvent = async (event: any) => {
    console.log("event called", event);
    // event returns a stringified object with name and parameters
    const { name, data } = event;
    const { userPrompt } = data;
    if (!userPrompt) return;
    switch (name) {
      case "generate-image":
        await generateImage(userPrompt);
        break;
      case "modify-image":
        await modifyImage(userPrompt, image_url);
        break;
    }
  };

  const webEmbedId = "your-web-embed-id";

  useEffect(() => {
    // open the embed, passing in the events and event handler you've defined
    openEmbed(webEmbedId, { events, onEvent });
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <Image
        src={image ?? "/playcube.svg"}
        alt="Generated Image"
        width={image ? 500 : 300}
        height={image ? 500 : 300}
      />
    </main>
  );
}
