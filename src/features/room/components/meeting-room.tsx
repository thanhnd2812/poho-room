"use client";

import Loader from "@/components/loader";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  CallControls,
  CallingState,
  CallParticipantsList,
  CallStatsButton,
  PaginatedGridLayout,
  SpeakerLayout,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { LayoutList, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import EndCallButton from "./end-call-button";

type CallLayoutType = "grid" | "speaker-left" | "speaker-right";

const MeetingRoom = () => {
  const { useCallCallingState } = useCallStateHooks();
  const callCallingState = useCallCallingState();
  const router = useRouter();
  const t = useTranslations("meetingRoom");
  const searchParams = useSearchParams();
  const isPersonalRoom = !!searchParams.get("personal");
  const [layout, setLayout] = useState<CallLayoutType>("speaker-left");
  const [showParticipants, setShowParticipants] = useState(false);
  
  useEffect(() => {
    switch (callCallingState) {
      case CallingState.LEFT:
        router.push("/");
        break;
      case CallingState.RECONNECTING:
        toast.info("Reconnecting to call...");
        break;
      default:
        break;
    }
  }, [callCallingState, router]);

  if (callCallingState !== CallingState.JOINED) return <Loader />;

  const CallLayout = () => {
    switch (layout) {
      case "grid":
        return <PaginatedGridLayout />;
      case "speaker-left":
        return <SpeakerLayout participantsBarPosition={"right"} />;
      default:
        return <SpeakerLayout participantsBarPosition={"left"} />;
    }
  };


  return (
    <section className="relative h-screen w-full overflow-hidden pt-4 text-white bg-slate-500 dark:bg-slate-800">
      <div className="relative flex size-full items-center justify-center">
        <div className="flex size-full max-w-[1000px] items-center gap-5">
          <CallLayout />
        </div>
        <div
          className={cn("h-[calc(100vh-86px)] hidden ml-2", {
            "show-block": showParticipants,
          })}
        >
          <CallParticipantsList onClose={() => setShowParticipants(false)} />
        </div>
      </div>
      <div className="fixed bottom-0 flex w-full items-center justify-center gap-5 flex-wrap">
        <CallControls
          onLeave={() => {
            router.push("/");
          }}
        />
        <DropdownMenu>
          <div className="flex items-center">
            <DropdownMenuTrigger className="cursor-pointer rounded-2xl bg-[#19232D] px-4 py-2 hover:bg-[#4c535b]">
              <LayoutList size={20} className="text-white" />
            </DropdownMenuTrigger>
          </div>
          <DropdownMenuContent className="border-dark-1 bg-dark-1 text-white">
            {["Grid", "Speaker-Left", "Speaker-Right"].map((layout, index) => (
              <div key={index}>
                <DropdownMenuItem
                  onClick={() => {
                    setLayout(layout.toLowerCase() as CallLayoutType);
                  }}
                  className="cursor-pointer"
                >
                  {t(`layout.${layout.toLowerCase()}`)}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="border-dark-1" />
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <CallStatsButton />
        <button onClick={() => setShowParticipants((prev) => !prev)}>
          <div className="cursor-pointer rounded-2xl bg-[#19232D] px-4 py-2 hover:bg-[#4c535b]">
            <Users size={20} className="text-white" />
          </div>
        </button>
        {!isPersonalRoom && <EndCallButton />}
      </div>
    </section>
  );
};

export default MeetingRoom;
