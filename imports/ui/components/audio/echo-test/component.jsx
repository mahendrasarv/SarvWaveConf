import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Session } from 'meteor/session';
import Button from '/imports/ui/components/button/component';
import { defineMessages, intlShape, injectIntl } from 'react-intl';
import { styles } from './styles';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
library.add(fas);



const intlMessages = defineMessages({
  confirmLabel: {
    id: 'app.audioModal.yes',
    description: 'Hear yourself yes',
  },
  disconfirmLabel: {
    id: 'app.audioModal.no',
    description: 'Hear yourself no',
  },
  confirmAriaLabel: {
    id: 'app.audioModal.yes.arialabel',
    description: 'provides better context for yes btn label',
  },
  disconfirmAriaLabel: {
    id: 'app.audioModal.no.arialabel',
    description: 'provides better context for no btn label',
  },
});

const propTypes = {
  handleYes: PropTypes.func.isRequired,
  handleNo: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
};

class EchoTest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false,
    };
    this.handleYes = props.handleYes.bind(this);
    this.handleNo = props.handleNo.bind(this);
  }

  componentDidMount() {
    Session.set('inEchoTest', true);
  }

  componentWillUnmount() {
    Session.set('inEchoTest', false);
  }

  render() {
    const {
      intl,
    } = this.props;
    const disableYesButtonClicked = callback => () => {
      this.setState({ disabled: true }, callback);
    };
    return (
      <span className={styles.echoTest}>
        <Button
          className={styles.button}
          customIcon={<FontAwesomeIcon icon={['fas', 'volume-up']}/>}
          color="success"
          size="jumbo"
          onClick={disableYesButtonClicked(this.handleYes)}
        >

        <div className={styles.yeslabel}>
        {intl.formatMessage(intlMessages.confirmLabel)}
        </div>
      </Button>
        <Button
          className={styles.button}
          color="danger"
          size="jumbo"
          onClick={this.handleNo}
          customIcon={<FontAwesomeIcon icon={['fas', 'volume-mute']}/>}
        >
        <div className={styles.nolabel}>
        {intl.formatMessage(intlMessages.disconfirmLabel)}
        </div>
        </Button>
      </span>
    );
  }
}

export default injectIntl(EchoTest);

EchoTest.propTypes = propTypes;
