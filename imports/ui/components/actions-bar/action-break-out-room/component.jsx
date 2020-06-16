import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl, intlShape } from 'react-intl';
import browser from 'browser-detect';
import Button from '/imports/ui/components/button/component';

import BreakoutRoom from '../create-breakout-room/container';
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

const BreakOutRoom = ({
    intl,
    amIModerator,
    isMeteorConnected,
    isBreakoutRecordable,
    mountModal
}) => {
    const shouldAllowBreakOutRoom = isMeteorConnected
        && amIModerator;

    return shouldAllowBreakOutRoom
        ? (
            <Button
                className={cx(styles.btn)}
                disabled={(!isMeteorConnected)}
                icon={'rooms'}
                label={"BreakOut Room"}
                description={"BreakOut Room Description"}
                color="primary"
                hideLabel
                circle
                size="lg"
                onClick={() => mountModal(
                    <BreakoutRoom
                        intl={intl}
                        amIModerator={amIModerator}
                        isMeteorConnected={isMeteorConnected}
                        isBreakoutRecordable={isBreakoutRecordable}
                        isInvitation={false}
                    />
                )}

                id="breakout-room"
            />
        ) : null;
};

BreakOutRoom.propTypes = propTypes;
export default withModalMounter(injectIntl(memo(BreakOutRoom)));
