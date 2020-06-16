import React, { PureComponent, memo, useState } from 'react';
import PropTypes from 'prop-types';
import { Session } from 'meteor/session';
import BreakoutRoomContainer from '/imports/ui/components/breakout-room/container';
import ChatContainer from '/imports/ui/components/chat/container';
import UserListContainer from '/imports/ui/components/user-list/container';
import SharedDocument from '/imports/ui/components/chat/shared-document/container';
import NoteContainer from '/imports/ui/components/note/container';
import PollContainer from '/imports/ui/components/poll/container';
import CaptionsContainer from '/imports/ui/components/captions/pad/container';
import WaitingUsersPanel from '/imports/ui/components/waiting-users/container';

//Drive Document
import Document from '/imports/ui/components/document/component';

import { TabContent, TabPane, Nav, NavItem, NavLink, Card, CardTitle, CardText, Row, Col } from 'reactstrap';
import classnames from 'classnames';
import Button from '/imports/ui/components/button/component';
import Icon from '/imports/ui/components/icon/component';
import { defineMessages, injectIntl } from 'react-intl';
import Resizable from 're-resizable';
import { styles } from '/imports/ui/components/app/styles';
import _ from 'lodash';

import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
library.add(fas);
import './tab.css'


const intlMessages = defineMessages({
  chatLabel: {
    id: 'app.chat.label',
    description: 'Aria-label for Chat Section',
  },
  noteLabel: {
    id: 'app.note.label',
    description: 'Aria-label for Note Section',
  },
  captionsLabel: {
    id: 'app.captions.label',
    description: 'Aria-label for Captions Section',
  },
  userListLabel: {
    id: 'app.userList.label',
    description: 'Aria-label for Userlist Nav',
  },
  toggleUserListLabel: {
    id: 'app.navBar.userListToggleBtnLabel',
    description: 'Toggle button label',
  },
  toggleUserListAria: {
    id: 'app.navBar.toggleUserList.ariaLabel',
    description: 'description of the lists inside the userlist',
  },
  newMessages: {
    id: 'app.navBar.toggleUserList.newMessages',
    description: 'label for toggleUserList btn when showing red notification',
  },
  userListLabel: {
    id: 'app.userList.label',
    description: 'Aria-label for Userlist Nav',
  }
});

const propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
  enableResize: PropTypes.bool.isRequired,
  openPanel: PropTypes.string.isRequired,
  isPhone: PropTypes.bool.isRequired,
  mobPanelOpen: PropTypes.bool.isRequired,
};

const CHAT_CONFIG = Meteor.settings.public.chat;
const CHAT_ENABLED = CHAT_CONFIG.enabled;
const PUBLIC_CHAT_ID = CHAT_CONFIG.public_id;

const DEFAULT_PANEL_WIDTH = 340;

// Variables for resizing user-list.
const USERLIST_MIN_WIDTH_PX = 340;
const USERLIST_MAX_WIDTH_PX = 340;

// Variables for resizing chat.
const CHAT_MIN_WIDTH = 350;
const CHAT_MAX_WIDTH = 350;

// Variables for resizing chat.
const DOCUMENT_MIN_WIDTH = 150;
const DOCUMENT_MAX_WIDTH = 250;

// Variables for resizing poll.
const POLL_MIN_WIDTH = 320;
const POLL_MAX_WIDTH = 400;

// Variables for resizing shared notes.
const NOTE_MIN_WIDTH = DEFAULT_PANEL_WIDTH;
const NOTE_MAX_WIDTH = 800;

// Variables for resizing captions.
const CAPTIONS_MIN_WIDTH = DEFAULT_PANEL_WIDTH;
const CAPTIONS_MAX_WIDTH = 400;

// Variables for drive document.
const DRIVE_DOCUMENT_MIN_WIDTH = DEFAULT_PANEL_WIDTH;
const DRIVE_DOCUMENT_MAX_WIDTH = 400;

// Variables for resizing waiting users.
const WAITING_MIN_WIDTH = DEFAULT_PANEL_WIDTH;
const WAITING_MAX_WIDTH = 800;

