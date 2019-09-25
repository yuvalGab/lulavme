import React, { createContext, Component } from 'react';
import { StyleSheet, View, Animated, Easing } from 'react-native';
import config from './app.config.json';
import RNShake from 'react-native-shake';
import KeepAwake from 'react-native-keep-awake';
import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';

export const MainContext = createContext({
  animatedValue: null,
});

class App extends Component {
  timeout = null;
  tempo = config.initial.tempo;
  animatedValue = new Animated.Value(0);
  pointsTimeouts = [];
  shakesTimeouts = [];

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
      this.delayedPointIncrement(this.tempo);
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

  delayedPointIncrement(newPoints) {
    const { duration } = config.shake;
    for (let i = 0; i < newPoints; i++) {
      const delayTimeout = setTimeout(() => {
        this.setState(state => ({ points: ++state.points }));
      }, ((duration * this.shakesTimeouts.length) / newPoints) * i);

      this.pointsTimeouts.push(delayTimeout);
    }
  }

  delayedAnimation(animation, duration) {
    const delayTimeout = setTimeout(() => {
      animation.start(() => {
        this.shakesTimeouts = this.shakesTimeouts.filter(
          to => to !== delayTimeout,
        );
      });
    }, duration * this.shakesTimeouts.length);

    this.shakesTimeouts.push(delayTimeout);
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
    [...this.pointsTimeouts, this.shakesTimeouts].forEach(to => {
      clearTimeout(to);
    });
  }

  render() {
    const { points } = this.state;
    return (
      <View style={styles.wrapper}>
        <View style={{ ...styles.centerItems, ...styles.header }}>
          <Header points={points} />
        </View>
        <View style={{ ...styles.centerItems, ...styles.main }}>
          <MainContext.Provider value={{ animatedValue: this.animatedValue }}>
            <Main />
          </MainContext.Provider>
        </View>
        <View style={{ ...styles.centerItems, ...styles.footer }}>
          <Footer reset={this.reset.bind(this)} />
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
  main: {
    flex: 10,
  },
  footer: {
    flex: 1,
  },
});

export default App;
