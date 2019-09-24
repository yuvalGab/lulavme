import React, { Component } from 'react';
import { StyleSheet, View, Text, Button, Animated, Easing } from 'react-native';
import RNShake from 'react-native-shake';
import KeepAwake from 'react-native-keep-awake';

const lulavImage = require('./assets/images/lulav.jpg')

const config = {
  initialPoint: 0,
  initialTempo: 1,
  resetTimeout: 2000,
};

class App extends Component {
  timeout = null;
  tempo = config.initialTempo;
  animatedValue = new Animated.Value(0);

  constructor(props) {
    super(props);
    this.state = {
      points: config.initialPoint,
    };
  }

  componentDidMount() {
    this.subscribe();
  }

  componentWillUnmount() {
    this.unsubscribe();
    this.reset();
  }

  subscribe() {
    RNShake.addEventListener('ShakeEvent', () => {
      this.resetTempoIfNoShaking();
      const { points } = this.state;
      this.setState({ points: points + this.tempo * 1 });
      this.tempo = this.tempo + 1;
      this.shakeAnimation();
    });
  }

  unsubscribe() {
    RNShake.removeEventListener('ShakeEvent');
  }

  resetTempoIfNoShaking() {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.tempo = config.initialTempo;
    }, config.resetTimeout);
  }

  shakeAnimation() {
    const toValue = 0.05 * this.tempo;
    const duration = 500 / this.tempo;
    const commonOptions = {
      duration,
      easing: Easing.linear,
      useNativeDriver: true,
    };

    Animated.sequence([
      Animated.timing(this.animatedValue, {
        ...commonOptions,
        toValue,
      }),
      Animated.timing(this.animatedValue, {
        ...commonOptions,
        toValue: -toValue,
      }),
      Animated.timing(this.animatedValue, {
        ...commonOptions,
        toValue: 0.0,
      }),
    ]).start();
  }

  reset() {
    this.setState({ points: config.initialPoint });
    this.tempo = config.initialTempo;
    clearTimeout(this.timeout);
  }

  render() {
    const { points } = this.state;

    return (
      <View style={styles.wrapper}>
        <View style={{ ...styles.centerItems, ...styles.header }}>
          <Text style={styles.label}>Points:</Text>
          <Text style={styles.points}>{points}</Text>
        </View>
        <View style={{ ...styles.centerItems, ...styles.main }}>
          <Animated.Image
            source={lulavImage}
            style={{
              ...styles.lulavImage,
              transform: [
                {
                  rotate: this.animatedValue.interpolate({
                    inputRange: [-5, 5],
                    outputRange: ['-0.5rad', '0.5rad'],
                  }),
                },
              ],
            }}
          />
        </View>
        <View style={{ ...styles.centerItems, ...styles.footer }}>
          <Button title="Reset" onPress={this.reset.bind(this)} />
        </View>
        <KeepAwake />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  centerItems: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapper: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flex: 2,
  },
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
  lulavImage: {
    width: 200,
    height: 500,
    resizeMode: 'stretch',
  },
  footer: {
    flex: 1,
  },
});

export default App;
