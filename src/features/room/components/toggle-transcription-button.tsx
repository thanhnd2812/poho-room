"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  TranscriptionSettingsRequestModeEnum,
  useCall,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { CgTranscript } from "react-icons/cg";

export const MyToggleTranscriptionButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const call = useCall();
  const { useCallSettings, useIsCallTranscribingInProgress } =
    useCallStateHooks();

  const isTranscribing = useIsCallTranscribingInProgress();

  const { transcription } = useCallSettings() || {};
  if (transcription?.mode === TranscriptionSettingsRequestModeEnum.DISABLED) {
    // transcriptions are not available, render nothing
    return null;
  }

  const handlingTranscription = async () => {
    setIsLoading(true);
    try {
      await call?.startTranscription({
        transcription_external_storage: "gcs-transcriptions-2",
      });
    } catch (err) {
      console.error("Failed to start transcription", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={isTranscribing ? "destructive" : "outline"}
      className={cn(
        "mb-2 py-0",
        isTranscribing ? "bg-red-600 text-white" : "bg-[#19232D]"
      )}
      onClick={() => {
        if (isTranscribing) {
          call?.stopTranscription().catch((err) => {
            console.log("Failed to stop transcriptions", err);
          });
        } else {
          handlingTranscription();
        }
      }}
    >
      {isLoading ? <Loader2 size={20} className="animate-spin" /> : <CgTranscript size={20} />}
    </Button>
  );
};
