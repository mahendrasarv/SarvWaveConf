import Breakouts from '/imports/api/breakouts';
import Meetings from '/imports/api/meetings';
import Settings from '/imports/ui/services/settings';
import Auth from '/imports/ui/services/auth/index';
import Users from '/imports/api/users';
const getFontSize = () => {
  const applicationSettings = Settings.application;
  return applicationSettings ? applicationSettings.fontSize : '16px';
};

const getBreakoutRooms = () => Breakouts.find().fetch();

function meetingIsBreakout() {
  const meeting = Meetings.findOne({ meetingId: Auth.meetingID },
    { fields: { 'meetingProp.isBreakout': 1 } });
  return (meeting && meeting.meetingProp.isBreakout);
}

const validIOSVersion = () => {
  const SUPPORTED_OS_VERSION = 12.2;
  const iosMatch = navigator.userAgent.match(/OS (\d+)_(\d+)/);
  if (iosMatch) {
    const versionNumber = iosMatch[0].split(' ')[1].replace('_', '.');
    const isInvalid = parseFloat(versionNumber) < SUPPORTED_OS_VERSION;
    if (isInvalid) return false;
  }
  return true;
};

const getUserCountList = () => {
  let users = Users
    .find({
      meetingId: Auth.meetingID,
      connectionStatus: 'online',
    }, userFindSorting)
    .fetch();

  const currentUser = Users.findOne({ userId: Auth.userID }, { fields: { role: 1, locked: 1 } });
  if (currentUser && currentUser.role === ROLE_VIEWER && currentUser.locked) {
    const meeting = Meetings.findOne({ meetingId: Auth.meetingID },
      { fields: { 'lockSettingsProps.hideUserList': 1 } });
    if (meeting && meeting.lockSettingsProps && meeting.lockSettingsProps.hideUserList) {
      const moderatorOrCurrentUser = u => u.role === ROLE_MODERATOR || u.userId === Auth.userID;
      users = users.filter(moderatorOrCurrentUser);
    }
  }

  return users;
};


export {
  getFontSize,
  meetingIsBreakout,
  getBreakoutRooms,
  validIOSVersion,
};
