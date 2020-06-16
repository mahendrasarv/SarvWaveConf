import React, { Component } from 'react';
import { defineMessages, intlShape } from 'react-intl';
import PropTypes from 'prop-types';

import Modal from '/imports/ui/components/modal/simple/component';

import Service from './service';
import './tooltip.css';
import cx from 'classnames';

import { styles } from './styles';
import './documentStyle.css';

import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import axios from 'axios';
import DocumentList from './Components/DocumentList';
import cookie from 'react-cookies';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { store } from 'react-notifications-component'
import { myconfig } from '/imports/ui/extConfig/extConfig';

library.add(fas);

const propTypes = {
  closeModal: PropTypes.func.isRequired
};

let fileType = {
  'pdf': <span className="for_pdf"><FontAwesomeIcon icon={['fas', 'file-pdf']} /></span>,
  'ppt': <span className="for_ppt"><FontAwesomeIcon icon={['fas', 'file-powerpoint']} /></span>,
  'xlsx': <span className="for_xls"><FontAwesomeIcon icon={['fas', 'file-excel']} /></span>,
  'csv': <span className="for_xls"><FontAwesomeIcon icon={['fas', 'file-excel']} /></span>,
  'doc': <span className="for_word"><FontAwesomeIcon icon={['fas', 'file-word']} /></span>,
  'docx': <span className="for_word"><FontAwesomeIcon icon={['fas', 'file-word']} /></span>,
  'mp3': <span className="for_mp3"><FontAwesomeIcon icon={['fas', 'file-audio']} /></span>,
  'png': <span className="for_img"><FontAwesomeIcon icon={['fas', 'file-image']} /></span>,
  'jpg': <span className="for_img"><FontAwesomeIcon icon={['fas', 'file-image']} /></span>,
  'jpge': <span className="for_img"><FontAwesomeIcon icon={['fas', 'file-image']} /></span>

}


const intlMessages = defineMessages({
  title: {
    id: 'app.user-info.title',
    description: 'User info title label',
  },
});

class DocumentComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      shareURLModal: false,
      conAttach: [],
      loading: false,
      error: false,
      isShareModel: false,
      shareURL: "abcd"
    }
  }

  componentDidMount = () => {

    localStorage.setItem('jwt', cookie.remove('jwt'));
    this.getAttachDocument();

  }


  getAttachDocument = () => {

    this.setState({ loading: true });
    let axiosRequestOptions = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': cookie.load('jwt')
      }
    };

    axios.get(myconfig.apiURL + 'drive/conferenceFileList', axiosRequestOptions)
      .then(response => {
        this.setState({ conAttach: response.data.result, loading: false })
      })
      .catch((error) => {
        this.alertMessage("danger", "Error", error.response.data.error)
        this.setState({ loading: false, error: true })
      });


  }


  shareFileLink = (filePath) => {

    let shareFile = filePath.split("/");
    shareFile.splice(0, 1);
    let newPath = shareFile.join("/");

    let axiosRequestOptions = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': cookie.load('jwt')
      }
    };

    let fileNewPath = "/" + newPath;
    let postData = {
      'filePath': fileNewPath
    }

    axios.post(myconfig.apiURL + 'drive/shareFile', postData, axiosRequestOptions)
      .then(response => {
        if (typeof response.data.error === "undefined") {
          this.setState({ shareURL: response.data.result, isShareModel: true, loading: false })
          this.showModal("shareURLModal")
        }
        else {
          this.alertMessage("danger", "Error", response.data.error.message)
        }
      })
      .catch((error) => {
        this.alertMessage("danger", "Error", error.response.data.error)
        this.setState({ loading: false, error: true })
      });

  }


  deAttachDocument = (id) => {

    this.setState({ loading: true });

    let axiosRequestOptions = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': cookie.load('jwt')
      }
    };

    let postData = {
      'id': id
    }

    axios.post(myconfig.apiURL + 'drive/deleteConfFile', postData, axiosRequestOptions)
      .then(response => {
        this.getAttachDocument();
        this.setState({ loading: false })
        this.alertMessage("success", "Removed", "Successfuly Deattach Document !!!")
      })
      .catch((error) => {
        this.alertMessage("danger", "Error", error.response.data.error)
        this.setState({ loading: false, error: true })
      });

  }


  alertMessage = (type, title, message) => {
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

  closeModal(tabId) {
    this.setState({
      [tabId]: false
    });
  }
  showModal(modal) {
    this.setState({
      [modal]: true
    });
  }

  render() {

    const { intl, closeModal } = this.props;
    const { shareURL } = this.state;

    if (this.state.isShareModel && this.state.shareURL !== null) {

      console.log("XXXXXXXXXXXXXXXXXXSHAREURL", this.state.shareURL);

    }

    let documentsList = null;

    if (this.state.loading) {
      documentsList = <img src="./images/loading.svg" width="150px" height="70px" alt="loader" />;
    } else if (this.state.conAttach.length > 0) {

      documentsList = this.state.conAttach.map(docInfo => {

        return (
          <div className="doc-list" key={docInfo._id} >
            <div className="doc-thumb-img">{docInfo.thumb_path ?
              <img src={docInfo.thumb_path} className="video-thumb" alt={docInfo.fileName} />
              : fileType[docInfo.fileType]}</div>
            <div className="thumb-title">
            {fileType[docInfo.fileType]} 
            <div className="doc-title-text">{docInfo.fileName}</div>
            </div>
            <ul>
              <li><button className="bgskyblue"  >
                <FontAwesomeIcon icon={['fas', 'pen']} />
                <span className="tooltip-ex-text tooltip-ex-bottom">Collaborative</span>
              </button>

              </li>
              <li>
                <button className="bgyellow" data-toggle="tooltip" data-placement="bottom" title="Presentation">
                  <FontAwesomeIcon icon={['fas', 'chalkboard-teacher']} />
                  <span className="tooltip-ex-text tooltip-ex-bottom">Presentation</span>
                </button></li>
              <li>
                <button className="bgperple" data-toggle="tooltip" data-placement="bottom" title="File Sharing" onClick={() => this.shareFileLink(docInfo.path)} >
                  <FontAwesomeIcon icon={['fas', 'share-alt']} />
                  <span className="tooltip-ex-text tooltip-ex-bottom">File Sharing</span>
                </button></li>
              <li>
                <button className="bgred" data-toggle="tooltip" data-placement="bottom" title="Deattach" onClick={() => { if (window.confirm('Are you sure ?')) this.deAttachDocument(docInfo._id) }} >
                  <FontAwesomeIcon icon={['fas', 'trash-alt']} />
                  <span className="tooltip-ex-text tooltip-ex-bottom">Detached</span>
                </button></li>
            </ul>
          </div>
        );
      });


    } else {
      documentsList = (<div className="no_doc_attach"><FontAwesomeIcon icon={['fas', 'file-alt']} /><br/> No attachment document! </div>)
    }


    return (
      <div className="shadowbox document-lft-section">
        {documentsList}
        <Modal
          overlayClassName={styles.overlay}
          className={styles.modal}
          onRequestClose={this.closeModal.bind(this, 'shareURLModal')}
          hideBorder
          isOpen={this.state.shareURLModal}
          shouldShowCloseButton={true}
          contentLabel={"abcd"}
        >

          {/* <Modal isOpen={this.state.shareURLModal} toggle={this.closeModal.bind(this, 'shareURLModal')} className="share_file_model"> */}
          <div className={styles.container}>
            <div className={styles.header}>
              <h2 className={styles.title}><span><FontAwesomeIcon icon={['fas', 'share-square']} /></span> Share File URL</h2>
            </div>
            <div className={styles.description}>
              <div className={styles.file_sharng_sct}>
                <label> Copy and share this link with your contacts.</label>
                <div className={styles.copycoderow}>
                  <div id="shared_url" className={styles.codeurl}>
                    {shareURL}
                  </div>
                  <CopyToClipboard text={shareURL} onCopy={(e) => this.alertMessage("success", "Success", "Copied !!!")}>
                    <button className={styles.copy_btn}><FontAwesomeIcon icon={['fas', 'copy']} /></button>
                  </CopyToClipboard>
                </div>
              </div>
            </div>
          </div>

        </Modal>
      </div>
    );
  }
}

DocumentComponent.propTypes = propTypes;

export default DocumentComponent;
