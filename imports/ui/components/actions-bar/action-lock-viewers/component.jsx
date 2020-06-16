import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl, intlShape } from 'react-intl';
import browser from 'browser-detect';

import Button from '/imports/ui/components/button/component';

import logger from '/imports/startup/client/logger';
import { notify } from '/imports/ui/services/notification';
import cx from 'classnames';

import LockViewersContainer from '/imports/ui/components/lock-viewers/container';

import { withModalMounter } from '../../modal/service';
import { styles } from '../styles';

const propTypes = {
    intl: intlShape.isRequired,
    amIModerator: PropTypes.bool.isRequired,
    mountModal: PropTypes.func.isRequired,
    isMeteorConnected: PropTypes.bool.isRequired,
};

const intlMessages = defineMessages({
    lockViewersLabel: {
        id: 'app.userList.userOptions.lockViewersLabel',
        description: 'Lock viewers label',
    },
    lockViewersDesc: {
        id: 'app.userList.userOptions.lockViewersDesc',
        description: 'Lock viewers description',
    }
});

const LockViewersAction = ({
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
                    icon="lock"
                    label={intl.formatMessage(intlMessages.lockViewersLabel)}
                    description={intl.formatMessage(intlMessages.lockViewersDesc)}
                    color="primary"
                    hideLabel
                    circle
                    size="lg"
                    onClick={() => mountModal(<LockViewersContainer />)}
                />
            )
            : null
    )
};

LockViewersAction.propTypes = propTypes;
export default withModalMounter(injectIntl(memo(LockViewersAction)));