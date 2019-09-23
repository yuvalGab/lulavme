
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';

const App = () => {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>Shakes:</Text>
      <Text style={styles.text}></Text>
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
