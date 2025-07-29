import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TextInput,
  Pressable,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NfcManager, {NfcEvents, NfcTech} from 'react-native-nfc-manager';

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
    return true; // Éxito
  } else {
    console.error('No se pudo registrar al visitante.');
    return false; // Fallo
  }
}

// Función para enviar los datos al servidor
async function registrarVisitante(nombre, edad) {
  try {
    const response = await fetch('http://10.0.2.2:8000/registrar_visitante', {
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
  const [currentScreen, setCurrentScreen] = useState('login'); // 'login', 'home', 'nfc'
  const [nfcEnabled, setNfcEnabled] = useState(false);

  // Inicializar NFC cuando se monta el componente
  useEffect(() => {
    const initNfc = async () => {
      try {
        await NfcManager.start();
        setNfcEnabled(true);
        console.log('NFC iniciado correctamente');
        
        NfcManager.setEventListener(NfcEvents.DiscoverTag, tag => {
          console.warn('Tag NFC encontrado:', tag);
        });
      } catch (ex) {
        console.warn('Error iniciando NFC:', ex);
        setNfcEnabled(false);
      }
    };

    initNfc();

    // Cleanup al desmontar el componente
    return () => {
      NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
      NfcManager.stop();
    };
  }, []);

  // Función para leer NFC
  const readNfc = async () => {
    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag();
      console.warn('Tag NFC leído:', tag);
      // Aqui se va a procesar la info del tag NFC
      return tag;
    } catch (ex) {
      console.warn('Error leyendo NFC:', ex);
      return null;
    } finally {
      NfcManager.cancelTechnologyRequest();
    }
  };

  // Función que se ejecuta al presionar el botón "INICIAR"
  const handlePress = async () => {
    console.log('Nombre:', nombre, 'Edad:', edad);
    
    // Validación básica
    if (!nombre.trim() || !edad.trim()) {
      console.log('Por favor, completa todos los campos');
      return;
    }
    
    // Por ahora navegamos directamente sin servidor
    // Más tarde puedes descomentar esta línea cuando tengas el servidor:
    // const resultado = await iniciarRegistro(nombre, edad);
    // if (resultado) {
    //   setCurrentScreen('home');
    // }
    
    // Navegación directa para pruebas (sin servidor)
    setCurrentScreen('home');
  };

  // Función de navegación
  const navigateTo = (screen) => {
    setCurrentScreen(screen);
  };

  // Renderizar pantalla actual
  const renderCurrentScreen = () => {
    switch(currentScreen) {
      case 'login':
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
              onChangeText={setNombre}
              value={nombre}
            />
            <TextInput
              style={styles.input}
              placeholder="Edad"
              keyboardType="numeric"
              onChangeText={setEdad}
              value={edad}
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
      
      case 'home':
        return (
          <View style={styles.container}>
            <Image style={styles.logo} source={require('./img/QuetzAI.png')} />
            <Text style={styles.textLogo1}>
              ¡Bienvenido <Text style={styles.textLogo2}>{nombre}</Text>!
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
              onPress={() => navigateTo('nfc')}>
              <Text style={[styles.textInPlace, {color: '#008000'}]}>Escanear NFC</Text>
            </Pressable>
            
            <Pressable
              style={({pressed}) => [
                {
                  backgroundColor: pressed ? '#ff4444' : '#fff',
                  borderColor: '#ff4444',
                },
                styles.button,
              ]}
              onPress={() => {
                setNombre('');
                setEdad('');
                navigateTo('login');
              }}>
              <Text style={[styles.textInPlace, {color: '#ff4444'}]}>Cerrar Sesión</Text>
            </Pressable>
          </View>
        );
      
      case 'nfc':
        return (
          <View style={styles.container}>
            <Image style={styles.logo} source={require('./img/QuetzAI.png')} />
            <Text style={styles.textLogo1}>
              Pantalla <Text style={styles.textLogo2}>NFC</Text>
            </Text>
            <Text style={styles.subtitle}>
              {nfcEnabled ? 'NFC listo para escanear' : 'NFC no disponible'}
            </Text>
            <Text style={styles.subtitle}>Usuario: {nombre}</Text>
            
            <Pressable
              style={({pressed}) => [
                {
                  backgroundColor: pressed ? '#008000' : '#fff',
                  borderColor: '#008000',
                  opacity: nfcEnabled ? 1 : 0.5,
                },
                styles.button,
              ]}
              onPress={async () => {
                if (nfcEnabled) {
                  console.log('Iniciando escaneo NFC...');
                  const tag = await readNfc();
                  if (tag) {
                    console.log('NFC escaneado exitosamente:', tag);
                    // Aquí puedes agregar lógica adicional
                  }
                } else {
                  console.log('NFC no está disponible');
                }
              }}
              disabled={!nfcEnabled}>
              <Text style={[styles.textInPlace, {color: '#008000'}]}>
                {nfcEnabled ? 'Escanear NFC' : 'NFC No Disponible'}
              </Text>
            </Pressable>
            
            <Pressable
              style={({pressed}) => [
                {
                  backgroundColor: pressed ? 'black' : '#fff',
                  color: pressed ? '#fff' : 'black',
                },
                styles.button,
              ]}
              onPress={() => navigateTo('home')}>
              <Text style={styles.textInPlace}>Volver</Text>
            </Pressable>
          </View>
        );
      
      default:
        return (
          <View style={styles.container}>
            <Text>Error: Pantalla no encontrada</Text>
          </View>
        );
    }
  };

  return renderCurrentScreen();
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
    margin: 5,
  },
});