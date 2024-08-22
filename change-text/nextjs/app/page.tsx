"use client";

import { useEffect, useState } from "react";
import { open as openEmbed } from "@play-ai/web-embed";

const webEmbedId = "EJI3iftilUhHESLpMG9EC";

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
      when: "The user says what they want to change the text on the screen to",
      data: {
        text: { type: "string", description: "The text to change to" },
      },
    },
  ];

  // Define your event handler here
  const onEvent = (event: any) => {
    if (event.name === "change-text") {
      setText(event.data.text);
    }
    console.log("EVENT: ", event);
  };

  useEffect(() => {
    openEmbed(webEmbedId, { events, onEvent });
  }, []);

  return (
    <>
      <div className="flex justify-center items-center h-[70vh]">
        <div className="font-medium text-2xl">{text}</div>
      </div>
    </>
  );
}
