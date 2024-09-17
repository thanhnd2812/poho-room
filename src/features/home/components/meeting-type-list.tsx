"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useProfile } from "@/hooks/use-profile";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ReactDatePicker from "react-datepicker";
import { toast } from "sonner";
import MeetingModal from "./meeting-modal";
import HomeCard from "./meeting-type-card";

enum MeetingType {
  INSTANT = "instant",
  SCHEDULE = "schedule",
  JOIN = "join",
  RECORDINGS = "recordings",
}

interface MeetingTypeListProps {
  newMeetingTitle: string;
  newMeetingDescription: string;
  joinMeetingTitle: string;
  joinMeetingDescription: string;
  scheduleMeetingTitle: string;
  scheduleMeetingDescription: string;
  viewRecordingsTitle: string;
  viewRecordingsDescription: string;
  instantMeetingModalTitle: string;
  instantMeetingModalButtonText: string;
  scheduleMeetingModalTitle: string;
  scheduleMeetingModalAddDescription: string;
  scheduleMeetingModalSelectDateAndTime: string;
  meetingCreatedModalTitle: string;
  meetingCreatedModalButtonText: string;
  joinMeetingModalTitle: string;
  joinMeetingModalButtonText: string;
  joinMeetingModalPlaceholder: string;
  selectDateTimeError: string;
  createMeetingError: string;
  meetingCreated: string;
  meetingLinkCopied: string;

}

const MeetingTypeList = ({
  newMeetingTitle,
  newMeetingDescription,

  joinMeetingTitle,
  joinMeetingDescription,
  scheduleMeetingTitle,
  scheduleMeetingDescription,
  viewRecordingsTitle,
  viewRecordingsDescription,
  instantMeetingModalTitle,
  instantMeetingModalButtonText,
  scheduleMeetingModalTitle,
  scheduleMeetingModalAddDescription,
  scheduleMeetingModalSelectDateAndTime,
  meetingCreatedModalTitle,
  meetingCreatedModalButtonText,
  joinMeetingModalTitle,
  joinMeetingModalButtonText,
  joinMeetingModalPlaceholder,
  selectDateTimeError,
  createMeetingError,
  meetingCreated,
  meetingLinkCopied,

}: MeetingTypeListProps) => {
  const router = useRouter();
  const { data: user } = useProfile();
  const client = useStreamVideoClient();

  const [meetingState, setMeetingState] = useState<MeetingType | undefined>();
  const [values, setValues] = useState({
    dateTime: new Date(),
    description: "",
    link: "",
  });
  const [callDetails, setCallDetails] = useState<Call | null>(null);

  const createMeeting = async () => {
    if (!client || !user) return;

    try {
      if (!values.dateTime) {
        toast.error(selectDateTimeError);
        return;
      }

      const id = crypto.randomUUID();
      const call = client.call("default", id);
      if (!call) throw new Error(createMeetingError);

      const startsAt =
        values.dateTime.toISOString() || new Date(Date.now()).toISOString();
      const description = values.description || "Instant Meeting";

      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            description,
          },
        },
      });
      setCallDetails(call);

      if (!values.description) {
        router.push(`/rooms/${call.id}`);
      }
      toast.success(meetingCreated);
    } catch (error) {
      console.log(error);
      toast.error(createMeetingError);
    }
  };

  const meetingLink = `${process.env.NEXT_PUBLIC_APP_URL}/rooms/${callDetails?.id}`;

  return (
    <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      <HomeCard
        title={newMeetingTitle}
        description={newMeetingDescription}
        img="/icons/add-meeting.svg"
        onClick={() => setMeetingState(MeetingType.INSTANT)}
        className="bg-orange-1"
      />
      <HomeCard
        title={joinMeetingTitle}
        description={joinMeetingDescription}
        img="/icons/join-meeting.svg"
        onClick={() => setMeetingState(MeetingType.JOIN)}
        className="bg-yellow-1"
      />
      <HomeCard
        title={scheduleMeetingTitle}
        description={scheduleMeetingDescription}
        img="/icons/schedule.svg"
        onClick={() => setMeetingState(MeetingType.SCHEDULE)}
        className="bg-blue-1"
      />
      <HomeCard
        title={viewRecordingsTitle}
        description={viewRecordingsDescription}
        img="/icons/recordings.svg"
        onClick={() => router.push("/recordings")}
        className="bg-purple-1"
      />

      <MeetingModal
        isOpen={meetingState === MeetingType.INSTANT}
        onClose={() => setMeetingState(undefined)}
        title={instantMeetingModalTitle}
        className="text-center"
        buttonText={instantMeetingModalButtonText}
        handleClick={createMeeting}
       />

      {!callDetails ? (
        <MeetingModal
          isOpen={meetingState === MeetingType.SCHEDULE}
          onClose={() => setMeetingState(undefined)}
          title={scheduleMeetingModalTitle}
          handleClick={createMeeting}
        >
          <div className="flex flex-col gap-2.5">
            <label className="text-base text-normal leading-[22px] text-sky-2">
              {scheduleMeetingModalAddDescription}
            </label>
            <Textarea
              className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
              onChange={(e) =>
                setValues({ ...values, description: e.target.value })
              }
            />
          </div>
          <div className="flex w-full flex-col gap-2.5">
            <label className="text-base text-normal leading-[22px] text-sky-2">
              {scheduleMeetingModalSelectDateAndTime}
            </label>
            <ReactDatePicker
              selected={values.dateTime}
              onChange={(date) => setValues({ ...values, dateTime: date! })}
              showTimeSelect
              timeFormat="h:mm aa"
              timeIntervals={15}
              timeCaption="Time"
              dateFormat="MMMM d, yyyy h:mm aa"
              className="w-full rounded bg-dark-3 p-2 focus:outline-none"
            />
          </div>
        </MeetingModal>
      ) : (
        <MeetingModal
          isOpen={meetingState === MeetingType.SCHEDULE}
          onClose={() => setMeetingState(undefined)}
          title={meetingCreatedModalTitle}
          className="text-center"
          handleClick={() => {
            navigator.clipboard.writeText(meetingLink);
            toast.success(meetingLinkCopied);
          }}
          image="/icons/checked.svg"
          buttonIcon="/icons/copy.svg"
          buttonText={meetingCreatedModalButtonText}
        />
      )}
      <MeetingModal
        isOpen={meetingState === MeetingType.JOIN}
        onClose={() => setMeetingState(undefined)}
        title={joinMeetingModalTitle}
        className="text-center"
        buttonText={joinMeetingModalButtonText}
        handleClick={() => router.push(values.link)}
      >
        <Input
          placeholder={joinMeetingModalPlaceholder}
          className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
          onChange={(e) => setValues({ ...values, link: e.target.value })}
        />
      </MeetingModal>
    </section>
  );
};

export default MeetingTypeList;
