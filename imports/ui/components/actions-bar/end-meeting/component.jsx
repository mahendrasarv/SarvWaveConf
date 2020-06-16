import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl, intlShape } from 'react-intl';
import browser from 'browser-detect';

import Button from '/imports/ui/components/button/component';

import { isMobile } from "react-device-detect";

import logger from '/imports/startup/client/logger';
import { notify } from '/imports/ui/services/notification';
import cx from 'classnames';

import EndMeetingConfirmationContainer from '/imports/ui/components/end-meeting-confirmation/container';

import { withModalMounter } from '../../modal/service';
import { styles } from '../styles';
import './button.css';

const propTypes = {
    intl: intlShape.isRequired,
    amIModerator: PropTypes.bool.isRequired,
    mountModal: PropTypes.func.isRequired,
    isMeteorConnected: PropTypes.bool.isRequired,
};

const intlMessages = defineMessages({
    endMeetingLabel: {
        id: 'app.navBar.settingsDropdown.endMeetingLabel',
        description: 'End Call options label',
    },
    endMeetingDesc: {
        id: 'app.navBar.settingsDropdown.endMeetingDesc',
        description: 'Describes settings option closing the current meeting',
    }
});

const EndMeetingAction = ({
    intl,
    amIModerator,
    isMeteorConnected,
    mountModal,
}) => {

    return (
        amIModerator ?
            (

                <div>
                    {
                        isMobile ?
                            <Button
                                className="btn-end-call iconcall"
                                description={intl.formatMessage(intlMessages.endMeetingDesc)}
                                onClick={() => mountModal(<EndMeetingConfirmationContainer />)}
                                label=""
                            >
                                <img src="images/icon-call.svg" alt="End Call" width="20" />
                            </Button>
                            :
                            <Button
                                className="btn-end-call iconcall"
                                description={intl.formatMessage(intlMessages.endMeetingDesc)}
                                onClick={() => mountModal(<EndMeetingConfirmationContainer />)}
                                label=""
                            >
                                <img src="images/icon-call.svg" alt="End Call" width="15" />
                                End Call
                            </Button>
                    }
                </div>
            )
            : null
    )
};

EndMeetingAction.propTypes = propTypes;
export default withModalMounter(injectIntl(memo(EndMeetingAction)));