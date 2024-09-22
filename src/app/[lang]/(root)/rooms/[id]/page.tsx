"use client";

import Loader from "@/components/loader";
import MeetingRoom from "@/features/room/components/meeting-room";
import MeetingSetup from "@/features/room/components/meeting-setup";
import { useGetCallById } from "@/hooks/use-get-call-by-id";
import { useProfile } from "@/hooks/use-profile";
import { BackgroundFiltersProvider, StreamCall, StreamTheme } from "@stream-io/video-react-sdk";
import { useState } from "react";
interface MeetingPageProps {
  params: {
    id: string;
  };
}

const MeetingPage = ({ params }: MeetingPageProps) => {
  const { isLoading } = useProfile();
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const { call, isCallLoading } = useGetCallById(params.id);

  if (isLoading || isCallLoading) return <Loader />;

  return (
    <main className="h-screen w-full">
      <StreamCall call={call}>
        <StreamTheme as="main">
          {!isSetupComplete ? (
            <MeetingSetup setIsSetupComplete={setIsSetupComplete} />
          ) : (
              <BackgroundFiltersProvider>
                <MeetingRoom />
              </BackgroundFiltersProvider>
          )}
        </StreamTheme>
      </StreamCall>
    </main>
  );
};

export default MeetingPage;
