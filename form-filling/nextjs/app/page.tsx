"use client";

import { useEffect, useState } from "react";

// const webEmbedSrc = "https://cdn.jsdelivr.net/npm/play-ai-embed";
const webEmbedSrc = "http://localhost:4304/index.js";
const webEmbedId = "LWI1mKeYlokyznhg56dV-";

/*
 * [Agent Greeting]
 * Hi, are you ready to fill out the form?
 *
 * [Agent Prompt]
 * Your only job is to help the user fill out the form.
 * Do not do anything else. Do not offer to do anything else.
 * The list of form fields is provided to you. Do not summarize
 * the contents of the form. After filling out the entire form,
 * END THE CALL IMMEDIATELY.
 */

export default function Home() {
  // Define the form fields
  const formFields = [
    { key: "name", label: "Name", type: "text", argType: "string" },
    { key: "age", label: "Age", type: "text", argType: "number" },
    { key: "hobbies", label: "Hobbies", type: "text", argType: "string" },
  ];

  // Initialize formValues based on formFields
  const [formValues, setFormValues] =
    useState<Record<string, { value: any }>>();
  useEffect(() => {
    const initialFormValues = {} as Record<string, { value: any }>;
    formFields.forEach((field) => {
      if (field.type === "text") {
        initialFormValues[field.key] = { value: "" };
      }
    });
    setFormValues(initialFormValues);
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
          description:
            "The value to update the form field with, if it's a string value",
        },
        numberValue: {
          type: "number",
          description:
            "The value to update the form field with, if it's a number value",
        },
      },
    },
  ];

  // Give the agent the list of form fields as context
  const context = `Here is a list of form fields: ${formFields
    .map((field) => `${field.key} (${field.argType})`)
    .join(
      ", "
    )}. Call "update-form-field" IMMEDIATELY after the value for a form field is given.`;

  // Define your event handler here
  const onEvent = (event: any) => {
    if (event.name === "update-form-field") {
      const value =
        event.parameters.value.length > 0
          ? event.parameters.value
          : event.parameters.numberValue;

      // Update the form values
      setFormValues((oldFormValues) => {
        return {
          ...oldFormValues,
          [event.parameters.key]: {
            value,
          },
        };
      });
    }
    console.log("EVENT: ", event);
  };

  useEffect(() => {
    window?.PlayAI.open(webEmbedId, {
      events,
      onEvent,
      context,
    });
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
