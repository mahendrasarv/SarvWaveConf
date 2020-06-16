import React, { Component } from 'react';
import { defineMessages, intlShape } from 'react-intl';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { withModalMounter } from '/imports/ui/components/modal/service';
import withShortcutHelper from '/imports/ui/components/shortcut-help/service';
import getFromUserSettings from '/imports/ui/services/users-settings';
import Icon from '../icon/component';
import Button from '../button/component';
import RecordingIndicator from './recording-indicator/container';
import TalkingIndicatorContainer from './talking-indicator/container';
import InviteContainer from '/imports/ui/components/invite/container';
import './subheader.css';
import Modal from '/imports/ui/components/modal/simple/component';
import { styles } from './styles.scss';

const intlMessages = defineMessages({
  title: {
    id: 'app.sub-header.title',
    description: 'User info title label',
  },

});

const propTypes = {
  presentationTitle: PropTypes.string,
  shortcuts: PropTypes.string,
};

const defaultProps = {
  presentationTitle: 'Default Room Title',
  shortcuts: '',
};


class SubHeaderComponent extends Component {

  componentDidMount() {
    const {
      processOutsideToggleRecording,
      connectRecordingObserver,
    } = this.props;

    if (Meteor.settings.public.allowOutsideCommands.toggleRecording
      || getFromUserSettings('bbb_outside_toggle_recording', false)) {
      connectRecordingObserver();
      window.addEventListener('message', processOutsideToggleRecording);
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {

    const {
      intl,
      shortcuts: TOGGLE_USERLIST_AK,
      presentationTitle,
      amIModerator,
      meetingId,
    } = this.props;

    return (
      <div className="sub-header">
        <h1 className="heading-txt float-left">{presentationTitle}</h1>
        <InviteContainer
            {...{
              amIModerator
            }}
          />

        <div className={styles.bottom}>
          <TalkingIndicatorContainer amIModerator={amIModerator} />

        </div>
      </div>

    );
  }
}

SubHeaderComponent.propTypes = propTypes;

export default SubHeaderComponent;
