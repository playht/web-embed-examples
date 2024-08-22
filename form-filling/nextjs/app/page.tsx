"use client";

import { useEffect, useState } from "react";
import { open as openEmbed } from "@play-ai/web-embed";

const webEmbedId = "8_SaHYRigFrzZ5VDD4SOy";

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
    {
      key: "stars_1_to_5",
      label: "Star Rating (1-5)",
      type: "text",
      argType: "number",
    },
    {
      key: "review",
      label: "Leave a review!",
      type: "textarea",
      argType: "string",
    },
    {
      key: "come_back",
      label: "Would you come back?",
      type: "checkbox",
      argType: "boolean",
    },
  ];

  // Initialize formValues based on formFields
  const [formValues, setFormValues] =
    useState<Record<string, { value: any }>>();
  useEffect(() => {
    const initialFormValues = {} as Record<string, { value: any }>;
    formFields.forEach((field) => {
      if (field.type === "text" || field.type === "textarea") {
        initialFormValues[field.key] = { value: "" };
      } else if (field.type === "checkbox") {
        initialFormValues[field.key] = { value: false };
      }
    });
    setFormValues(initialFormValues);
  }, []);

  // Define your events here
  const events = [
    {
      name: "update-form-field",
      when: `The user gives a value for a form field`,
      data: {
        key: { type: "string", description: "The form field to update" },
        type: {
          type: "string",
          description:
            "The type of the form field (string, number, or boolean)",
        },
        stringValue: {
          type: "string",
          description:
            "The value to update the form field with, if it's a string value",
        },
        numberValue: {
          type: "number",
          description:
            "The value to update the form field with, if it's a number value",
        },
        booleanValue: {
          type: "boolean",
          description:
            "The value to update the form field with, if it's a boolean value",
        },
      },
    },
  ];

  // Give the agent the list of form fields as a prompt
  const prompt = `This form is for a restaurant review. Here is a list of form fields: ${formFields
    .map((field) => `${field.key} (${field.argType})`)
    .join(
      ", "
    )}. Call "update-form-field" IMMEDIATELY after the value for a form field is given.`;

  // Define your event handler here
  const onEvent = (event: any) => {
    if (event.name === "update-form-field") {
      let value = "";
      switch (event.data.type) {
        case "string":
          value = event.data.stringValue;
          break;
        case "number":
          value = event.data.numberValue;
          break;
        case "boolean":
          value = event.data.booleanValue;
          break;
      }

      // Update the form values
      setFormValues((oldFormValues) => {
        return {
          ...oldFormValues,
          [event.data.key]: {
            value,
          },
        };
      });
    }
    console.log("EVENT: ", event);
  };

  // Initialize the PlayAI web embed
  useEffect(() => {
    openEmbed(webEmbedId, {
      events,
      onEvent,
      prompt,
    });
  }, []);

  return (
    <>
      {formValues && (
        <div className="flex justify-center items-center h-[70vh]">
          <div className="flex flex-col gap-4 m-4 w-full sm:w-96 items-stretch">
            <div className="font-medium text-2xl">Restaurant Review</div>
            {formFields.map((field) => {
              if (!formValues[field.key]) {
                return null;
              }

              const label = (
                <div>
                  <label htmlFor={field.key} className="text-sm">
                    {field.label}
                  </label>
                </div>
              );

              switch (field.type) {
                case "text":
                  return (
                    <div key={field.key}>
                      {label}
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
                case "textarea":
                  return (
                    <div key={field.key}>
                      {label}
                      <textarea
                        className="w-full border border-gray-300 p-2 rounded-md"
                        id={field.key}
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
                case "checkbox":
                  return (
                    <div key={field.key} className="flex items-center gap-2">
                      <input
                        id={field.key}
                        type="checkbox"
                        checked={formValues[field.key].value}
                        onChange={(e) => {
                          setFormValues({
                            ...formValues,
                            [field.key]: { value: e.target.checked },
                          });
                        }}
                      />
                      {label}
                    </div>
                  );
              }

              return null;
            })}
          </div>
        </div>
      )}
    </>
  );
}
