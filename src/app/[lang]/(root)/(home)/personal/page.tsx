"use client";

import { Button } from "@/components/ui/button";
import { useGetCallById } from "@/hooks/use-get-call-by-id";
import { useProfile } from "@/hooks/use-profile";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
const Table = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div className="flex flex-col gap-2 items-start">
      <h1 className="text-base font-medium text-sky-1 lg:text-xl xl:min-w-32">
        {title}
      </h1>
      <h1 className="truncate text-sm font-bold max-sm:max-w-[320px] lg:text-xl">
        {description}
      </h1>
    </div>
  );
};
const PersonalRoomPage = () => {
  const t = useTranslations("personalRoom");
  const client = useStreamVideoClient();
  const { data: user } = useProfile();
  const meetingId = user?.uid ?? "";
  const meetingLink = `${process.env.NEXT_PUBLIC_APP_URL}/rooms/${meetingId}?personal=true`;
  const { call } = useGetCallById(meetingId!);
  const router = useRouter();
  const startRoom = async () => {
    if (!client || !user) return;

    if (!call) {
      const newCall = client.call("default", meetingId);
      await newCall.getOrCreate({
        data: {
          starts_at: new Date().toISOString(),
        },
      });
    }
    router.push(`/rooms/${meetingId}?personal=true`);
  };

  return (
    <section className="flex size-full flex-col gap-10 text-white">
      <h1 className="text-3xl font-bold">{t("title")}</h1>
      <div className="flex w-full flex-col gap-8 xl:max-w-[900px]">
        <Table
          title={t("topic")}
          description={t("topicDescription", { username: user?.fullname })}
        />
        <Table title={t("meetingId")} description={meetingId} />
        <Table title={t("inviteLink")} description={meetingLink} />
      </div>
      <div className="flex gap-5">
        <Button
          onClick={startRoom} className="bg-blue-1 text-white">
          {t("startMeeting")}
        </Button>
        <Button
          onClick={() => {
            navigator.clipboard.writeText(meetingLink);
            toast.success("Copied to clipboard");
          }}
          className="bg-dark-3 dark:text-white"
        >
          {t("copyInviteLink")}
        </Button>
      </div>
    </section>
  );
};

export default PersonalRoomPage;
