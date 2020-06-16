import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { injectIntl } from 'react-intl';
import Auth from '/imports/ui/services/auth';
import Users from '/imports/api/users';
import Header from './component';
import { Session } from 'meteor/session';

const HeaderContainer = props => <Header {...props} />;

const openPanel = Session.get('openPanel');
const isExpanded = openPanel !== '';

export default withTracker(() => ({
  currentUser: Users.findOne({ userId: Auth.userID }),
  userFullName: Auth.fullname,
  isExpanded: isExpanded
}))(HeaderContainer);
