import {
  CancelCallButton,
  OwnCapability,
  ReactionsButton,
  RecordCallButton,
  Restricted,
  ScreenShareButton,
  SpeakingWhileMutedNotification,
  ToggleAudioPublishingButton,
  ToggleVideoPublishingButton,
} from "@stream-io/video-react-sdk";
import { isMobile } from "react-device-detect";

import { cn } from "@/lib/utils";
import type { CallControlsProps } from "@stream-io/video-react-sdk";

export const CustomCallControlsButton = ({ onLeave }: CallControlsProps) => (
  <div className="str-video__call-controls">
    <Restricted requiredGrants={[OwnCapability.SEND_AUDIO]}>
      <SpeakingWhileMutedNotification>
        <ToggleAudioPublishingButton />
      </SpeakingWhileMutedNotification>
    </Restricted>
    <Restricted requiredGrants={[OwnCapability.SEND_VIDEO]}>
      <ToggleVideoPublishingButton />
    </Restricted>
    <Restricted requiredGrants={[OwnCapability.CREATE_REACTION]}>
      <ReactionsButton />
    </Restricted>
    <Restricted requiredGrants={[OwnCapability.SCREENSHARE]}>
      <div className={cn("", { hidden: isMobile })}>
        <ScreenShareButton />
      </div>
    </Restricted>
    <Restricted
      requiredGrants={[
        OwnCapability.START_RECORD_CALL,
        OwnCapability.STOP_RECORD_CALL,
      ]}
    >
      <RecordCallButton />
    </Restricted>
    <CancelCallButton onLeave={onLeave} />
  </div>
);
