"use client";

import { getPublicStreamToken } from "@/actions/public-stream-token.actions";
import Loader from "@/components/loader";
import { useFakeUser } from "@/hooks/use-fake-user";
import { ResponseType, useProfile } from "@/hooks/use-profile";
import chatViTranslation from "@/languages/stream/chat-vi.json";
import enTranslation from "@/languages/stream/en.json";
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
const PublicStreamVideoProvider = ({ children }: { children: React.ReactNode }) => {
  const [videoClient, setVideoClient] = useState<StreamVideoClient | null>(
    null
  );
  const [chatClient, setChatClient] = useState<StreamChat | null>(null);

  const { data: realUser, isLoading } = useProfile();
  const { user: fakeUser } = useFakeUser();
  const router = useRouter();
  const pathname = usePathname();
  // Determine the language based on the pathname
  const language = pathname?.startsWith("/vi") ? "vi" : "en";
  const [user, setUser] = useState<ResponseType["data"] | null>(null);

  useEffect(() => {
    if (isLoading) return;
    if (realUser) {
      setUser(realUser);
    } else {
      setUser(fakeUser);
    }
  }, [realUser, fakeUser, isLoading]);

  useEffect(() => {
    if (isLoading) return;
    if (!user) return;
    if (!apiKey) throw new Error("No API key found");

    const client = new StreamVideoClient({
      apiKey,
      user: {
        id: user.uid,
        name: user.fullname,
        image: user.avatarUrl,
        type: "guest",
        language: language,
      },
      tokenProvider: async () => getPublicStreamToken(user.uid),
    });
    setVideoClient(client);
    const chatClient = new StreamChat(apiKey);
    chatClient.connectUser(
      {
        id: user.uid,
        name: user.fullname,
        imageUrl: user.avatarUrl,
        language: language,
        type: "guest",
      },
      async () => getPublicStreamToken(user.uid)
    );

    setChatClient(chatClient);
    return () => {
      client.disconnectUser();
      chatClient.disconnectUser();
    };
  }, [user, isLoading, router, language]);

  if (!chatClient || !videoClient) return <Loader />;

  return (
    <Chat
      theme="str-chat__theme-dark"
      client={chatClient}
      i18nInstance={language === "vi" ? i18nInstance : undefined}
    >
      <StreamVideo
        client={videoClient}
        language={language === "vi" ? "vi" : "en"}
        translationsOverrides={{
          vi: viTranslation,
          en: enTranslation,
        }}
      >
        {children}
      </StreamVideo>
    </Chat>
  );
};

export default PublicStreamVideoProvider;
