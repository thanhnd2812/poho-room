import {
  AI_HISTORY_LIMIT_MESSAGES,
  AI_PROVIDERS,
  CHAT_GPT_MODEL,
  DEFAULT_AI_USER_ID,
  DEFAULT_CHANNEL_TYPE,
  STREAM_AI_CHANNEL_EVENT_TYPE
} from "@/constant/stream";
import { Hono } from "hono";
import OpenAI from "openai";
import { Channel, MessageResponse, StreamChat } from "stream-chat";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const apiSecret = process.env.STREAM_SECRET_KEY;
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const CHANNEL_TYPE = process.env.STREAM_CHANNEL_TYPE || DEFAULT_CHANNEL_TYPE;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function formatMessageForVisionAPI(msg: MessageResponse) {
  const imageMessages =
    msg.attachments
      ?.filter((att) => att.image_url)
      .map((att) => ({
        type: "image_url",
        image_url: {
          url: att.image_url,
        },
      })) || [];

  const textMessage = {
    role: "user",
    content: [
      {
        type: "text",
        text: `${msg.user?.name || "User"}: ${msg.text}`,
      },
      ...imageMessages,
    ],
  };

  return textMessage;
}

function formatMessage(msg: MessageResponse) {
  return {
    role: msg.user?.id === DEFAULT_AI_USER_ID ? "assistant" : "user",
    content: msg.text,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function* startStreaming(prompt: any[]) {
  const response = await openai.chat.completions.create({
    model: CHAT_GPT_MODEL,
    messages: [
      { role: "user", content: "You are a helpful meeting assistant." },
      ...prompt
    ],
    stream: true,
  });

  for await (const chunk of response) {
    yield chunk.choices[0].delta.content || "";
  }
}

async function startAiBotStreaming(client: StreamChat, channel: Channel, prompt: string, provider: AI_PROVIDERS) {
  // 1. Fetch channel history
  const limit = AI_HISTORY_LIMIT_MESSAGES; // Adjust this number based on how much history you want to include
  const messagesResponse = await channel.query({ messages: { limit } });
  const messages = messagesResponse.messages; // Reverse to get oldest first

  // 2. Format chat history
  const formattedHistory = messages
    .filter((msg) => msg.text)
    .map(formatMessage);

  // 1. create an empty message and mark it with 'isGptStreamed' custom property
  const message = await channel.sendMessage({
    user_id: DEFAULT_AI_USER_ID,
    type: "regular",
    // 1.1 flag to indicate the ui to render a streamed message
    isGptStreamed: true,
  });

  // give some time for the ui to render the streamed message
  // and attaches the event listeners
  await sleep(300);

  // 2. Listen for new response chunks from GPT. Send them as custom events
  // to the UI once they become available.
  let text = "";

  const contentStreamGenerator =
    provider === AI_PROVIDERS.OPENAI ? startStreaming : null;

  if (!contentStreamGenerator) {
    return;
  }

  const chunks = contentStreamGenerator(formattedHistory);

  for await (const chunk of chunks) {
    await channel.sendEvent({
      // @ts-expect-error - non-standard event, StreamedMessage subscribes to it
      type: STREAM_AI_CHANNEL_EVENT_TYPE,
      user_id: DEFAULT_AI_USER_ID,
      message_id: message.message.id,
      chunk,
    });
    text += chunk;
  }

  // 3. Once chunks are sent and full response (text) is aggregated,
  // update the message created in step 1 to include the full response.
  // This way, the response will be stored in the Stream API, and we can
  // use it later without having to go to ChatGPT again.
  await client.updateMessage(
    {
      id: message.message.id,
      // 3.1 flag to indicate the ui to stop rendering the streamed message
      isGptStreamed: false,
      // 3.2 store the full text in the message
      text,
    },
    DEFAULT_AI_USER_ID
  );
}

const app = new Hono()
  .post(
    "/stream/ai",
    async (c) => {
      if (!apiKey || !apiSecret) {
        return c.json(
          {
            success: false,
            message: "Internal server error",
          },
          500
        );
      }
      const client = new StreamChat(apiKey, apiSecret);

      // parse the request body
      const rawBody = await c.req.text();
      const isValid = client.verifyWebhook(rawBody, c.req.header("x-signature") as string);

      if (!isValid) {
        return c.json(
          {
            success: false,
            message: "Invalid signature",
          },
          400
        );
      }

      const body = JSON.parse(rawBody);
      if (!body) {
        return c.json(
          {
            success: false,
            message: "Invalid JSON",
          },
          400
        );
      }

      const event = body;

      if (event.type === "call.ended" || event.type === "call.session_ended") {
        // get call id, it's also the channel id
        const callId = event.call.id;
        const creatorId = event.call.created_by.id;
        if (creatorId !== callId) {
          return c.json(
            {
              success: true,
              message: "Not personal room",
            },
            200
          );
        }
        const channel = client.channel(CHANNEL_TYPE, callId);
        await channel.watch();
        await channel.truncate();
        return c.json(
          {
            success: true,
            message: "OK",
          },
          200
        );
      }

      if (
        event.type !== "message.new" ||
        !event.message ||
        event.message.user.id === DEFAULT_AI_USER_ID ||
        !event.channel_type ||
        !event.channel_id ||
        !event.channel_id.startsWith("ai-")
      ) {
        // we are interested only in new messages, from regular users
        return c.json(
          {
            success: false,
            message: "Not an ai message",
          },
          200
        );
      }

      // Think about what to do about it
      if (
        c.req.header("x-webhook-attempt") &&
        parseInt(c.req.header("x-webhook-attempt") as string) > 1
      ) {
        return c.json(
          {
            success: false,
            message: "Not a new message",
          },
          200
        );
      }

      const channel = client.channel(event.channel_type, event.channel_id);
      const prompt = event.message?.text;
      if (channel && prompt) {
        const provider = AI_PROVIDERS.DEFAULT;
        // start streaming in async mode
        await startAiBotStreaming(client, channel, prompt, provider).catch(
          (error) => {
            console.error("An error occurred", error);
          }
        );
      }

      return c.json(
        {
          success: true,
          message: "OK",
        },
        200
      );
    }
);

export default app;