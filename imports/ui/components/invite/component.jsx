import React, { Component } from 'react';
import { defineMessages, intlShape } from 'react-intl';
import { myconfig } from '/imports/ui/extConfig/extConfig';
import PropTypes from 'prop-types';
import './invitedropdown.css';

import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';

import Auth from '/imports/ui/services/auth';
import Meetings from '/imports/api/meetings';

import Modal from '/imports/ui/components/modal/simple/component';
import Service from './service';

// import { styles } from './styles';

import axios from 'axios';
import cookie from 'react-cookies';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import 'react-notifications-component/dist/theme.css'
import { store } from 'react-notifications-component'
import { notify } from '/imports/ui/services/notification';

import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  fab
} from '@fortawesome/free-brands-svg-icons';

library.add(fas, fab);

const propTypes = {};

const intlMessages = defineMessages({
  title: {
    id: 'app.user-info.title',
    description: 'User info title label',
  },
});

class InviteComponent extends Component {

  constructor() {
    super();
    this.state = {
      submitted: false,
      mobile: undefined,
      meetingInfo: {},
      meetingId: undefined,
      meetingIdUrl: myconfig.frontURL,
      isError: false,
      errorMsg: ""
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  }

  handleSubmit(e) {
    e.preventDefault();

    this.setState({
      submitted: true
    });
    const { mobile } = this.state;
    const {
      amIModerator
    } = this.props;

    // if (amIModerator) {
    //   return this.alertMessage("success", "Error", "Sorry Attendee not allowed to share ID")
    // } else {

    // }

    if (mobile) {
      var phoneno = /^\d{10}$/;
      if (mobile.match(phoneno)) {
        this.setState({
          isError: false
        })
        this.shareInvitation(mobile);
      }
      else {
        console.log("else", mobile)
        this.setState({
          errorMsg: "Invalid Mobile Number !",
          isError: true
        })
        return false;
      }
      //this.props.login(mobile, password);
    }
    else {
      this.setState({
        errorMsg: "Mobile Number is required !",
        isError: true
      })
    }
  }

  alertMessage = (type, title, message) => {
    notify(message, type, "desktop");
    return store.addNotification({
      title: title,
      message: message,
      type: type,
      container: 'top-right',
      animationIn: ["animated", "fadeIn"],
      animationOut: ["animated", "fadeOut"],
      dismiss: {
        duration: 5000
      }
    })
  }

  shareInvitation = (mobile) => {
    let axiosRequestOptions = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': cookie.load('jwt')
      }
    };

    let postData = {
      meetingId: this.state.meetingId,
      type: "mobile",
      value: [mobile]
    }

    axios.post(myconfig.apiURL + 'invite/inviteInMeeting', postData, axiosRequestOptions)
      .then(response => {
        this.alertMessage("success", "Success", response.data.result)
      })
      .catch((error) => {
        if (typeof error.response.data.error !== "undefined") {
          this.alertMessage("error", "Error", error.response.data.error)
        }
      });
  }

  componentDidMount = () => {
    const meetingId = Auth.meetingID;
    const meetingObject = Meetings.findOne({
      meetingId,
    });

    if (meetingObject != null) {
      let meetingTitle = meetingObject.meetingProp.extId;
      //console.log("meeeeeeeee",meetingObject)      
      this.setState({
        meetingId: meetingTitle,
        meetingIdUrl: myconfig.frontURL + "join_meeting?mid=" + meetingTitle,
        meetingInfo: meetingObject
      })
    }
  }

  renderFrom() {

    const {
      intl,
    } = this.props;

    const { submitted, mobile, isError, errorMsg, meetingIdUrl } = this.state;

    return (
      <div className="invite-dropdown-content">
        <div className="txt-addmember"><FontAwesomeIcon icon={['fas', 'users']} /> Invite Member</div>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label>Enter Mobile Number</label>
            <input type="mobile" name="mobile" className="form-control" value={mobile} onChange={this.handleChange} placeholder="Enter Mobile Number" />
            {submitted && isError &&
              <div className="help-block error_msg">{errorMsg}</div>
            }
            <div className="d-none col-md-12 text-primary f_size_12 text-right" ><a href="#">Add Many People</a></div>
          </div>

          <div className="form-group">
            <label>Team invite Link</label>
            <div className="input-group">
              <input type="text" className="form-control invitelink" id="validationDefaultUsername" readOnly value={meetingIdUrl} aria-describedby="inputGroupPrepend2" required />
              <div className="input-group-prepend">
                <CopyToClipboard text={meetingIdUrl} onCopy={(e) => this.alertMessage("success", "Success", "Copied !!!")}>
                  <span className="input-group-text copyBtn" title="Copy" id="inputGroupPrepend2"><FontAwesomeIcon icon={['fas', 'copy']} /></span>
                </CopyToClipboard>

              </div>
            </div>
          </div>

          <div className="d-none col-md-12 f_size_12 fontbold mt-3"><FontAwesomeIcon icon={['fas', 'share-alt']} /> Share Conference
              <button className="icon-social-media"> <img src="images/icon-gmail.png" alt="" /></button>
            <button className="icon-social-media" style={{ background: "#37b1e1" }}><FontAwesomeIcon icon={['fab', 'twitter']} /></button>
            <button className="icon-social-media" style={{ background: "#0678b6" }}><FontAwesomeIcon icon={['fab', 'linkedin-in']} /></button>
            <button className="icon-social-media"><img src="images/icon-whatsapp.png" alt="" /> </button>
          </div>
          <div className="col-md-12 f_size_12 text-center mt-3">
            <button className="btn btn-success f_size_13">
              {/* {
                amIModerator ?
                  "Share Link"
                  :
                  "Oops! You not allowed to share"
              } */}
              Share Link
            </button>
          </div>


        </form>
      </div>
    );
  }

  renderInvite() {

    return (
      <div className="invite-right-dropdown" >
        <UncontrolledDropdown nav inNavbar className="float-right">
          <DropdownToggle className="btn btnorange dropdown-toggle f_size_13 mt-2 btnshare" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" nav caret>
            <FontAwesomeIcon icon={['fas', 'share-alt']} /> Invite
        </DropdownToggle>
          <DropdownMenu right className="dropdown-menu invite-dropdown" aria-labelledby="dropdownMenuButton">
            {this.renderFrom()}
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>
    );
  }

  render() {
    const { intl } = this.props;
    const { submitted, mobile, errorMsg } = this.state;

    return (

      this.renderInvite()

    );
  }
}

InviteComponent.propTypes = propTypes;

export default InviteComponent;
