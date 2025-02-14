import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TextInput,
  Pressable,
} from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require('./img/QuetzAI.png')} />
      <Text style={styles.textLogo1}>
        Quetz
        <Text style={styles.textLogo2}>AI</Text>
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        keyboardType="default"
      />
      <TextInput
        style={styles.input}
        placeholder="Edad"
        keyboardType="numeric"
      />
      <Pressable
        style={({pressed}) => [
          {
            backgroundColor: pressed ? 'black' : '#fff',
            color: pressed ? '#fff' : 'black',
          },
          styles.button,
        ]}>
        <Text style={styles.textInPlace}>INICIAR</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  textLogo1: {
    fontSize: 24,
    color: '#333',
    fontWeight: 'bold',
  },
  textLogo2: {
    fontSize: 24,
    color: '#008000',
    fontWeight: 'bold',
  },
  textInPlace: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
  },
  logo: {
    width: 200,
    height: 200,
    alignContent: 'center',
  },
  input: {
    height: 40,
    width: 150,
    margin: 10,
    borderWidth: 2,
    padding: 10,
    borderRadius: 5,
  },
  button: {
    padding: 10,
    borderRadius: 0,
    borderWidth: 2,
    fontSize: 18,
    height: 45,
    width: 125,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
