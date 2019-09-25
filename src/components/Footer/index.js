import React, { memo, Fragment, PropTypes } from 'react';
import { StyleSheet, Button } from 'react-native';

const Footer = memo(({ reset }) => (
  <Fragment>
    <Button title="Reset" onPress={reset} />
  </Fragment>
));

Footer.propTypes = {
  reset: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({});

export default Footer;
