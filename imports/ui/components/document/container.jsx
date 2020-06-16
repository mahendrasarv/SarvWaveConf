import React from 'react';
import { injectIntl } from 'react-intl';
import Header from './component';

const HeaderContainer = props => <Header {...props} />;

export default injectIntl(HeaderContainer);
