"use client";

import { useEffect, useState } from "react";

// const webEmbedSrc = "https://cdn.jsdelivr.net/npm/play-ai-embed";
const webEmbedSrc = "http://localhost:4304/index.js";
const webEmbedId = "VQkN5p1ijeXxXeGrjx6ZL";

/*
 * [Agent Greeting]
 * Hello what do you want to change the text on the screen to?
 *
 * [Agent Prompt]
 * Your only job is to change the text on the page to a given string.
 * Do not do anything else. Do not offer to do anything else.
 * After changing the text, END THE CALL IMMEDIATELY.
 */

export default function Home() {
  const [text, setText] = useState("Change this text");

  // Define your events here
  const events = [
    {
      name: "change-text",
      description:
        "This function is called with a string representing the text to change to",
      parameters: {
        text: { type: "string", description: "The text to change to" },
      },
    },
  ];

  // Define your event handler here
  const onEvent = (event: any) => {
    if (event.name === "change-text") {
      setText(event.parameters.text);
    }
    console.log("EVENT: ", event);
  };

  useEffect(() => {
    window?.PlayAI.open(webEmbedId, { events, onEvent });
    // window?.PlayAI.open(webEmbedId);
  }, [() => window]);

  return (
    <>
      {/* Include play web embed library */}
      <script type="text/javascript" src={webEmbedSrc} async />

      <div className="flex justify-center items-center h-[70vh]">
        <div className="font-medium text-2xl">{text}</div>
      </div>
    </>
  );
}
