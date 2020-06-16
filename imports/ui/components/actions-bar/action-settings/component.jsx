import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl, intlShape } from 'react-intl';
import browser from 'browser-detect';
import Button from '/imports/ui/components/button/component';
import SettingsDropdownContainer from '/imports/ui/components/nav-bar/settings-dropdown/container';

import cx from 'classnames';

import { withModalMounter } from '../../modal/service';
import { styles } from '../styles';

const propTypes = {
    intl: intlShape.isRequired,
    amIModerator: PropTypes.bool.isRequired,
    isMeteorConnected: PropTypes.bool.isRequired,
    isBreakoutRecordable: PropTypes.bool.isRequired,
    mountModal: PropTypes.func.isRequired,
};

const intlMessages = defineMessages({
    desktopShareLabel: {
        id: 'app.actionsBar.actionsDropdown.desktopShareLabel',
        description: 'Desktop Share option label',
    },
    genericError: {
        id: 'app.screenshare.genericError',
        description: 'error message for when screensharing fails with unknown error',
    },
    NotAllowedError: {
        id: 'app.screenshare.notAllowed',
        description: 'error message when screen access was not granted',
    },
    NotSupportedError: {
        id: 'app.screenshare.notSupportedError',
        description: 'error message when trying to share screen in unsafe environments',
    },
    noSafariScreenShare: {
        id: 'app.media.screenshare.safariNotSupported',
        descriptions: 'error message when trying to share screen on safari',
    },
    screenShareUnavailable: {
        id: 'app.media.screenshare.unavailable',
        descriptions: 'title for unavailable screen share modal',
    },
    NotReadableError: {
        id: 'app.screenshare.notReadableError',
        description: 'error message when the browser failed to capture the screen',
    },
    createBreakoutRoom: {
        id: 'app.actionsBar.actionsDropdown.createBreakoutRoom',
        description: 'Create breakout room option',
    },
    createBreakoutRoomDesc: {
        id: 'app.actionsBar.actionsDropdown.createBreakoutRoomDesc',
        description: 'Description of create breakout room option',
    }
});

const BROWSER_RESULTS = browser();
const isMobileBrowser = (BROWSER_RESULTS ? BROWSER_RESULTS.mobile : false)
    || (BROWSER_RESULTS && BROWSER_RESULTS.os
        ? BROWSER_RESULTS.os.includes('Android') // mobile flag doesn't always work
        : false);
const isSafari = BROWSER_RESULTS.name === 'safari';

const Settings = ({
    intl,
    amIModerator,
    isMeteorConnected,
    mountModal
}) => {

    return (
        <SettingsDropdownContainer 
            amIModerator={amIModerator}
            isMeteorConnected={isMeteorConnected}
            isByActionBar={true}
        />
    )
};

Settings.propTypes = propTypes;
export default withModalMounter(injectIntl(memo(Settings)));