const dispatchResizeEvent = () => window.dispatchEvent(new Event('resize'));

class LeftPanelManager extends PureComponent {
  constructor() {
    super();

    this.padKey = _.uniqueId('resize-pad-');
    this.userlistKey = _.uniqueId('userlist-');
    this.breakoutroomKey = _.uniqueId('breakoutroom-');
    this.chatKey = _.uniqueId('chat-');
    this.documentKey = _.uniqueId('document-');
    this.pollKey = _.uniqueId('poll-');
    this.noteKey = _.uniqueId('note-');
    this.captionsKey = _.uniqueId('captions-');
    this.driveDocumentKey = _.uniqueId('driveDocument-');
    this.waitingUsers = _.uniqueId('waitingUsers-');

    this.state = {
      chatWidth: DEFAULT_PANEL_WIDTH,
      documentWidth: DEFAULT_PANEL_WIDTH,
      pollWidth: DEFAULT_PANEL_WIDTH,
      userlistWidth: 180,
      noteWidth: DEFAULT_PANEL_WIDTH,
      captionsWidth: DEFAULT_PANEL_WIDTH,
      driveDocumentWidth: DEFAULT_PANEL_WIDTH,
      waitingWidth: DEFAULT_PANEL_WIDTH,
      activeTab: "1",

      isPhone: false,
      mobPanelOpen: false
    };
  }

  handleToggleUserList = () => {

    if (Session.get('openPanel') === '') {
      Session.set('openPanel', 'chat');
    } else {
      Session.set('openPanel', '');
    }
  }

  componentDidMount = () => {
    
    const { openPanel, isPhone, mobPanelOpen } = this.props;

    if(openPanel === ''){
      this.setState({
        isPhone: isPhone,
        mobPanelOpen: mobPanelOpen 
      })
    } 
  }

  componentDidUpdate(prevProps) {
    const { openPanel, User, UserInfo } = this.props;
    const { openPanel: oldOpenPanel } = prevProps;

    if (openPanel !== oldOpenPanel) {
      window.dispatchEvent(new Event('resize'));
    }
  }

  static getDerivedStateFromProps(props, state) {

    if (state.isPhone === true) {
      if (props.mobPanelOpen !== state.mobPanelOpen) {
        if (Session.get('openPanel') === '') {
        
          Session.set('openPanel', 'chat');
          Session.set('idChatOpen', PUBLIC_CHAT_ID);
        
        } else {

          Session.set('openPanel', '');
          Session.set('idChatOpen', '');
        }

        return {
          mobPanelOpen: props.mobPanelOpen,
          isPhone: props.isPhone
        };
      }
      return null;
    }

    return null;
  }

  renderToogleButton() {

    const {
      intl,
      openPanel,
      shortcuts: TOGGLE_USERLIST_AK,
      isExpanded
    } = this.props;

    let ariaLabel = intl.formatMessage(intlMessages.toggleUserListAria);
    // ariaLabel += hasUnreadMessages ? (` ${intl.formatMessage(intlMessages.newMessages)}`) : '';

    return (
      <>
        <div className={openPanel === '' ? "openbuttontoogle" : "closebuttontoogle"}>
          <Button
            data-test="userListToggleButton"
            onClick={this.handleToggleUserList}
            hideLabel
            label={openPanel === '' ? "Open" : "Close"}
            aria-label={ariaLabel}
            icon={openPanel === '' ? "right_arrow" : "left_arrow"}
            // className={cx(toggleBtnClasses)}
            aria-expanded={isExpanded}
            accessKey={TOGGLE_USERLIST_AK}
          />
        </div>
      </>
    )
  }


