
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import RNShake from 'react-native-shake';

let counter = 0

const App = () => {
  const [shakes, setShakes] = useState(counter);

  useEffect(() => {
    RNShake.addEventListener('ShakeEvent', () => {
      counter = counter + 1
      setShakes(counter)
    });

    return () => {
      RNShake.removeEventListener('ShakeEvent');
    }
  }, [])

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>Shakes:</Text>
      <Text style={styles.text}>{shakes}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  label: {
    fontSize: 24
  },
  text: {
    fontSize: 18
  }
});

export default App;
