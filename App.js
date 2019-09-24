import React, { Component } from 'react';
import { StyleSheet, View, Text, Button, Animated, Easing } from 'react-native';
import RNShake from 'react-native-shake';
import KeepAwake from 'react-native-keep-awake';

const lulavImage = require('./assets/images/lulav.jpg');

const config = {
  initial: {
    points: 0,
    tempo: 1,
  },
  shake: {
    diff: 1,
    range: 100,
    deg: 1,
    duration: 200,
  },
  resetTimeout: 2000,
};

class App extends Component {
  timeout = null;
  tempo = config.initial.tempo;
  animatedValue = new Animated.Value(0);
  shakesStack = [];

  constructor(props) {
    super(props);
    this.state = {
      points: config.initial.points,
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

  shakeAnimation() {
    const { diff, duration } = config.shake;
    const toValue = diff * this.tempo;
    const commonOptions = {
      toValue,
      duration: duration * 0.25,
      easing: Easing.linear,
      useNativeDriver: true,
    };

    const animation = Animated.sequence([
      Animated.timing(this.animatedValue, { ...commonOptions }),
      Animated.timing(this.animatedValue, {
        ...commonOptions,
        toValue: -toValue,
        duration: duration * 0.5,
      }),
      Animated.timing(this.animatedValue, { ...commonOptions, toValue: 0.0 }),
    ]);

    this.delayedAnimation(animation, duration);
  }

  delayedAnimation(animation, duration) {
    const delayTimeout = setTimeout(() => {
      animation.start(() => {
        this.shakesStack = this.shakesStack.filter(to => to !== delayTimeout);
      });
    }, duration * this.shakesStack.length);

    this.shakesStack.push(delayTimeout);
  }

  resetTempoIfNoShaking() {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.tempo = config.initial.tempo;
    }, config.resetTimeout);
  }

  reset() {
    const { points, tempo } = config.initial;
    this.setState({ points });
    this.tempo = tempo;
    clearTimeout(this.timeout);
    this.shakesStack.forEach(to => clearTimeout(to));
  }

  render() {
    const { points } = this.state;
    const { range, deg } = config.shake;
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
                    inputRange: [-range, range],
                    outputRange: [`-${deg}rad`, `${deg}rad`],
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