  renderLeftSection() {
    const {
      intl,
      User,
      openPanel,
      UserInfo,
      enableResize,
      getUserList,
      amIModerator,
      shouldAriaHide,
      isPhone,
      mobPanelOpen
    } = this.props;

    const { activeTab } = this.state;
    const ariaHidden = shouldAriaHide() && openPanel !== 'userlist';

    return (

      <>
        {isPhone ? null : this.renderToogleButton()}
        {openPanel !== '' ?

          <div className="srv_chat_section">

            <Nav tabs className="srv_chat_tab">
              <NavItem>
                <Button
                  className={classnames({ active: activeTab === '1' })}
                  onClick={() => { this.toggle('1'); }}
                  label="Chat" hideLabel
                  customIcon={<FontAwesomeIcon icon={['fas', 'comment']} />}
                />

              </NavItem>
              <NavItem>
                <Button
                  className={classnames({ active: activeTab === '2' })}
                  onClick={() => { this.toggle('2'); }}
                  label="Upload Presentation" hideLabel
                  customIcon={<FontAwesomeIcon icon={['fas', 'file-powerpoint']} />}
                />

              </NavItem>

              <NavItem>
                <Button
                  className={classnames({ active: activeTab === '3' })}
                  onClick={() => { this.toggle('3'); }}
                  label="Attendee" hideLabel
                  customIcon={<FontAwesomeIcon icon={['fas', 'users']} />}
                />

              </NavItem>
              <NavItem>
                <Button
                  className={classnames({ active: activeTab === '4' })}
                  onClick={() => { this.toggle('4'); }}
                  label="Shared Notes" hideLabel
                  customIcon={<FontAwesomeIcon icon={['fas', 'sticky-note']} />}
                />


              </NavItem>
              {(amIModerator) ?
                <NavItem>

                  <Button
                    className={classnames({ active: activeTab === '5' })}
                    onClick={() => { this.toggle('5'); }}
                    label="Breakout Room" hideLabel
                    customIcon={<FontAwesomeIcon icon={['fas', 'table']} />}
                  />



                </NavItem> : null}

              {(amIModerator && (openPanel === "captions")) ?
                <NavItem>
                  <Button
                    className={classnames({ active: activeTab === '6' })}
                    onClick={() => { this.toggle('6'); }}
                    label="Captions" hideLabel
                    customIcon={<FontAwesomeIcon icon={['fas', 'closed-captioning']} />}
                  />


                </NavItem> : null}

              {(amIModerator && (openPanel === "poll")) ?
                <NavItem>
                  <Button
                    className={classnames({ active: activeTab === '7' })}
                    onClick={() => { this.toggle('7'); }}
                    label="Poll" hideLabel
                    customIcon={<FontAwesomeIcon icon={['fas', 'poll']} />}
                  />


                </NavItem> : null}

              <NavItem>
                <Button
                  className={classnames({ active: activeTab === '8' })}
                  onClick={() => { this.toggle('8'); }}
                  label="Drive Documents" hideLabel
                  customIcon={<FontAwesomeIcon icon={['fas', 'file-alt']} />}
                />
              </NavItem>

            </Nav>
            <TabContent activeTab={activeTab}>
              <TabPane tabId="1">
                {

                  this.renderChat()
                }
              </TabPane>
              <TabPane tabId="2">
                <h2 className="tab-title">Upload Presentation</h2>
                <SharedDocument />
              </TabPane>

              <TabPane tabId="3">
                <div
                  className={styles.userList}
                  aria-label={intl.formatMessage(intlMessages.userListLabel)}
                  key={enableResize ? null : this.userlistKey}
                  aria-hidden={ariaHidden}
                >
                  <UserListContainer  {...{
                    getUserList,
                  }} />
                </div>


              </TabPane>

              <TabPane tabId="4">
                <h2 className="tab-title">Shared Notes</h2>
                <NoteContainer />

              </TabPane>

              {(amIModerator) ?
                <TabPane tabId="5">
                  <h2 className="tab-title">Breakout Room</h2>
                  <BreakoutRoomContainer />

                </TabPane> : null}
              {(amIModerator && (openPanel === "captions")) ?
                <TabPane tabId="6">
                  <h2 className="tab-title">Caption</h2>
                  <CaptionsContainer />

                </TabPane> : null}

              {(amIModerator && (openPanel === "poll")) ?
                <TabPane tabId="7">
                  <h2 className="tab-title">Poll </h2>
                  <PollContainer />

                </TabPane> : null}

              <TabPane tabId="8">
                <h2 className="tab-title">Drive Document</h2>
                <Document />
              </TabPane>

            </TabContent>

          </div>
          : null
        }
      </>

    );
  }

