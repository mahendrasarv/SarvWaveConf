import React, { Component } from 'react';
// import { defineMessages, injectIntl, intlShape } from 'react-intl';
// import PropTypes from 'prop-types';

// import RecordingIndicator from './recording-indicator/container';
// import TalkingIndicatorContainer from '/imports/ui/components/nav-bar/talking-indicator/container';

import { makeCall } from '/imports/ui/services/api';
import { isMobile } from "react-device-detect";
import PropTypes from 'prop-types';
import UserAvatar from '/imports/ui/components/user-avatar/component';
import "./waveheader.css";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';

import jwt_decode from 'jwt-decode';
import cookie from 'react-cookies';
import Auth from '/imports/ui/services/auth';
import { myconfig } from '/imports/ui/extConfig/extConfig';

import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
library.add(fas);

const propTypes = {
  currentUser: PropTypes.shape({}).isRequired,
  // isMeteorConnected: PropTypes.bool.isRequired
};

class HeaderComponent extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isDropdownOpen: false,
      mobNavbarOpen: false,
      mobPanelOpen: false,
      loginStatus: false
    };

    // Set the logout code to 680 because it's not a real code and can be matched on the other side
    this.LOGOUT_CODE = '680';
    this.leaveSession = this.leaveSession.bind(this);
    this.toggle = this.toggle.bind(this);
    this.mobtoggle = this.mobtoggle.bind(this);
    this.panelHandling = this.panelHandling.bind(this);
  }

  leaveSession() {
    document.dispatchEvent(new Event('exitVideo'));

    makeCall('userLeftMeeting');
    // we don't check askForFeedbackOnLogout here,
    // it is checked in meeting-ended component
    Session.set('codeError', this.LOGOUT_CODE);
    // mountModal(<MeetingEndedComponent code={LOGOUT_CODE} />);
  }

  renderNavBarItems() {
    // const {
    //   intl, isMeteorConnected,
    // } = this.props;

    const {
      allowLogout: allowLogoutSetting
    } = Meteor.settings.public.app;

    const logoutOption = (
      <button
        className="nav-link btn-logout"
        onClick={() => this.leaveSession()}
        style={{ color: "gray" }}
      // label={intl.formatMessage(intlMessages.leaveSessionLabel)}
      // description={intl.formatMessage(intlMessages.leaveSessionDesc)}
      >
        <FontAwesomeIcon icon={['fas', 'sign-out-alt']} /> Logout
        </button>
    );

    // const shouldRenderLogoutOption = (isMeteorConnected && allowLogoutSetting)
    // ? logoutOption
    // : null;

    return (
      logoutOption
    );
  }

  toggle() {
    this.setState({
      isDropdownOpen: !this.state.isDropdownOpen,

    });
  }

  mobtoggle() {
    this.setState({
      mobNavbarOpen: !this.state.mobNavbarOpen
    });
  }

  componentDidMount = () => {
    if (typeof cookie.load('jwt') !== "undefined" && cookie.load('jwt') !== "undefined") {
      localStorage.setItem('jwt', cookie.load('jwt'));
      let userInfo = jwt_decode(cookie.load('jwt'))
      this.setState({
        loginStatus: userInfo.loginStatus
      })
    }
  }

  panelHandling() {
    const {
      intl,
      panelHandle,
      mobPanelOpen
    } = this.props;

    this.setState({
      mobPanelOpen: mobPanelOpen
    })

    panelHandle()

  }

  renderHeader() {
    const {
      intl,
      userFullName,
      currentUser
    } = this.props;

    const {
      isDropdownOpen,
      loginStatus,
      mobNavbarOpen,
      mobPanelOpen
    } = this.state;

    const u_link_css = {
      fontSize: "13px",
      color: "#fff"
    };

    const u_link_span_css = {
      display: "inline-block",
      width: "25px",
      height: "25px",
      background: "#ce165e",
      borderRadius: "50%",
      textAlign: "center",
      lineHeight: "25px",
      marginRight: "5px"
    }

    return (
      <div className="container-fluid header">
        {isMobile ? (
          <nav className="navbar navbar-expand-lg mobileHeader">
            <img src="images/sarv-wave-logo-mob.png" alt="Wave" width="50" />
            <div className="host-username"><FontAwesomeIcon icon={['fas', 'circle']} />
              {loginStatus ? Auth._fullname : currentUser.name}
            </div>
            <NavbarToggler className="toggler-setting" onClick={this.panelHandling}><FontAwesomeIcon icon={['fas', 'comment']} /></NavbarToggler>
            <NavbarToggler onClick={this.mobtoggle}><FontAwesomeIcon icon={['fas', 'user']} /></NavbarToggler>
            <Collapse isOpen={mobNavbarOpen} navbar>
              {loginStatus ?
                <Nav className="mr-auto" navbar>
                  <NavItem className="login-user-name">
                    <span style={u_link_span_css}>{currentUser.name.toUpperCase().slice(0, 1)}</span> {currentUser.name}
                    {this.renderNavBarItems()}
                  </NavItem>

                  <NavItem>
                    <NavLink href={myconfig.frontURL + "dashboard"} >
                      <FontAwesomeIcon icon={['fas', 'home']} /> Dashboard
                  </NavLink>
                  </NavItem>

                  <NavItem>
                    <NavLink href={myconfig.frontURL + "drive"}>
                      <FontAwesomeIcon icon={['fas', 'folder-open']} /> Drive
                  </NavLink>
                  </NavItem>

                  <NavItem>
                    <NavLink href={myconfig.frontURL + "meetings_history"}>
                      <FontAwesomeIcon icon={['fas', 'sticky-note']} /> Meetings
                  </NavLink>
                  </NavItem>

                </Nav>
                :
                <Nav className="mr-auto" navbar>
                  <NavItem className="login-user-name">
                    <span style={u_link_span_css}>{currentUser.name.toUpperCase().slice(0, 1)}</span> {currentUser.name}
                  </NavItem>
                  <NavItem>
                    <NavLink href={myconfig.frontURL}>
                      <FontAwesomeIcon icon={['fas', 'home']} /> Home
                    </NavLink>
                  </NavItem>
                </Nav>
              }

            </Collapse>

          </nav>) :

          (
            <nav className="navbar navbar-expand-lg">
              <img src="https://sarv.com/wave-ppt-html/images/sarv-wave-white-bg.png" alt="Wave" width="150" />
              <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                  <ul className="navbar-nav mr-auto s_wave_menu">

                    <li className="nav-item">
                      <a className="nav-link" href={myconfig.frontURL + "dashboard"} target="_blank">
                        <FontAwesomeIcon icon={['fas', 'home']} /> Dashboard
                        </a>
                    </li>

                    <li className="nav-item">
                      <a className="nav-link" href={myconfig.frontURL + "drive"} target="_blank">
                        <FontAwesomeIcon icon={['fas', 'folder-open']} /> Drive
                        </a>
                    </li>

                    <li className="nav-item">
                      <a className="nav-link" href={myconfig.frontURL + "meetings_history"} target="_blank">
                        <FontAwesomeIcon icon={['fas', 'handshake']} /> Meetings
                        </a>
                    </li>

                  </ul>

                  <div className="form-inline my-2 my-lg-0">

                    {/* <div className="text-right meeting_sction_btn">
                      <a className="srv_w_btn w_orange_btn btn-sm" href="#" target="_blank">
                        <FontAwesomeIcon icon={['fas', 'share-square']} /> Invite Team
                      </a>

                      <a className="srv_w_btn w_blue_btn btn-sm" href="https://wave.sarv.com/meetings" target="_blank">
                        <FontAwesomeIcon icon={['fas', 'plus-circle']} /> New Meeting
                      </a>
                    </div> */}

                    <Navbar className="navbar-nav mr-auto s_wave_menu">
                      <NavbarToggler onClick={this.toggle} />
                      <Collapse isOpen={isDropdownOpen} navbar>
                        <Nav className="mr-auto" navbar>
                          <UncontrolledDropdown nav inNavbar>
                            <DropdownToggle className="_user_link" style={u_link_css} nav caret>
                              <span style={u_link_span_css}>{currentUser.name.toUpperCase().slice(0, 1)}</span> {currentUser.name}
                            </DropdownToggle>
                            <DropdownMenu right className="user_dropdown_m">
                              {this.renderNavBarItems()}
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        </Nav>
                      </Collapse>
                    </Navbar>

                  </div>
                </div>

              </div>
            </nav>
          )}
      </div>
    );
  }

  render() {
    const { intl, userFullName, currentUser } = this.props;
    return (
      this.renderHeader()
    );
  }
}

HeaderComponent.propTypes = propTypes;

export default HeaderComponent;
