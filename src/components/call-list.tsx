"use client";
import MeetingCard from "@/components/meeting-card";
import { useGetCalls } from "@/hooks/use-get-calls";
import { cn } from "@/lib/utils";
import { Call, CallRecording } from "@stream-io/video-react-sdk";
import { formatRelative, startOfDay } from "date-fns";
import { vi } from "date-fns/locale";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ChatSidebar } from "./chat-sidebar";
import Loader from "./loader";
interface CallListProps {
  type: "upcoming" | "ended" | "recordings";
}
const formatRelativeDate = (date: Date, isVietnamese: boolean) => {
  const today = new Date();
  const relativeDate = formatRelative(startOfDay(date), today, {
    locale: isVietnamese ? vi : undefined,
  }).split(isVietnamese ? "vào" : "at")[0];
  return relativeDate.charAt(0).toUpperCase() + relativeDate.slice(1);
};

const CallList = ({ type }: CallListProps) => {
  const pathname = usePathname();
  const isVietnamese = pathname.startsWith("/vi");

  const [openRoomId, setOpenRoomId] = useState<string | null>(null);
  const { endedCalls, upcomingCalls, callRecordings, isLoading } =
    useGetCalls();
  const t = useTranslations("callList");
  const router = useRouter();

  const [recordings, setRecordings] = useState<CallRecording[]>([]);

  const groupCallsByDate = (calls: (Call | CallRecording)[]) => {
    const grouped = calls.reduce((acc, call) => {
      const date = new Date(
        (call as Call).state?.startsAt || (call as CallRecording).start_time
      );
      const dateKey = startOfDay(date).toISOString();
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(call);
      return acc;
    }, {} as Record<string, (Call | CallRecording)[]>);

    return Object.entries(grouped).sort(([a], [b]) => b.localeCompare(a));
  };

  const getCalls = () => {
    switch (type) {
      case "upcoming":
        return upcomingCalls;
      case "ended":
        return endedCalls;
      case "recordings":
        return recordings;
      default:
        return [];
    }
  };

  const getNoCallsMessage = () => {
    switch (type) {
      case "upcoming":
        return t("noUpcomingCalls");
      case "ended":
        return t("noEndedCalls");
      case "recordings":
        return t("noRecordings");
      default:
        return t("noCalls");
    }
  };

  const openPreviousMeetingChat = (roomId: string) => {
    setOpenRoomId(roomId);
  };

  useEffect(() => {
    const fetchRecordings = async () => {
      try {
        const callData = await Promise.all(
          callRecordings.map((meeting) => meeting.queryRecordings())
        );
        const recordings = callData
          .filter((call) => call.recordings.length > 0)
          .flatMap((call) => call.recordings);
        setRecordings(recordings);
      } catch (error) {
        toast.error(t("fetchRecordingsError"));
      }
    };
    if (type === "recordings") {
      fetchRecordings();
    }

  }, [callRecordings, type]);

  const calls = getCalls();
  const groupedCalls = groupCallsByDate(calls);
  const noCallsMessage = getNoCallsMessage();
  if (isLoading) return <Loader />;
  return (
    <div className="grid grid-cols-1  xl:grid-cols-2">
      <div
        className={cn("hidden ml-2", {
          "show-block": openRoomId,
        })}
      >
        <ChatSidebar
          onClose={() => setOpenRoomId(null)}
          previousMeetingId={openRoomId || undefined}
        />
      </div>
      {groupedCalls.length > 0 ? (
        groupedCalls.map(([date, calls]) => (
          <div key={date} className="flex flex-col gap-4">
            <h2 className="text-lg font-bold">
              {formatRelativeDate(new Date(date), isVietnamese)}
            </h2>
            {calls.map((meeting: Call | CallRecording) => (
              <MeetingCard
                key={(meeting as Call).id}
                title={
                  (meeting as Call).state?.custom?.description?.substring(
                    0,
                    26
                  ) ||
                  (meeting as CallRecording).filename?.substring(0, 20) ||
                  t("personalMeeting")
                }
                date={
                  (meeting as Call).state?.startsAt?.toLocaleString() ||
                  (meeting as CallRecording).start_time
                }
                icon={
                  type === "ended"
                    ? "/icons/previous.svg"
                    : type === "upcoming"
                    ? "/icons/upcoming.svg"
                    : "/icons/recordings.svg"
                }
                isPreviousMeeting={type === "ended"}
                buttonIcon1={
                  type === "recordings" ? "/icons/play.svg" : undefined
                }
                buttonText={type === "recordings" ? t("play") : t("start")}
                link={
                  type === "recordings"
                    ? (meeting as CallRecording).url
                    : `${process.env.NEXT_PUBLIC_APP_URL}/rooms/${
                        (meeting as Call).id
                      }`
                }
                handleClick={
                  type === "recordings"
                    ? () =>
                        window.open((meeting as CallRecording).url, "_blank")
                    : () => router.push(`/rooms/${(meeting as Call).id}`)
                }
                previousMeetingId={
                  type === "ended" ? (meeting as Call).id : undefined
                }
                openPreviousMeetingChat={
                  type === "ended" ? openPreviousMeetingChat : undefined
                }
              />
            ))}
          </div>
        ))
      ) : (
        <h1 className=" text-start text-gray-500 ">{noCallsMessage}</h1>
      )}
    </div>
  );
};

export default CallList;