
import React, { useState, useEffect } from 'react'
import {
  StyleSheet,
  View,
  Text,
  Button
} from 'react-native'
import RNShake from 'react-native-shake'

const App = () => {
  const [points, setPoints] = useState(0)
  let timeout = null
  let tempo = 1
  
  useEffect(() => {
    subscribe()
    return () => {
      unsubscribe()
      reset()
    }
  }, [])
  
  function subscribe() {
    RNShake.addEventListener('ShakeEvent', () => {
      clearTimeout(timeout)
      timeout = setTimeout(()=> {
        tempo = 1
      }, 3000)
      
      const newPoints = points + tempo * 1
      setPoints(newPoints)
      initialPoints = newPoints
      tempo = tempo + 1
    })
  }
  
  function unsubscribe() {
    RNShake.removeEventListener('ShakeEvent')
  }

  function reset() {
    setPoints(0)
    tempo = 1
    clearTimeout(timeout) 
  }

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>Points:</Text>
      <Text style={styles.points}>{points}</Text>
      <View style={styles.resetButton}>
        <Button
          title="Reset"
          onPress={reset}
        />
      </View>
    </View>
  )
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
