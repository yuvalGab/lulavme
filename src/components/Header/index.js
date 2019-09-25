import React, { memo, Fragment } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text } from 'react-native';

const Header = memo(({ points }) => (
  <Fragment>
    <Text style={styles.label}>Points:</Text>
    <Text style={styles.points}>{points}</Text>
  </Fragment>
));

Header.propTypes = {
  points: PropTypes.number.isRequired,
};

const styles = StyleSheet.create({
  label: {
    fontSize: 24,
    marginBottom: 8,
  },
  points: {
    fontSize: 40,
    color: 'red',
  },
  main: {
    flex: 10,
  },
});

export default Header;
