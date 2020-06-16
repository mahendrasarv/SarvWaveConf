import React, { PureComponent } from 'react';
import cx from 'classnames';
import { styles } from './styles.scss';
import DesktopShare from './desktop-share/component';
import ActionsDropdown from './actions-dropdown/component';
import QuickPollDropdown from './quick-poll-dropdown/component';
import AudioControlsContainer from '../audio/audio-controls/container';
import JoinVideoOptionsContainer from '../video-provider/video-button/container';
import CaptionsButtonContainer from '/imports/ui/components/actions-bar/captions/container';
import PresentationOptionsContainer from './presentation-options/component';
import BreakOutRoom from './action-break-out-room/component'
import LockViewersContainer from './action-lock-viewers/component'
import EndMeetingAction from './end-meeting/component'
import Settings from './action-settings/component'
import WriteCaptionAction from './action-caption-closed/component'
import VideoStreamingAction from './action-streaming/component'

import CaptionsService from '/imports/ui/components/captions/service';
import Recordings from './action-record/component'
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { isMobile } from "react-device-detect";
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
library.add(fas);
class ActionsBar extends PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      isDropdownOpen: false
    };
  }

  toggle = () => {
    this.setState({
      isDropdownOpen: !this.state.isDropdownOpen,

    });
  }

  render() {
    const { isDropdownOpen } = this.state;
    const {
      amIPresenter,
      handleExitVideo,
      handleJoinVideo,
      handleShareScreen,
      handleUnshareScreen,
      isVideoBroadcasting,
      amIModerator,
      screenSharingCheck,
      enableVideo,
      isLayoutSwapped,
      toggleSwapLayout,
      handleTakePresenter,
      intl,
      currentSlidHasContent,
      parseCurrentSlideContent,
      isSharingVideo,
      screenShareEndAlert,
      stopExternalVideoShare,
      screenshareDataSavingSetting,
      isCaptionsAvailable,
      isMeteorConnected,
      isPollingEnabled,
      isThereCurrentPresentation,
      allowExternalVideo,

      isBreakoutRecordable,
      meetingIsBreakout
    } = this.props;

    const actionBarClasses = {};

    actionBarClasses[styles.centerWithActions] = amIPresenter;
    actionBarClasses[styles.center] = true;
    actionBarClasses[styles.mobileLayoutSwapped] = isLayoutSwapped && amIPresenter;

    return (
      <div className={styles.actionsbar}>
        {
          isMobile ? (
            <>
              <div className={styles.right}>
                <ActionsDropdown {...{
                  amIPresenter,
                  amIModerator,
                  isPollingEnabled,
                  allowExternalVideo,
                  handleTakePresenter,
                  intl,
                  isSharingVideo,
                  stopExternalVideoShare,
                  isMeteorConnected,
                }}
                />
                {isPollingEnabled
                  ? (
                    <QuickPollDropdown
                      {...{
                        currentSlidHasContent,
                        intl,
                        amIPresenter,
                        parseCurrentSlideContent,
                      }}
                    />
                  ) : null
                }
                {isCaptionsAvailable
                  ? (
                    <CaptionsButtonContainer {...{ intl }} />
                  )
                  : null
                }
              </div>
              <div className={cx(actionBarClasses)}>
                <AudioControlsContainer />
                {enableVideo
                  ? (
                    <JoinVideoOptionsContainer
                      handleJoinVideo={handleJoinVideo}
                      handleCloseVideo={handleExitVideo}
                    />
                  )
                  : null}

                {/* {
                  isMeteorConnected
                    ?
                    <Settings {...{
                      isMeteorConnected
                    }}
                    />
                    : null
                } */}

                 {
                    isMeteorConnected
                      ?
                      <Recordings {...{
                        amIModerator,
                        isMeteorConnected
                      }}
                      />
                      : null
                  }

              </div>
              <div className={styles.right}>
                {isLayoutSwapped
                  ? (
                    <PresentationOptionsContainer
                      toggleSwapLayout={toggleSwapLayout}
                      isThereCurrentPresentation={isThereCurrentPresentation}
                    />
                  )
                  : null
                }
              </div>

              {
                amIModerator ?
                  <div className={styles.right}>
                    <EndMeetingAction
                      {...{

                        amIModerator,
                        intl,
                        isMeteorConnected,
                      }}
                    />
                  </div>
                  : null
              }

              {
                amIModerator ?
                  <Dropdown className={styles.mobiledropDown} direction="up" isOpen={isDropdownOpen} toggle={this.toggle}>
                    <DropdownToggle className={styles.mobiledropToggle}>
                      <FontAwesomeIcon icon={['fas', 'ellipsis-v']} />
                    </DropdownToggle>
                    <DropdownMenu className={styles.mobiledropDownMenu}>
                      <ul>
                        <li>
                          <BreakOutRoom {...{
                            amIModerator,
                            isMeteorConnected,
                            isBreakoutRecordable
                          }}
                          />
                        </li>
                        <li>
                          {
                            !meetingIsBreakout && isMeteorConnected ?
                              <LockViewersContainer {...{
                                amIModerator,
                                isMeteorConnected,
                                isBreakoutRecordable
                              }}
                              /> : null
                          }
                        </li>
                        <li>
                          {
                            amIModerator && CaptionsService.isCaptionsEnabled() && isMeteorConnected
                              ?
                              <WriteCaptionAction {...{
                                amIModerator,
                                isMeteorConnected,
                                isBreakoutRecordable
                              }}
                              />
                              : null
                          }
                        </li>
                        {/* <li>
                          {
                            isMeteorConnected
                              ?
                              <Settings {...{
                                isMeteorConnected
                              }}
                              />
                              : null
                          }
                        </li> */}
                        <li>
                          {
                            isMeteorConnected ?
                              <VideoStreamingAction {...{
                                amIModerator,
                                isMeteorConnected,
                              }}
                              /> : null
                          }
                        </li>

                      </ul>
                    </DropdownMenu>
                  </Dropdown>
                  :
                  null
              }
            </>

          ) :
            (
              <>
                <div className={styles.left}>
                  <ActionsDropdown {...{
                    amIPresenter,
                    amIModerator,
                    isPollingEnabled,
                    allowExternalVideo,
                    handleTakePresenter,
                    intl,
                    isSharingVideo,
                    stopExternalVideoShare,
                    isMeteorConnected,
                  }}
                  />
                  {isPollingEnabled
                    ? (
                      <QuickPollDropdown
                        {...{
                          currentSlidHasContent,
                          intl,
                          amIPresenter,
                          parseCurrentSlideContent,
                        }}
                      />
                    ) : null
                  }
                  {isCaptionsAvailable
                    ? (
                      <CaptionsButtonContainer {...{ intl }} />
                    )
                    : null
                  }
                </div>
                <div className={cx(actionBarClasses)}>
                  <AudioControlsContainer />
                  {enableVideo
                    ? (
                      <JoinVideoOptionsContainer
                        handleJoinVideo={handleJoinVideo}
                        handleCloseVideo={handleExitVideo}
                      />
                    )
                    : null}
                  <DesktopShare {...{
                    handleShareScreen,
                    handleUnshareScreen,
                    isVideoBroadcasting,
                    amIPresenter,
                    screenSharingCheck,
                    screenShareEndAlert,
                    isMeteorConnected,
                    screenshareDataSavingSetting,
                  }}
                  />
                  {
                    isMeteorConnected ?
                      <VideoStreamingAction {...{
                        amIModerator,
                        isMeteorConnected,
                      }}
                      /> : null
                  }
                  <BreakOutRoom {...{
                    amIModerator,
                    isMeteorConnected,
                    isBreakoutRecordable
                  }}
                  />
                  {
                    !meetingIsBreakout && isMeteorConnected ?
                      <LockViewersContainer {...{
                        amIModerator,
                        isMeteorConnected,
                        isBreakoutRecordable
                      }}
                      /> : null
                  }

                  {
                    amIModerator && CaptionsService.isCaptionsEnabled() && isMeteorConnected
                      ?
                      <WriteCaptionAction {...{
                        amIModerator,
                        isMeteorConnected,
                        isBreakoutRecordable
                      }}
                      />
                      : null
                  }

                  {
                    isMeteorConnected
                      ?
                      <Settings {...{
                        isMeteorConnected
                      }}
                      />
                      : null
                  }

                  {
                    isMeteorConnected
                      ?
                      <Recordings {...{
                        amIModerator,
                        isMeteorConnected
                      }}
                      />
                      : null
                  }

                </div>
                <div className={styles.right}>
                  {isLayoutSwapped
                    ? (
                      <PresentationOptionsContainer
                        toggleSwapLayout={toggleSwapLayout}
                        isThereCurrentPresentation={isThereCurrentPresentation}
                      />
                    )
                    : null
                  }
                </div>
                {
                  amIModerator ?
                    <div className={styles.right}>
                      <EndMeetingAction
                        {...{

                          amIModerator,
                          intl,
                          isMeteorConnected,
                        }}
                      />
                    </div>
                    : null
                }
              </>
            )
        }

      </div>
    )
  }
}

export default ActionsBar;
