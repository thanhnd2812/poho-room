"use client";

import Loader from "@/components/loader";
import { BACKGROUND_EFFECT_URLS } from "@/constant/bg-effects";
import MeetingRoom from "@/features/room/components/meeting-room";
import MeetingSetup from "@/features/room/components/meeting-setup";
import { useGetCallById } from "@/hooks/use-get-call-by-id";
import { BackgroundFiltersProvider, StreamCall, StreamTheme } from "@stream-io/video-react-sdk";
import { useState } from "react";
interface MeetingPageProps {
  params: {
    id: string;
  };
}

const PublicMeetingPage = ({ params }: MeetingPageProps) => {
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const { call, isCallLoading } = useGetCallById(params.id);
  if (isCallLoading) return <Loader />;

  return (
    <main className="h-screen w-full">
      <StreamCall call={call}>
        <StreamTheme as="main">
          {!isSetupComplete ? (
            <MeetingSetup setIsSetupComplete={setIsSetupComplete}/>
          ) : (
            <BackgroundFiltersProvider
              backgroundImages={BACKGROUND_EFFECT_URLS}
            >
              <MeetingRoom />
            </BackgroundFiltersProvider>
          )}
        </StreamTheme>
      </StreamCall>
    </main>
  );
};

export default PublicMeetingPage;
