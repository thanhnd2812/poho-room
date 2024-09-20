"use client";
import { Button } from "@/components/ui/button";
import { storage } from "@/lib/firebase";
import { cn } from "@/lib/utils";
import {
  TranscriptionSettingsRequestModeEnum,
  useCall,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
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
      // Generate a unique file name (you might want to use a more robust method)
      const fileName = `transcriptions/${call?.id}.json`;

      // Create a reference to the file location
      const fileRef = ref(storage, fileName);

      // Upload an empty JSON object to initialize the file
      await uploadBytes(
        fileRef,
        new Blob([JSON.stringify({})], { type: "application/json" })
      );

      // Get the download URL
      const url = await getDownloadURL(fileRef);
      // Start transcription with the generated URL
      await call?.startTranscription({
        transcription_external_storage: url,
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
