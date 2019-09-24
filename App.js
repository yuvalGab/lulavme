import React, { Component } from 'react'
import { StyleSheet, View, Text, Button } from 'react-native'
import RNShake from 'react-native-shake'

class App extends Component {
  timeout = null
  tempo = 1

  constructor(props) {
    super(props)
    this.state = {
      points: 0
    }
  }

  componentDidMount() {
    this.subscribe()
  }

  componentWillUnmount() {
    this.unsubscribe()
    this.reset()
  }

  subscribe() {
    RNShake.addEventListener('ShakeEvent', () => {
      this.resetTempoIfNoShakeing()
      const { points } = this.state
      this.setState({ points: points + this.tempo * 1 })
      this.tempo = this.tempo + 1
    })
  }

  resetTempoIfNoShakeing() {
    clearTimeout(this.timeout)
    this.timeout = setTimeout(() => {
      this.tempo = 1
    }, 3000)
  }

  unsubscribe() {
    RNShake.removeEventListener('ShakeEvent')
  }

  reset() {
    this.setState({ points: 0 })
    this.tempo = 1
    clearTimeout(this.timeout)
  }

  render() {
    const { points } = this.state

    return (
      <View style={styles.wrapper}>
        <Text style={styles.label}>Points:</Text>
        <Text style={styles.points}>{points}</Text>
        <View style={styles.resetButton}>
          <Button title="Reset" onPress={this.reset.bind(this)} />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  label: {
    fontSize: 24,
    marginBottom: 8
  },
  points: {
    fontSize: 40,
    color: 'red'
  },
  resetButton: {
    marginTop: 100
  }
})

export default App
