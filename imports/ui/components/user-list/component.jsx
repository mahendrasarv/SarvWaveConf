import React, { PureComponent } from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import injectWbResizeEvent from '/imports/ui/components/presentation/resize-wrapper/component';
import { styles } from './styles.scss';
import './usermenu.css';
import CustomLogo from './custom-logo/component';
import UserContentContainer from './user-list-content/container';
import UserMenuContainer from './user-menu/container';
const propTypes = {
  activeChats: PropTypes.arrayOf(String).isRequired,
  compact: PropTypes.bool,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
  CustomLogoUrl: PropTypes.string.isRequired,
  users: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  isPublicChat: PropTypes.func.isRequired,
  setEmojiStatus: PropTypes.func.isRequired,
  roving: PropTypes.func.isRequired,
  showBranding: PropTypes.bool.isRequired,
  requestUserInformation: PropTypes.func.isRequired,
};

const defaultProps = {
  compact: false,
};




class UserList extends PureComponent {
  render() {
    const {
      intl,
      activeChats,
      compact,
      getUserList,
      setEmojiStatus,
      isPublicChat,
      roving,
      users,
      CustomLogoUrl,
      showBranding,
      meetingIsBreakout,
      hasBreakoutRoom,
      requestUserInformation,
    } = this.props;
    console.log("getUserList  : ",getUserList);
    return (
      <div className={styles.userList}>
        <div className={styles.userListMenu}>
          <UserMenuContainer {...{
            setEmojiStatus,
            meetingIsBreakout,
          }}
          />
        </div>
        <div className={styles.tabheadingrow}><h2 className="tab-title partici-tab">Participant <font >({users.length})</font> </h2></div>

        {<UserContentContainer
          {...{
            intl,
            activeChats,
            compact,
            setEmojiStatus,
            isPublicChat,
            roving,
            hasBreakoutRoom,
            requestUserInformation,
          }
          }
        />}
      </div>
    );
  }
}

UserList.propTypes = propTypes;
UserList.defaultProps = defaultProps;

export default injectWbResizeEvent(injectIntl(UserList));
