import { getProfile } from "@/actions/profile.actions";
import DateTimeDisplay from "@/components/date-time-display";
import { SupportedLanguage } from "@/constant/locales";
import MeetingTypeList from "@/features/home/components/meeting-type-list";
import { getLanguage } from "@/languages";

const Page = async ({ params }: { params: { lang: SupportedLanguage } }) => {

  const profile = await getProfile();
  const language = await getLanguage(params.lang);
  const meetingLanguage = language.meeting;
  
  return (
    <section className="flex size-full flex-col gap-10 text-white">
      {/* Hero Section */}
      <div className="h-[300px] w-full rounded-[20px] bg-hero bg-cover">
        <div className="flex h-full flex-col justify-between max-md:px-5 max-md:py-8 lg:p-11">
          <h2 className="glassmorphism max-w-[270px] rounded py-2 text-center text-xl font-bold">
            Welcome, {profile?.fullname || "Guest"}
          </h2>
          <DateTimeDisplay lang={params.lang} />
        </div>
      </div>
      {/* Upcoming Meetings Section */}
      <MeetingTypeList
        newMeetingTitle={meetingLanguage.newMeeting.title}
        newMeetingDescription={meetingLanguage.newMeeting.description}
        joinMeetingTitle={meetingLanguage.joinMeeting.title}
        joinMeetingDescription={meetingLanguage.joinMeeting.description}
        scheduleMeetingTitle={meetingLanguage.scheduleMeeting.title}
        scheduleMeetingDescription={meetingLanguage.scheduleMeeting.description}
        viewRecordingsTitle={meetingLanguage.viewRecordings.title}
        viewRecordingsDescription={meetingLanguage.viewRecordings.description}
        instantMeetingModalTitle={meetingLanguage.instantMeetingModal.title}
        instantMeetingModalButtonText={meetingLanguage.instantMeetingModal.buttonText}
        scheduleMeetingModalTitle={meetingLanguage.scheduleMeetingModal.title}
        scheduleMeetingModalAddDescription={meetingLanguage.scheduleMeetingModal.addDescription}
        scheduleMeetingModalSelectDateAndTime={meetingLanguage.scheduleMeetingModal.selectDateAndTime}
        meetingCreatedModalTitle={meetingLanguage.meetingCreatedModal.title}
        meetingCreatedModalButtonText={meetingLanguage.meetingCreatedModal.buttonText}
        joinMeetingModalTitle={meetingLanguage.joinMeetingModal.title}
        joinMeetingModalButtonText={meetingLanguage.joinMeetingModal.buttonText}
        joinMeetingModalPlaceholder={meetingLanguage.joinMeetingModal.placeholder}
        selectDateTimeError={meetingLanguage.selectDateTimeError}
        createMeetingError={meetingLanguage.createMeetingError}
        meetingCreated={meetingLanguage.meetingCreated}
        meetingLinkCopied={meetingLanguage.meetingLinkCopied}
        time={meetingLanguage.scheduleMeeting.time}
      />
    </section>
  );
};

export default Page;
