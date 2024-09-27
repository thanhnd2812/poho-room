"use client";

import { DEFAULT_CHANNEL_TYPE } from "@/constant/stream";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PiSparkleLight } from "react-icons/pi";
import {
  Channel,
  ChannelHeader,
  MessageInput,
  MessageList,
  useChatContext,
  Window,
} from "stream-chat-react";
import { useMediaQuery } from "usehooks-ts";
import Hint from "./hint";
import { StreamedMessage } from "./streamed-message";
import { Button } from "./ui/button";

const channelType = process.env.STREAM_CHANNEL_TYPE ?? DEFAULT_CHANNEL_TYPE;

interface ChatSidebarProps {
  onClose: () => void;
  previousMeetingId?: string;
}
export const ChatSidebar = ({
  onClose,
  previousMeetingId,
}: ChatSidebarProps) => {
  const t = useTranslations("meetingRoom");
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const params = useParams();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const roomId =
    previousMeetingId || (params.id as string) || searchParams.get("id");
  const [currentRoomId, setCurrentRoomId] = useState(roomId);
  const [isChatbot, setIsChatbot] = useState(false);
  const [aiRoomId, setAiRoomId] = useState("");

  const { client, setActiveChannel } = useChatContext();
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDesktop && e.target === e.currentTarget) {
      onClose();
    }
  };
  
  useEffect(() => {
    if (currentRoomId) {
      const channel = client.channel(channelType, currentRoomId);
      channel.watch();
      setActiveChannel(channel);
    }
  }, [currentRoomId, client, setActiveChannel, roomId]);

  useEffect(() => {
    if (!aiRoomId) {
     const randomUid = Math.random().toString(36).substring(2, 10);
     setAiRoomId(`ai-${roomId}-${randomUid}`);
    }
  }, [roomId, aiRoomId]);

  const toggleChatbot = () => {
    setIsChatbot(!isChatbot);
    setCurrentRoomId(isChatbot ? roomId : aiRoomId);
  };

  return (
    <div
      onClick={handleBackdropClick}
      className={cn("fixed inset-0 z-50", {
        "bg-background/80 backdrop-blur-sm": pathname.includes("previous"),
      })}
    >
      <div className="fixed inset-y-0 right-0 w-full overflow-y-auto border-l bg-background shadow-lg md:w-[500px]">
        <Channel>
          <Window>
            <ChannelHeader />
            <MessageList
              messageActions={["edit", "delete", "flag", "mute", "pin", "copy"]}
              Message={isChatbot ? StreamedMessage : undefined}
            />
            {!previousMeetingId && <MessageInput focus />}
          </Window>
        </Channel>
        <div className="flex">
          <Hint text={t("close")}>
            <Button
              variant="ghost"
              onClick={onClose}
              className="absolute top-2 right-2"
              size="icon"
            >
              <X size={20} />
            </Button>
          </Hint>
          {!previousMeetingId && (
            <Hint text={t("chatbot")}>
              <Button
                variant="ghost"
                onClick={toggleChatbot}
                className={cn("absolute top-2 right-12 hidden", {
                  "bg-primary text-white": isChatbot,
                })}
                size="icon"
              >
                <PiSparkleLight size={20} />
              </Button>
            </Hint>
          )}
        </div>
      </div>
    </div>
  );
};
