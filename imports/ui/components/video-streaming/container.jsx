import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { withModalMounter } from '/imports/ui/components/modal/service';

import getFromUserSettings from '/imports/ui/services/users-settings';
import Users from '/imports/api/users';
import Auth from '/imports/ui/services/auth';

import VideoStreams from '/imports/api/video-streams';
import VideoStreamService from './service';

import VideoStreaming from './component';

const ROLE_MODERATOR = Meteor.settings.public.user.role_moderator;


const VideoStreamingContainer = props => <VideoStreaming {...props} />;

export default withModalMounter(withTracker(({ mountModal }) => ({
  closeModal: () => {
    mountModal(null);
  },

  // cursor: props.cursor,
  // swapLayout: props.swapLayout,
  meetingId: VideoStreamService.meetingId(),
  meetingName: VideoStreamService.meetingName(),
  users: VideoStreamService.getAllWebcamUsers(),
  
  userId: Auth.userID,
  userIsLocked: !!Users.findOne({
    userId: Auth.userID,
    locked: true,
    role: { $ne: ROLE_MODERATOR },
  }, { fields: {} }) && VideoStreamService.webcamsLocked(),
  userHasStream: !!VideoStreams.findOne({ userId: Auth.userID }, { fields: {} }),
  userName: Auth.fullname,
  
  sessionToken: VideoStreamService.sessionToken(),

  // enableVideoStats: getFromUserSettings('bbb_enable_video_stats', Meteor.settings.public.kurento.enableVideoStats),
  // voiceBridge: VideoStreamService.voiceBridge(),

}))(VideoStreamingContainer));

