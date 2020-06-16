import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { defineMessages } from 'react-intl';
import Icon from '/imports/ui/components/icon/component';
import { Session } from 'meteor/session';
import { styles } from '/imports/ui/components/user-list/user-list-content/styles';

const propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
};

const intlMessages = defineMessages({
  waitingUsersTitle: {
    id: 'app.userList.guest.waitingUsersTitle',
    description: 'Title for the notes list',
  },
  title: {
    id: 'app.userList.guest.waitingUsers',
    description: 'Title for the waiting users',
  },
});

class WaitingUsers extends PureComponent {

  static toggleWaitingPanel() {
    Session.set(
      'openPanel',
      Session.get('openPanel') === 'waitingUsersPanel'
        ? 'userlist'
        : 'waitingUsersPanel',
    );
  }

  render() {
    const {
      intl,
      pendingUsers,
    } = this.props;

    return (
    

      <div>
        <div className="prtcpnt_hdng">{pendingUsers.length}  waiting</div>
      <div className="conf_contacts">
        <ul className={styles.messages}>
            <li className={styles.container} >
              <div className="contact_name">
                {intl.formatMessage(intlMessages.waitingUsersTitle)}
              </div>
              <div className="contact_conf_action">
                  <a href="#" className="text-success"><FontAwesomeIcon icon={['fas', 'plus-circle']}  /> </a>
                  <a href="#" className="text-danger"><FontAwesomeIcon icon={['fas', 'times-circle']}  /></a>
              </div>
            </li>
        </ul>
        
        <div className={styles.scrollableList}>
          <div className={styles.list}>
            <div
              role='button'
              tabIndex={0}
              className={styles.listItem}
              onClick={WaitingUsers.toggleWaitingPanel}
            >
              <Icon iconName="user" />
              <span>{intl.formatMessage(intlMessages.title)}</span>
              <div className={styles.unreadMessages}>
                <div className={styles.unreadMessagesText}>
                  {pendingUsers.length}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    );
  }
}

WaitingUsers.propTypes = propTypes;

export default WaitingUsers;
