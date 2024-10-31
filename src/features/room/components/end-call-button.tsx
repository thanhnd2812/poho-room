"use client";

import Hint from "@/components/hint";
import { useCall, useCallStateHooks } from "@stream-io/video-react-sdk";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoMdCloseCircleOutline } from "react-icons/io";

const EndCallButton = () => {
  const t = useTranslations("meetingRoom");
  const call = useCall();
  const router = useRouter();

  const { useLocalParticipant } = useCallStateHooks();
  const localParticipant = useLocalParticipant();

  const isMeetingOwner =
    localParticipant &&
    call?.state.createdBy &&
    (localParticipant.userId as string).includes(call?.state.createdBy.id);

  const [isHost, setIsHost] = useState(isMeetingOwner || false);

  useEffect(() => {
    
    const isMeetingOwner =
      localParticipant &&
      call?.state.createdBy &&
      (localParticipant.userId as string).includes(call?.state.createdBy.id);
    setIsHost(isMeetingOwner || false);
    if (isMeetingOwner && call?.state.members.find(member => member.user_id === localParticipant.userId)?.role !== "host") {
      call?.updateCallMembers({
        update_members: [
          {
            user_id: localParticipant.userId,
            role: "host",
          },
        ],
      });
    }
  }, [call, localParticipant]);

  if (!isHost) return null;

  return (
    <Hint text={t("endCallForEveryone")}>
      <button
        onClick={async () => {
          await call?.endCall();
          router.push("/");
        }}
      >
        <div className="cursor-pointer rounded-2xl bg-[#ff3030] px-8 py-2 hover:bg-[#4c535b]">
          <IoMdCloseCircleOutline size={20} className="text-white" />
        </div>
      </button>
    </Hint>
  );
};

export default EndCallButton;
