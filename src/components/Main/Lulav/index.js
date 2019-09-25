import React from 'react';
import { StyleSheet, Animated } from 'react-native';
import { MainContext } from '../../../App';
import config from '../../../app.config.json';

const image = require('./assets/images/lulav.jpg');

const Lulav = () => (
  <MainContext.Consumer>
    {({ animatedValue }) => {
      const { range, deg } = config.shake;
      return (
        <Animated.Image
          source={image}
          style={{
            ...styles.image,
            transform: [
              {
                rotate: animatedValue.interpolate({
                  inputRange: [-range, range],
                  outputRange: [`-${deg}rad`, `${deg}rad`],
                }),
              },
            ],
          }}
        />
      );
    }}
  </MainContext.Consumer>
);

const styles = StyleSheet.create({
  image: {
    width: 200,
    height: 500,
    resizeMode: 'stretch',
  },
});

export default Lulav;
