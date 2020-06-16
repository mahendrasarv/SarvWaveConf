import React, { Component } from 'react';
import { withModalMounter } from '/imports/ui/components/modal/service';
import Modal from '/imports/ui/components/modal/simple/component';
import Button from '/imports/ui/components/button/component';

import { defineMessages, injectIntl } from 'react-intl';

import axios from 'axios';
import cookie from 'react-cookies';
import { notify } from '/imports/ui/services/notification';
import { styles } from './styles';

import Meetings from '/imports/api/meetings';

import { myconfig } from '/imports/ui/extConfig/extConfig';

import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
library.add(fas);

const intlMessages = defineMessages({
    start: {
        id: 'app.streamVideo.start',
        description: 'Share external video',
    },
    startYouTube: {
        id: 'app.streamVideo.startYouTube',
        description: 'Share external video',
    },
    startRTMP: {
        id: 'app.streamVideo.startRTMP',
        description: 'Share external video',
    },
    urlError: {
        id: 'app.streamVideo.urlError',
        description: 'Not a video URL error',
    },
    input: {
        id: 'app.streamVideo.input',
        description: 'Video URL',
    },
    urlInput: {
        id: 'app.streamVideo.urlInput',
        description: 'URL input field placeholder',
    },
    title: {
        id: 'app.streamVideo.title',
        description: 'Modal title',
    },
    close: {
        id: 'app.streamVideo.close',
        description: 'Close',
    },
    note: {
        id: 'app.streamVideo.noteLabel',
        description: 'provides hint about Shared External videos',
    },
});

class VideoStreaming extends Component {
    constructor(props) {
        super(props);

        this.state = {
            rtmpURL: null,
            meetingId: undefined,
            meetingName: undefined,
            mpPass: null,
            isFormSubmit: false,
            showRtmpUrlInput: false,

            isYoutubeEnable: false,

            isRtmpSubmitEnable: false,

            isError: false,
            errorMsg: ""
        };

        this.clickedOnStream = this.clickedOnStream.bind(this);

        this.startYoutubeStreaming = this.startYoutubeStreaming.bind(this);
        this.startRtmpStreaming = this.startRtmpStreaming.bind(this);

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
            isFormSubmit: true
        });

        const { rtmpURL } = this.state;

        const {
            meetingId,
            meetingName
        } = this.props;

        if (rtmpURL === null || rtmpURL === "") {

            this.setState({
                errorMsg: "Please fill the URL",
                isError: true
            })

            return false;

        } else {

            this.setState({
                isError: false
            })

            return this.startRtmpStreaming(rtmpURL);
        }
    }

    alertMessage = (type, message) => {
        return notify(message, type, "desktop");
    }

    clickedOnStream() {
        this.setState({
            showRtmpUrlInput: true
        })
    }

    backedToNonStream() {
        this.setState({
            showRtmpUrlInput: false
        })
    }

    startYoutubeStreaming() {
        let axiosRequestOptions = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': cookie.load('jwt')
            }
        };

        let meetingId = this.props.meetingId;
        let meetingObject = Meetings.findOne({ meetingId });

        if (meetingObject != null) {

            let externalMeetingId = meetingObject.meetingProp.extId;

            let postData = {
                meetingId: externalMeetingId,
                meetingName: this.props.meetingName,
                mpPass: ""
            }

            axios.post(myconfig.apiURL + 'livestream/startStream', postData, axiosRequestOptions)
                .then(response => {
                    console.log("you res", response)
                    this.alertMessage("success", "Streaming Started")
                })
                .catch((error) => {
                    if (typeof error.response.data.error !== "undefined") {
                        this.alertMessage("error", error.response.data.error)
                    }
                });
        }else{
            this.alertMessage("error","Invalid Meeting Information")
        }


    }

    startRtmpStreaming(url) {
        let axiosRequestOptions = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': cookie.load('jwt')
            }
        };

        let meetingId = this.props.meetingId;
        let meetingObject = Meetings.findOne({ meetingId });

        if (meetingObject != null) {

            let externalMeetingId = meetingObject.meetingProp.extId;

            let postData = {
                meetingId: externalMeetingId,
                meetingName: this.props.meetingName,
                mpPass: "",
                rtmp: url
            }

            axios.post(myconfig.apiURL + 'livestream/startStream', postData, axiosRequestOptions)
                .then(response => {
                    console.log("rtmpl res", response)
                    this.alertMessage("success", "Streaming Started")
                })
                .catch((error) => {
                    if (typeof error.response.data.error !== "undefined") {
                        this.alertMessage("error", error.response.data.error)
                    }
                });
        }else{
            this.alertMessage("error","Invalid Meeting Information")
        }
    }

    render() {

        const { intl, closeModal } = this.props;

        const {
            rtmpURL,
            meetingId,
            meetingName,
            mpPass,
            isFormSubmit,
            isSubmitEnable,
            showRtmpUrlInput,
            isError,
            errorMsg
        } = this.state;

        return (
            <Modal
                overlayClassName={styles.overlay}
                className={styles.modal}
                onRequestClose={closeModal}
                contentLabel={intl.formatMessage(intlMessages.title)}
                hideBorder
            >
                <header data-test="videoModealHeader" className={styles.header}>
                    <h3 className={styles.title}>{intl.formatMessage(intlMessages.title)}</h3>
                </header>

                <div className={styles.content}>
                    {
                        !showRtmpUrlInput ?
                            <div className={styles.videoDiv}>
                                <Button
                                    className={styles.streamBtn}
                                    label={intl.formatMessage(intlMessages.startYouTube)}
                                    // icon="video"
                                    customIcon={<FontAwesomeIcon icon={['fab', 'youtube']} />}

                                    size="jumbo"
                                    onClick={this.startYoutubeStreaming}
                                />
                                <Button
                                    className={styles.streamBtn}
                                    label={intl.formatMessage(intlMessages.startRTMP)}
                                    customIcon={<FontAwesomeIcon icon={['fas', 'video']} />}

                                    size="jumbo"
                                    onClick={this.clickedOnStream}
                                />

                                <div className={styles.externalVideoNote} id="external-video-note">
                                    {intl.formatMessage(intlMessages.note)}
                                </div>
                            </div>
                            :
                            <div className={styles.videoUrl}>
                                <label htmlFor="video-modal-input" id="video-modal-input">
                                    {intl.formatMessage(intlMessages.input)}
                                    <input
                                        id="video-modal-input"
                                        onChange={this.handleChange}
                                        name="rtmpURL"
                                        placeholder={intl.formatMessage(intlMessages.urlInput)}
                                        // disabled={sharing}
                                        value={rtmpURL}
                                        aria-describedby="exernal-video-note"
                                    />
                                </label>
                                {isFormSubmit && isError &&
                                    <div className={styles.urlError}>
                                        {intl.formatMessage(intlMessages.urlError)}
                                    </div>
                                }
                                <div className={styles.externalVideoNote} id="external-video-note">
                                    {intl.formatMessage(intlMessages.note)}
                                </div>

                                <Button
                                    className={styles.startBtn}
                                    label={intl.formatMessage(intlMessages.start)}
                                    onClick={this.handleSubmit}
                                    icon="share"
                                    block
                                    size="lg"
                                />

                            </div>
                    }

                </div>
            </Modal>
        );
    }
}

export default injectIntl(withModalMounter(VideoStreaming));