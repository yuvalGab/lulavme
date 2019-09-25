import React, { memo, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-native';

const Footer = memo(({ reset }) => (
  <Fragment>
    <Button title="Reset" onPress={reset} />
  </Fragment>
));

Footer.propTypes = {
  reset: PropTypes.func.isRequired,
};

export default Footer;
