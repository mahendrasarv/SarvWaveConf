import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl, intlShape } from 'react-intl';

import browser from 'browser-detect';
import logger from '/imports/startup/client/logger';
import { notify } from '/imports/ui/services/notification';

import Button from '/imports/ui/components/button/component';
import cx from 'classnames';

import VideoStreamingContainer from '/imports/ui/components/video-streaming/container';

import { withModalMounter } from '../../modal/service';
import { styles } from '../styles';

import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
library.add(fas);

const propTypes = {
    intl: intlShape.isRequired,
    amIModerator: PropTypes.bool.isRequired,
    mountModal: PropTypes.func.isRequired,
    isMeteorConnected: PropTypes.bool.isRequired,
};

const intlMessages = defineMessages({
    streamVideoLabel: {
        id: 'app.streamVideo.streamLabel',
        description: 'Stream Video label',
    },
    streamVideoDesc: {
        id: 'app.streamVideo.streamDesc',
        description: 'Stream Video description',
    }
});

const VideoStreamingAction = ({
    intl,
    amIModerator,
    isMeteorConnected,
    mountModal,
}) => {

    return (
        amIModerator ?
            (
                <Button
                    className={cx(styles.btn)}
                    disabled={(!isMeteorConnected)}
                    // icon="video"
                    customIcon={<FontAwesomeIcon icon={['fab', 'youtube']}/>}
                    label={intl.formatMessage(intlMessages.streamVideoLabel)}
                    description={intl.formatMessage(intlMessages.streamVideoLabel)}
                    color="primary"
                    hideLabel
                    circle
                    size="lg"
                    onClick={() => mountModal(<VideoStreamingContainer />)}
                />
            )
            : null
    )
};

VideoStreamingAction.propTypes = propTypes;
export default withModalMounter(injectIntl(memo(VideoStreamingAction)));