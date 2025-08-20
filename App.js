import React, {useState, useEffect} from 'react';
import { Alert, View, Text, StyleSheet } from 'react-native';
import NfcManager from 'react-native-nfc-manager';

// Importar componentes
import LoginScreen from './components/LoginScreen';
import HomeScreen from './components/HomeScreen';
import NfcScreen from './components/NfcScreen';

// Importar utilidades
import { 
  guardarIdVisitante, 
  obtenerIdVisitante, 
  iniciarRegistro 
} from './utils/storage';

export default function App() {
  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState('');
  const [currentScreen, setCurrentScreen] = useState('login'); // 'login', 'home', 'nfc'
  const [nfcEnabled, setNfcEnabled] = useState(false);
  const [idVisitante, setIdVisitante] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Inicializar NFC cuando se monta el componente
  useEffect(() => {
    const initNfc = async () => {
      try {
        setIsLoading(true);
        await NfcManager.start();
        setNfcEnabled(true);
        console.log('NFC iniciado correctamente');
      } catch (ex) {
        console.warn('Error iniciando NFC:', ex);
        setNfcEnabled(false);
      } finally {
        setIsLoading(false);
      }
    };

    initNfc();

    // Cleanup al desmontar el componente
    return () => {
      try {
        NfcManager.stop().catch(console.warn);
      } catch (ex) {
        console.warn('Error cerrando NFC:', ex);
      }
    };
  }, []);

  // Función que se ejecuta al presionar el botón "INICIAR" 
  const handleLogin = async (nombre, edad) => {
    try {
      console.log('Nombre:', nombre, 'Edad:', edad);
      
      // Validación básica
      if (!nombre.trim() || !edad.trim()) {
        Alert.alert('Error', 'Por favor, completa todos los campos');
        return;
      }
      
      // Guardar datos del usuario
      setNombre(nombre);
      setEdad(edad);
      
      // Intentar registrar con el servidor (opcional)
      try {
        const resultado = await iniciarRegistro(nombre, edad);
        if (resultado) {
          const id = await obtenerIdVisitante();
          setIdVisitante(id);
        }
      } catch (error) {
        console.log('Error con servidor, continuando sin registro:', error);
      }
      
      // Navegar a home siempre
      setCurrentScreen('home');
      
    } catch (error) {
      console.error('Error en handleLogin:', error);
      Alert.alert('Error', 'Ocurrió un problema al iniciar sesión');
    }
  };

  // Función para cerrar sesión
  const handleLogout = () => {
    setNombre('');
    setEdad('');
    setIdVisitante(null);
    setCurrentScreen('login');
  };

  // Función de navegación
  const navigateTo = (screen, isDemoMode = false) => {
    if (screen === 'nfc' && isDemoMode) {
      setCurrentScreen('nfc-demo');
    } else {
      setCurrentScreen(screen);
    }
  };

  // Renderizar pantalla actual
  const renderCurrentScreen = () => {
    try {
      switch(currentScreen) {
        case 'login':
          return (
            <LoginScreen onLogin={handleLogin} />
          );
        
        case 'home':
          return (
            <HomeScreen
              nombre={nombre}
              edad={edad}
              onNavigateToNfc={(isDemoMode) => navigateTo('nfc', isDemoMode)}
              onLogout={handleLogout}
            />
          );
        
        case 'nfc':
          return (
            <NfcScreen
              onNavigateBack={() => navigateTo('home')}
              nombre={nombre}
              isDemoMode={false}
            />
          );
        
        case 'nfc-demo':
          return (
            <NfcScreen
              onNavigateBack={() => navigateTo('home')}
              nombre={nombre}
              isDemoMode={true}
            />
          );
        
        default:
          return (
            <LoginScreen onLogin={handleLogin} />
          );
      }
    } catch (error) {
      console.error('Error renderizando pantalla:', error);
      return (
        <View style={fallbackStyles.container}>
          <Text style={fallbackStyles.errorText}>
            Error: No se pudo cargar la aplicación
          </Text>
          <Text style={fallbackStyles.errorDetails}>
            {error.toString()}
          </Text>
        </View>
      );
    }
  };

  // Mostrar loading mientras inicializa
  if (isLoading) {
    return (
      <View style={fallbackStyles.container}>
        <Text style={fallbackStyles.loadingText}>Cargando QuetzAI...</Text>
      </View>
    );
  }

  return renderCurrentScreen();
}

const fallbackStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  loadingText: {
    fontSize: 18,
    color: '#333',
  },
  errorText: {
    fontSize: 18,
    color: '#ff0000',
    textAlign: 'center',
    marginBottom: 10,
  },
  errorDetails: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});