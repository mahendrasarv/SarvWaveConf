import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl, intlShape } from 'react-intl';
import browser from 'browser-detect';

import Button from '/imports/ui/components/button/component';

import logger from '/imports/startup/client/logger';
import { notify } from '/imports/ui/services/notification';
import cx from 'classnames';

import CaptionsWriterMenu from '/imports/ui/components/captions/writer-menu/container';

import { withModalMounter } from '../../modal/service';
import { styles } from '../styles';

const propTypes = {
    intl: intlShape.isRequired,
    amIModerator: PropTypes.bool.isRequired,
    mountModal: PropTypes.func.isRequired,
    isMeteorConnected: PropTypes.bool.isRequired,
};

const intlMessages = defineMessages({
    captionsLabel: {
        id: 'app.actionsBar.actionsDropdown.captionsLabel',
        description: 'Captions menu toggle label',
    },
    captionsDesc: {
        id: 'app.actionsBar.actionsDropdown.captionsDesc',
        description: 'Captions menu toggle description',
    },
});

const WriteCaptionAction = ({
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
                    icon="closed_caption"
                    label={intl.formatMessage(intlMessages.captionsLabel)}
                    description={intl.formatMessage(intlMessages.captionsDesc)}
                    color="primary"
                    hideLabel
                    circle
                    size="lg"
                    onClick={() => mountModal(<CaptionsWriterMenu />)}
                />
            )
            : null
    )
};

WriteCaptionAction.propTypes = propTypes;
export default withModalMounter(injectIntl(memo(WriteCaptionAction)));