import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl, intlShape } from 'react-intl';
import RecordIndicatorContainer from '/imports/ui/components/nav-bar/recording-indicator/container';

import cx from 'classnames';

import { withModalMounter } from '../../modal/service';
// import { styles } from '../styles';

import Service from '/imports/ui/components/nav-bar/service';

const propTypes = {
    intl: intlShape.isRequired,
    amIModerator: PropTypes.bool.isRequired,
    isMeteorConnected: PropTypes.bool.isRequired,
    mountModal: PropTypes.func.isRequired,
};

const intlMessages = defineMessages({
    desktopShareLabel: {
        id: 'app.actionsBar.actionsDropdown.desktopShareLabel',
        description: 'Desktop Share option label',
    }
});

const Recordings = ({
    intl,
    amIModerator,
    isMeteorConnected,
    mountModal
}) => {

    // if (Meteor.settings.public.allowOutsideCommands.toggleRecording
    // || getFromUserSettings('bbb_outside_toggle_recording', false)) 
    // {
    //     connectRecordingObserver();
    //     window.addEventListener('message', processOutsideToggleRecording);
    // }

    return (
        <RecordIndicatorContainer 
            amIModerator={amIModerator}
            mountModal={mountModal}
            // connectRecordingObserver={Service.connectRecordingObserver}
            // processOutsideToggleRecording={Service.processOutsideToggleRecording}
        />
    )
};

Recordings.propTypes = propTypes;
export default withModalMounter(injectIntl(memo(Recordings)));