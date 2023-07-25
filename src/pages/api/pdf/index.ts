import { env } from "@/env.mjs";
import { utapi } from "uploadthing/server";

const CHAT_PDF_KEY = env.CHAT_PDF_KEY;
/*
    I think the chain should be this:
        1. Upload file to s3 bucket
        2. Get the url of the file
        3. Send the URL to ChatPDF Body so it can grab the data.
        4. Send the data to the user to then be requested to other API endpoints.
        5. Money.

* @see https://docs.uploadthing.com/api-reference/server
*/

const res = await fetch("https://api.chatpdf.com/v1/chats/message", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": `${CHAT_PDF_KEY}`,
  },
  body: JSON.stringify({
    // Grab from s3 bucket/uploadthing
    sourceId: "cha_5Rsi76X3E26xRlR2mU6Ca",
    messages: [
      {
        role: "user",
        content: "Can you tell me the purchase order number for this PO?",
      },
      {
        role: "user",
        content:
          "can you make me an array of dictionairies with the quantity and supplier item identifier and the unit price?",
      },
    ],
  }),
});

const data = await res.json();

const pattern = /```([^`]*?)```/s; // Regular expression to match text between triple backticks

const match = data.content.match(pattern); // Get the first match in the response

if (match && match.length > 1) {
  const jsonStr = match[1]; // Extract the text between the triple backticks
  try {
    const data = JSON.parse(jsonStr); // Parse the JSON data
    console.log(data);
  } catch (error) {
    console.error("Error parsing JSON:", error);
  }
} else {
  console.error("No JSON data found between triple backticks in the response.");
}
