"use client";
import MeetingCard from "@/components/meeting-card";
import { useGetCalls } from "@/hooks/use-get-calls";
import { Call, CallRecording } from "@stream-io/video-react-sdk";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Loader from "./loader";

interface CallListProps {
  type: "upcoming" | "ended" | "recordings";
}

const CallList = ({ type }: CallListProps) => {
  const { endedCalls, upcomingCalls, callRecordings, isLoading } =
    useGetCalls();
  const t = useTranslations("callList");
  const router = useRouter();

  const [recordings, setRecordings] = useState<CallRecording[]>([]);

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
  const noCallsMessage = getNoCallsMessage();
  if (isLoading) return <Loader />;
  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      {calls && calls.length > 0 ? (
        calls.map((meeting: Call | CallRecording) => (
          <MeetingCard
            key={(meeting as Call).id}
            title={
              (meeting as Call).state?.custom?.description?.substring(0, 26) ||
              (meeting as CallRecording).filename?.substring(0, 20) ||
              "Personal Meeting"
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
            buttonIcon1={type === "recordings" ? "/icons/play.svg" : undefined}
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
                ? () => window.open((meeting as CallRecording).url, "_blank")
                : () => router.push(`/rooms/${(meeting as Call).id}`)
            }
          />
        ))
      ) : (
        <h1 className=" text-start text-gray-500 ">{noCallsMessage}</h1>
      )}
    </div>
  );
};

export default CallList;
