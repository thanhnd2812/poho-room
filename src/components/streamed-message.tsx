import { useEffect, useRef, useState } from "react";
import {
  MessageSimple,
  useChannelStateContext,
  useMessageContext
} from "stream-chat-react";
import { STREAM_AI_CHANNEL_EVENT_TYPE } from "../constant/stream";

export const StreamedMessage = () => {
  const { message } = useMessageContext();
  const { channel } = useChannelStateContext();

  // 1.1 flag to indicate the ui to render a streamed message, default to false
  // comes from the message object and is set in step 1.1 in OpenAI.ts
  const isGptStreamed = !!message.isGptStreamed;

  const [text, setText] = useState(isGptStreamed ? "" : message.text || "");

  useEffect(() => {
    if (!channel || !isGptStreamed) return;
    // @ts-expect-error - a custom event, emitted by step 2. of OpenAI.ts
    const subscription = channel.on(STREAM_AI_CHANNEL_EVENT_TYPE, (event) => {
      // ignore events for other messages
      if (event.message_id !== message.id) return;
      setText((prevText) => prevText + event.chunk);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [channel, isGptStreamed, message.id]);

  // Handles the streaming animation
  const pValue = useRef(isGptStreamed ? 0 : text.length);
  const [streamedText, setStreamedText] = useState(
    isGptStreamed ? "..." : text
  );

  useEffect(() => {
    const q = text.length;
    if (pValue.current >= q) return;

    const interval = setInterval(() => {
      const p = pValue.current;
      const batch = text.substring(p, p + 3);
      pValue.current += batch.length;
      setStreamedText((prevText) => prevText.replace(/^\.\.\./, "") + batch);
      if (p > q) {
        clearInterval(interval);
      }
    }, 33);

    return () => {
      clearInterval(interval);
    };
  }, [text]);

  return (
    <MessageSimple
      message={{ ...message!, text: streamedText }}
      
    />
  );
};
