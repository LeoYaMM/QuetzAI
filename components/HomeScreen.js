import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  Pressable,
} from 'react-native';

export default function HomeScreen({ 
  nombre, 
  edad, 
  onNavigateToNfc, 
  onLogout 
}) {
  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require('../img/QuetzAI.png')} />
      <Text style={styles.textLogo1}>
        ¡Bienvenido, <Text style={styles.textLogo2}>{nombre}</Text>!
      </Text>
      <Text style={styles.subtitle}>Edad: {edad} años</Text>
      
      <Pressable
        style={({pressed}) => [
          {
            backgroundColor: pressed ? '#008000' : '#fff',
            borderColor: '#008000',
          },
          styles.button,
        ]}
        onPress={onNavigateToNfc}>
        <Text style={[styles.textInPlace, {color: '#008000'}]}>Escanear NFC</Text>
      </Pressable>
      
      <Pressable
        style={({pressed}) => [
          {
            backgroundColor: pressed ? '#9b59b6' : '#fff',
            borderColor: '#9b59b6',
          },
          styles.button,
        ]}
        onPress={() => onNavigateToNfc(true)}>
        <Text style={[styles.textInPlace, {color: '#9b59b6'}]}>🧪 Modo Demo</Text>
      </Pressable>
      
      <Pressable
        style={({pressed}) => [
          {
            backgroundColor: pressed ? '#ff4444' : '#fff',
            borderColor: '#ff4444',
          },
          styles.button,
        ]}
        onPress={onLogout}>
        <Text style={[styles.textInPlace, {color: '#ff4444'}]}>Cerrar Sesión</Text>
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
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
    textAlign: 'center',
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
  button: {
    padding: 10,
    borderRadius: 0,
    borderWidth: 2,
    fontSize: 18,
    height: 45,
    width: 125,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
});
