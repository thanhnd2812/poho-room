"use client";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DeviceSettings,
  useCall,
  VideoPreview,
} from "@stream-io/video-react-sdk";
import { Copy } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

const MeetingSetup = ({
  setIsSetupComplete,
}: {
  setIsSetupComplete: (isSetupComplete: boolean) => void;
}) => {
  const [isMicCamToggledOn, setIsMicCamToggledOn] = useState(false);
  const t = useTranslations("meetingSetup");
  const call = useCall();

  if (!call) {
    throw new Error("Call not found");
  }

  useEffect(() => {
    if (isMicCamToggledOn) {
      call?.camera.disable();
      call?.microphone.disable();
    } else {
      call?.camera.enable();
      call?.microphone.enable();
    }
  }, [isMicCamToggledOn, call?.camera, call?.microphone]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-3 text-primary dark:text-white">
      <h1 className="text-2xl font-bold">{t("setup")}</h1>
      <VideoPreview />
      <div className="flex h-16 items-center justify-center gap-3">
        <label className="flex items-center justify-center gap-2 font-medium">
          <input
            type="checkbox"
            checked={isMicCamToggledOn}
            onChange={() => setIsMicCamToggledOn(!isMicCamToggledOn)}
          />
          <span>{t("joinWithCameraAndMicrophoneOff")}</span>
        </label>
        <DeviceSettings />
      </div>
      <div className="flex items-center gap-3">
        <Button
          onClick={() => {
            call?.join();
            setIsSetupComplete(true);
          }}
          className="rounded-md px-4 py-2.5 text-white"
        >
          {t("joinMeeting")}
        </Button>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button
                variant="ghost"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                }}
              >
                <Copy size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {t("copyLink")}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default MeetingSetup;
