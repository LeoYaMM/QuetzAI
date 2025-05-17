import React, {useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TextInput,
  Pressable,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Función para guardar el id en el dispositivo
async function guardarIdVisitante(id) {
  try {
    await AsyncStorage.setItem('id_visitante', id.toString());
    console.log('ID guardado correctamente');
  } catch (error) {
    console.error('Error guardando el ID: ', error);
  }
}

// Función para recuperar el id desde el dispositivo
async function obtenerIdVisitante() {
  try {
    const id = await AsyncStorage.getItem('id_visitante');
    if (id !== null) {
      return id;
    }
    return null;
  } catch (error) {
    console.error('Error leyendo el ID: ', error);
  }
}

// Función para enviar los datos al servidor
async function iniciarRegistro(nombre, edad) {
  const resultado = await registrarVisitante(nombre, edad);
  if (resultado && resultado.id_visitante) {
    await guardarIdVisitante(resultado.id_visitante);
    // Continúa con la lógica de la app (por ejemplo, redirigir a la pantalla principal)
  } else {
    console.error('No se pudo registrar al visitante.');
  }
}

// Función para enviar los datos al servidor
async function registrarVisitante(nombre, edad) {
  try {
    const response = await fetch('http://localhost:8000/registrar_visitante', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({nombre, edad}),
    });
    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.error('Error al registrar el visitante: ', error);
    return null;
  }
}

export default function App() {
  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState('');

  // Función que se ejecuta al presionar el botón "INICIAR"
  const handlePress = () => {
    console.log('Nombre:', nombre, 'Edad:', edad);
    iniciarRegistro(nombre, edad);
  };

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
        onChangeText={setNombre} // Actualiza el estado "nombre"
        value={nombre} // Muestra el valor actual del estado
      />
      <TextInput
        style={styles.input}
        placeholder="Edad"
        keyboardType="numeric"
        onChangeText={setEdad} // Actualiza el estado "edad"
        value={edad} // Muestra el valor actual del estado
      />
      <Pressable
        style={({pressed}) => [
          {
            backgroundColor: pressed ? 'black' : '#fff',
            color: pressed ? '#fff' : 'black',
          },
          styles.button,
        ]}
        onPress={handlePress}>
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