  renderLeftSectionResizable() {
    const { chatWidth } = this.state;
    const { isRTL } = this.props;

    const resizableEnableOptions = {
      top: false,
      right: false,
      bottom: false,
      left: !!isRTL,
      topRight: false,
      bottomRight: false,
      bottomLeft: false,
      topLeft: false,
    };

    return (
      <Resizable
        minWidth={CHAT_MIN_WIDTH}
        maxWidth={CHAT_MAX_WIDTH}
        ref={(node) => { this.resizableChat = node; }}
        enable={resizableEnableOptions}
        key={this.chatKey}
        size={{ width: chatWidth }}
        onResize={dispatchResizeEvent}
        onResizeStop={(e, direction, ref, d) => {
          this.setState({
            chatWidth: chatWidth + d.width,
          });
        }}
      >
        {this.renderLeftSection()}
      </Resizable>
    );
  }




  renderChat() {
    const { intl, User, UserInfo, enableResize } = this.props;

    return (
      <div className={styles.chat_type_area_section}>
        <ChatContainer />
      </div>
    );
  }

  renderChatResizable() {
    const { chatWidth } = this.state;
    const { isRTL } = this.props;

    const resizableEnableOptions = {
      top: false,
      right: !isRTL,
      bottom: false,
      left: !!isRTL,
      topRight: false,
      bottomRight: false,
      bottomLeft: false,
      topLeft: false,
    };

    return (
      <Resizable
        minWidth={CHAT_MIN_WIDTH}
        maxWidth={CHAT_MAX_WIDTH}
        ref={(node) => { this.resizableChat = node; }}
        enable={resizableEnableOptions}
        key={this.chatKey}
        size={{ width: chatWidth }}
        onResize={dispatchResizeEvent}
        onResizeStop={(e, direction, ref, d) => {
          this.setState({
            chatWidth: chatWidth + d.width,
          });
        }}
      >
        {this.renderChat()}
      </Resizable>
    );
  }



  renderNote() {
    const { intl, enableResize } = this.props;

    return (
      <section
        className={styles.note}
        aria-label={intl.formatMessage(intlMessages.noteLabel)}
        key={enableResize ? null : this.noteKey}
      >
        <NoteContainer />
      </section>
      //
    );
  }

  renderNoteResizable() {
    const { noteWidth } = this.state;
    const { isRTL } = this.props;

    const resizableEnableOptions = {
      top: false,
      right: !isRTL,
      bottom: false,
      left: !!isRTL,
      topRight: false,
      bottomRight: false,
      bottomLeft: false,
      topLeft: false,
    };

    return (
      <Resizable
        minWidth={NOTE_MIN_WIDTH}
        maxWidth={NOTE_MAX_WIDTH}
        ref={(node) => { this.resizableNote = node; }}
        enable={resizableEnableOptions}
        key={this.noteKey}
        size={{ width: noteWidth }}
        onResize={dispatchResizeEvent}
        onResizeStop={(e, direction, ref, d) => {
          this.setState({
            noteWidth: noteWidth + d.width,
          });
        }}
      >
        {this.renderNote()}
      </Resizable>
    );
  }

  renderCaptions() {
    const { intl, enableResize } = this.props;

    return (
      <section
        className={styles.captions}
        aria-label={intl.formatMessage(intlMessages.captionsLabel)}
        key={enableResize ? null : this.captionsKey}
      >
        <CaptionsContainer />
      </section>
      //
    );
  }

