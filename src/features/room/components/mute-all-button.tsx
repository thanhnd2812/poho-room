"use client";

import { Button } from "@/components/ui/button";
import { useCall, useCallStateHooks } from "@stream-io/video-react-sdk";

const MuteAllButton = () => {
  const call = useCall();
    
  const { useLocalParticipant } = useCallStateHooks();
  const localParticipant = useLocalParticipant();

  const isMeetingOwner =
    localParticipant &&
    call?.state.createdBy &&
    (localParticipant.userId as string).includes(call.state.createdBy.id);

  if (!isMeetingOwner) return null;

  return (
    <Button
      onClick={async () => {
        await call.muteOthers("audio");
      }}
      className="bg-red-500"
    >
      Mute all
    </Button>
  );
};

export default MuteAllButton;
