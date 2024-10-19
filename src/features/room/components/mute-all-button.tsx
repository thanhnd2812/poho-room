"use client";

import Hint from "@/components/hint";
import { useCall, useCallStateHooks } from "@stream-io/video-react-sdk";
import { useTranslations } from "next-intl";
import { BiVolumeMute } from "react-icons/bi";

const MuteAllButton = () => {
  const t = useTranslations("meetingRoom");
  const call = useCall();
    
  const { useLocalParticipant } = useCallStateHooks();
  const localParticipant = useLocalParticipant();

  const isMeetingOwner =
    localParticipant &&
    call?.state.createdBy &&
    (localParticipant.userId as string).includes(call.state.createdBy.id);

  if (!isMeetingOwner) return null;

  return (
    <Hint text={t("muteAll")}>
      <button
        onClick={async () => {
          await call.muteOthers("audio");
        }}
      >
        <div className="cursor-pointer rounded-2xl bg-[#ff3030] px-4 py-2 hover:bg-[#4c535b]">
          <BiVolumeMute size={20} className="text-white" />
        </div>
      </button>
    </Hint>
  );
};

export default MuteAllButton;
