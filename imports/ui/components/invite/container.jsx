import React from 'react';
import { injectIntl } from 'react-intl';
import InviteComponent from './component';

const InviteContainer = props => <InviteComponent {...props} />;

export default injectIntl(InviteContainer);
