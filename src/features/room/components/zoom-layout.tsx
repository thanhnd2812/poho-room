import {
  combineComparators,
  Comparator,
  conditional,
  dominantSpeaker,
  hasScreenShare,
  ParticipantView,
  pinned,
  publishingAudio,
  publishingVideo,
  reactionType,
  screenSharing,
  speaking,
  StreamVideoParticipant,
  useCall,
  useCallStateHooks,
  VisibilityState,
} from "@stream-io/video-react-sdk";
import { useEffect, useRef } from "react";

export const ZoomLayout = () => {
  const call = useCall();
  const { useParticipants } = useCallStateHooks();
  const participants = useParticipants();
  const [participantInSpotlight, ...otherParticipants] = participants;
  const participantsBarRef = useRef<HTMLDivElement>(null);
  // determine whether the call is a 1:1 call
  const isOneToOneCall = otherParticipants.length === 1;

  useEffect(() => {
    if (!call || !participantsBarRef.current) return;
    const cleanup = call.dynascaleManager.setViewport(
      participantsBarRef.current
    );
    return () => cleanup();
  }, [call]);

  useEffect(() => {
    if (!call) return;
    const customSortingPreset = getCustomSortingPreset(isOneToOneCall);
    call.setSortParticipantsBy(customSortingPreset);
  }, [call, isOneToOneCall]);

  return (
    <div className="zoom-layout">
      <div className="participants-bar" ref={participantsBarRef}>
        {otherParticipants.map((participant) => (
          <div className="participant-tile" key={participant.sessionId}>
            <ParticipantView participant={participant} />
          </div>
        ))}
      </div>
      <div className="spotlight">
        {participantInSpotlight && (
          <ParticipantView
            participant={participantInSpotlight}
            trackType={
              hasScreenShare(participantInSpotlight)
                ? "screenShareTrack"
                : "videoTrack"
            }
          />
        )}
      </div>
    </div>
  );
};

/**
 * Creates a custom sorting preset for the participants list.
 *
 * This function supports two modes:
 *
 * 1) 1:1 calls, where we want to always show the other participant in the spotlight,
 *  and not show them in the participants bar.
 *
 * 2) group calls, where we want to show the participants in the participants bar
 *  in a custom order:
 *  - screen sharing participants
 *  - dominant speaker
 *  - pinned participants
 *  - participants who are speaking
 *  - participants who have raised their hand
 *  - participants who are publishing video and audio
 *  - participants who are publishing video
 *  - participants who are publishing audio
 *  - other participants
 *
 * @param isOneToOneCall whether the call is a 1:1 call.
 */
const getCustomSortingPreset = (isOneToOneCall: boolean = false): Comparator<StreamVideoParticipant> => {
  // 1:1 calls are a special case, where we want to always show the other
  // participant in the spotlight, and not show them in the participants bar.
  if (isOneToOneCall) {
    return (a: StreamVideoParticipant, b: StreamVideoParticipant) => {
      if (a.isLocalParticipant) return 1;
      if (b.isLocalParticipant) return -1;
      return 0;
    };
  }

  // a comparator decorator which applies the decorated comparator only if the
  // participant is invisible.
  // This ensures stable sorting when all participants are visible.
  const ifInvisibleBy = conditional(
    (a: StreamVideoParticipant, b: StreamVideoParticipant) =>
      a.viewportVisibilityState?.videoTrack === VisibilityState.INVISIBLE ||
      b.viewportVisibilityState?.videoTrack === VisibilityState.INVISIBLE
  );

  return combineComparators(
    screenSharing,
    dominantSpeaker,
    pinned,
    ifInvisibleBy(speaking),
    ifInvisibleBy(reactionType("raised-hand")),
    ifInvisibleBy(publishingVideo),
    ifInvisibleBy(publishingAudio)
  );
};

export default ZoomLayout;
