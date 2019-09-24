import React, { Component } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import RNShake from 'react-native-shake';
import KeepAwake from 'react-native-keep-awake';

const config = {
  initialPoint: 0,
  initialTempo: 1,
  resetTimeout: 2000,
};

class App extends Component {
  timeout = null;
  tempo = config.initialTempo;

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
    });
  }

  resetTempoIfNoShaking() {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.tempo = config.initialTempo;
    }, config.resetTimeout);
  }

  unsubscribe() {
    RNShake.removeEventListener('ShakeEvent');
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
        <Text style={styles.label}>Points:</Text>
        <Text style={styles.points}>{points}</Text>
        <View style={styles.resetButton}>
          <Button title="Reset" onPress={this.reset.bind(this)} />
        </View>
        <KeepAwake />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 24,
    marginBottom: 8,
  },
  points: {
    fontSize: 40,
    color: 'red',
  },
  resetButton: {
    marginTop: 100,
  },
});

export default App;
