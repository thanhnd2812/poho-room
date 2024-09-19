"use client";

import { getStreamToken } from "@/actions/stream.actions";
import Loader from "@/components/loader";
import { useProfile } from "@/hooks/use-profile";
import chatViTranslation from "@/languages/stream/chat-vi.json";
import viTranslation from "@/languages/stream/vi.json";
import { StreamVideo, StreamVideoClient } from "@stream-io/video-react-sdk";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import { Chat, Streami18n } from "stream-chat-react";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY!;
const i18nInstance = new Streami18n({
  language: "vi",
  translationsForLanguage: chatViTranslation,
  dayjsLocaleConfigForLanguage: {
    months: [
      "Tháng 1",
      "Tháng 2",
      "Tháng 3",
      "Tháng 4",
      "Tháng 5",
      "Tháng 6",
      "Tháng 7",
      "Tháng 8",
      "Tháng 9",
      "Tháng 10",
      "Tháng 11",
      "Tháng 12",
    ],
    monthsShort: [
      "Th1",
      "Th2",
      "Th3",
      "Th4",
      "Th5",
      "Th6",
      "Th7",
      "Th8",
      "Th9",
      "Th10",
      "Th11",
      "Th12",
    ],
    weekdays: [
      "Chủ Nhật",
      "Thứ Hai",
      "Thứ Ba",
      "Thứ Tư",
      "Thứ Năm",
      "Thứ Sáu",
      "Thứ Bảy",
    ],
    weekdaysShort: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
    weekdaysMin: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
    calendar: {
      sameDay: "[Hôm nay lúc] HH:mm",
      nextDay: "[Ngày mai lúc] HH:mm",
      nextWeek: "dddd [lúc] HH:mm",
      lastDay: "[Hôm qua lúc] HH:mm",
      lastWeek: "dddd [tuần trước lúc] HH:mm",
      sameElse: "DD/MM/YYYY",
    },
  },
});
const StreamVideoProvider = ({ children }: { children: React.ReactNode }) => {
  const [videoClient, setVideoClient] = useState<StreamVideoClient | null>(
    null
  );
  const [chatClient, setChatClient] = useState<StreamChat | null>(null);

  const { data: user, isLoading } = useProfile();
  const router = useRouter();
  const pathname = usePathname();
  // Determine the language based on the pathname
  const language = pathname?.startsWith("/vi") ? "vi" : "en";
  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      // Redirect to login if user is null or undefined
      router.push("/login");
      return;
    }

    if (!apiKey) throw new Error("No API key found");

    const client = new StreamVideoClient({
      apiKey,
      user: {
        id: user.uid,
        name: user.fullname,
        image: user.avatarUrl,
      },
      tokenProvider: getStreamToken,
    });
    setVideoClient(client);
    const chatClient = new StreamChat(apiKey);
    chatClient.connectUser(
      {
        id: user.uid,
        name: user.fullname,
        imageUrl: user.avatarUrl,
        language: language,
      },
      getStreamToken
    );

    setChatClient(chatClient);
    return () => {
      client.disconnectUser();
      chatClient.disconnectUser();
    };
  }, [user, isLoading, router]);

  if (!chatClient || !videoClient) return <Loader />;

  return (
    <Chat
      theme="str-chat__theme-dark"
      client={chatClient}
      i18nInstance={i18nInstance}
    >
      <StreamVideo
        client={videoClient}
        language={language}
        translationsOverrides={{
          vi: viTranslation,
        }}
      >
        {children}
      </StreamVideo>
    </Chat>
  );
};

export default StreamVideoProvider;
