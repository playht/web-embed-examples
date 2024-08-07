"use client";

import { useEffect, useState } from "react";

// const webEmbedSrc = "https://cdn.jsdelivr.net/npm/play-ai-embed";
const webEmbedSrc = "http://localhost:4304/index.js";
const webEmbedId = "LWI1mKeYlokyznhg56dV-";

/*
 * [Agent Greeting]
 * Hi, do you want me to help fill this form out for you?
 *
 * [Agent Prompt]
 * Your only job is to help the user fill out the form.
 * Do not do anything else. Do not offer to do anything else.
 * The list of form fields is provided to you. The first thing
 * you do is list out the form fields in the form.
 */

let globalFormValues: Record<string, { value: any }> = {};

export default function Home() {
  const formFields = [
    { key: "name", label: "Name", type: "text" },
    { key: "age", label: "Age", type: "text" },
    { key: "hobbies", label: "Hobbies", type: "text" },
  ];

  const [formValues, setFormValues] =
    useState<Record<string, { value: any }>>();
  useEffect(() => {
    // Initializes formValues based on formFields
    const initialFormValues = {} as Record<string, { value: any }>;
    formFields.forEach((field) => {
      if (field.type === "text") {
        initialFormValues[field.key] = { value: "" };
      }
    });

    setFormValues(initialFormValues);
    globalFormValues = initialFormValues;
  }, []);

  // Define your events here
  const events = [
    {
      name: "update-form-field",
      description: `This function is called with a key and value representing the form field to update and the value to update it to.`,
      parameters: {
        key: { type: "string", description: "The form field to update" },
        value: {
          type: "string",
          description: "The value to update the form field with",
        },
      },
    },
  ];
  // const events = [
  //   {
  //     name: "change-text",
  //     description:
  //       "This function is called with a string representing the text to change to",
  //     parameters: {
  //       text: { type: "string", description: "The text to change to" },
  //     },
  //   },
  // ];

  const systemMessage = `Here is a list of form fields: name, age, hobbies. Update the form while the user is talking`;

  // Define your event handler here
  const onEvent = (event: any) => {
    if (event.name === "update-form-field") {
      const newFormValues = {
        ...globalFormValues,
        [event.parameters.key]: { value: event.parameters.value },
      };
      setFormValues(newFormValues);
      globalFormValues = newFormValues;
    }
    console.log("EVENT: ", event);
  };

  useEffect(() => {
    // window?.PlayAI.open(webEmbedId, { events, onEvent });
    window?.PlayAI.open(webEmbedId, { events, onEvent, systemMessage });
    console.log("what no way");
    // window?.PlayAI.open(webEmbedId);
  }, [() => window]);

  return (
    <>
      {/* Include play web embed library */}
      <script type="text/javascript" src={webEmbedSrc} async />

      {formValues && (
        <div className="flex justify-center items-center h-[70vh]">
          <div className="flex flex-col gap-4 m-4 w-full sm:w-96 items-stretch">
            <div className="font-medium text-2xl">Form</div>
            {formFields.map((field) => {
              if (!formValues[field.key]) {
                return null;
              }

              return (
                <div key={field.key}>
                  <div className="mb-1">
                    <label htmlFor={field.key} className="text-sm">
                      {field.label}
                    </label>
                  </div>
                  <input
                    className="w-full border border-gray-300 p-2 rounded-md"
                    id={field.key}
                    type={field.type}
                    value={formValues[field.key].value}
                    onChange={(e) => {
                      setFormValues({
                        ...formValues,
                        [field.key]: { value: e.target.value },
                      });
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
