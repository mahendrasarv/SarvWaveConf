import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { styles } from '../styles';

const DropdownIconListSeparator = ({ style, className }) =>
  (
    <span style={style} className={cx(styles.separator, className)} />
  );

DropdownIconListSeparator.propTypes = {
  style: PropTypes.shape({}),
  className: PropTypes.string,
};

DropdownIconListSeparator.defaultProps = {
  style: null,
  className: null,
};

export default DropdownIconListSeparator;
