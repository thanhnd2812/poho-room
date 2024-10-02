"use client";

import { updateUserFullname } from "@/actions/public-stream-token.actions";
import { PulseBeams } from "@/components/pulse-beam";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DeviceSettings,
  useCall,
  useConnectedUser,
  VideoPreview
} from "@stream-io/video-react-sdk";
import { Copy } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const MeetingSetup = ({
  setIsSetupComplete,
}: {
  setIsSetupComplete: (isSetupComplete: boolean) => void;
}) => {
  const connectedUser = useConnectedUser();
  const [isMicCamToggledOn, setIsMicCamToggledOn] = useState(false);
  const t = useTranslations("meetingSetup");
  const call = useCall();
  const [name, setName] = useState(connectedUser?.name);

  if (!call) {
    throw new Error("Call not found");
  }

  const changeName = () => {
    if (!connectedUser || !name || name.length < 5) return;
    updateUserFullname(connectedUser.id, name);
  };

  useEffect(() => {
    if (connectedUser) {
      setName(connectedUser.name);
    }
  }, [connectedUser]);

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
    <PulseBeams className="h-screen w-full">
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
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  variant="outline"
                  onClick={() => {
                    // copy current window location href without language prefix (e.g. /en/ -> /)
                    const url = window.location.href;
                    const urlWithoutLang = url.replace(
                      /^(https?:\/\/[^\/]+)\/[a-z]{2}/,
                      "$1"
                    );
                    navigator.clipboard.writeText(urlWithoutLang);
                    toast.success(t("meetingLinkCopied"));
                  }}
                >
                  <Copy size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t("copyLink")}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Input
            className="w-48"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button
            variant="outline"
            onClick={changeName}
            className="rounded-md px-4 py-2.5 text-white"
          >
            {t("update")}
          </Button>
        </div>
        <div className="flex items-center gap-3 mt-3 w-96">
          <Button
            onClick={() => {
              call?.join();
              setIsSetupComplete(true);
            }}
            className="rounded-md px-4 py-2.5 text-white w-full"
          >
            {t("joinMeeting")}
          </Button>
        </div>
      </div>
    </PulseBeams>
  );
};

export default MeetingSetup;
