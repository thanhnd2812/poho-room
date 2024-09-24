"use client";

import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import {
  Channel,
  ChannelHeader,
  MessageInput,
  MessageList,
  useChatContext,
  Window,
} from "stream-chat-react";
import { useMediaQuery } from "usehooks-ts";
import { Button } from "./ui/button";

const DEFAULT_CHANNEL_TYPE = "livestream";

const channelType = process.env.STREAM_CHANNEL_TYPE ?? DEFAULT_CHANNEL_TYPE;

interface ChatSidebarProps {
  onClose: () => void;
  previousMeetingId?: string;
}
export const ChatSidebar = ({
  onClose,
  previousMeetingId,
}: ChatSidebarProps) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const params = useParams();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const roomId =
    previousMeetingId || (params.id as string) || searchParams.get("id");
  const { client, setActiveChannel } = useChatContext();
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDesktop && e.target === e.currentTarget) {
      onClose();
    }
  };
  useEffect(() => {
    if (roomId) {
      const channel = client.channel(channelType, roomId);
      channel.watch();
      setActiveChannel(channel);
    }
  }, [roomId, client, setActiveChannel]);

  return (
    <div
      onClick={handleBackdropClick}
      className={cn("fixed inset-0 z-50", {
        "bg-background/80 backdrop-blur-sm": pathname.includes("previous"),
      })}>
      <div className="fixed inset-y-0 right-0 w-full overflow-y-auto border-l bg-background shadow-lg md:w-96">
        <Channel>
          <Window>
            <ChannelHeader />
            <MessageList
              messageActions={["edit", "delete", "flag", "mute", "pin"]}
            />
            {!previousMeetingId && <MessageInput focus />}
          </Window>
        </Channel>
        <Button
          variant="ghost"
          onClick={onClose}
          className="absolute top-2 right-2"
          size="icon"
        >
          <X size={20} />
        </Button>
      </div>
    </div>
  );
};