  renderCaptionsResizable() {
    const { captionsWidth } = this.state;
    const { isRTL } = this.props;

    const resizableEnableOptions = {
      top: false,
      right: !isRTL,
      bottom: false,
      left: !!isRTL,
      topRight: false,
      bottomRight: false,
      bottomLeft: false,
      topLeft: false,
    };

    return (
      <Resizable
        minWidth={CAPTIONS_MIN_WIDTH}
        maxWidth={CAPTIONS_MAX_WIDTH}
        ref={(node) => { this.resizableCaptions = node; }}
        enable={resizableEnableOptions}
        key={this.captionsKey}
        size={{ width: captionsWidth }}
        onResize={dispatchResizeEvent}
        onResizeStop={(e, direction, ref, d) => {
          this.setState({
            captionsWidth: captionsWidth + d.width,
          });
        }}
      >
        //
        {this.renderCaptions()}
      </Resizable>
    );
  }

  renderWaitingUsersPanel() {
    const { intl, enableResize } = this.props;

    return (
      <section
        className={styles.note}
        aria-label={intl.formatMessage(intlMessages.noteLabel)}
        key={enableResize ? null : this.waitingUsers}
      >
        <WaitingUsersPanel />
      </section>
      //

    );
  }

  renderWaitingUsersPanelResizable() {
    const { waitingWidth } = this.state;
    const { isRTL } = this.props;

    const resizableEnableOptions = {
      top: false,
      right: !isRTL,
      bottom: false,
      left: !!isRTL,
      topRight: false,
      bottomRight: false,
      bottomLeft: false,
      topLeft: false,
    };

    return (
      <Resizable
        minWidth={WAITING_MIN_WIDTH}
        maxWidth={WAITING_MAX_WIDTH}
        ref={(node) => { this.resizableWaitingUsersPanel = node; }}
        enable={resizableEnableOptions}
        key={this.waitingUsers}
        size={{ width: waitingWidth }}
        onResize={dispatchResizeEvent}
        onResizeStop={(e, direction, ref, d) => {
          this.setState({
            waitingWidth: waitingWidth + d.width,
          });
        }}
      >
        {this.renderWaitingUsersPanel()}
      </Resizable>
    );
  }

  renderBreakoutRoom() {
    return (
      <div className={styles.breakoutRoom} key={this.breakoutroomKey}>
        <BreakoutRoomContainer />
      </div>
      //
    );
  }

  renderPoll() {
    return (
      <div className={styles.poll} key={this.pollKey}>
        <PollContainer />
      </div>
    );
  }

  renderPollResizable() {
    const { pollWidth } = this.state;
    const { isRTL } = this.props;

    const resizableEnableOptions = {
      top: false,
      right: !isRTL,
      bottom: false,
      left: !!isRTL,
      topRight: false,
      bottomRight: false,
      bottomLeft: false,
      topLeft: false,
    };

    return (
      <Resizable
        minWidth={POLL_MIN_WIDTH}
        maxWidth={POLL_MAX_WIDTH}
        ref={(node) => { this.resizablePoll = node; }}
        enable={resizableEnableOptions}
        key={this.pollKey}
        size={{ width: pollWidth }}
        onResizeStop={(e, direction, ref, d) => {
          window.dispatchEvent(new Event('resize'));
          this.setState({
            pollWidth: pollWidth + d.width,
          });
        }}
      >
        {this.renderPoll()}
      </Resizable>
    );
  }

  toggle = (tab) => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      })
    }
  }

  render() {
    const {
      enableResize,
      openPanel,
      getUserList,
      isPhone,
      mobPanelOpen
    } = this.props;
    const { activeTab } = this.state;

    if (isPhone === false) {

      if (openPanel === '') return this.renderToogleButton();

      const panels = [];

      if (enableResize) {
        panels.push(this.renderLeftSectionResizable());
      } else {
        panels.push(this.renderLeftSection());
      }

      return panels;

    } else {

      if (openPanel === '') return ''; 

      const panels = [];

      if (enableResize) {
        panels.push(this.renderLeftSectionResizable());
      } else {
        panels.push(this.renderLeftSection());
      }

      return panels;

    }

  }
}

export default injectIntl(LeftPanelManager);

LeftPanelManager.propTypes = propTypes;
