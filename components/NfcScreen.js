import React, {useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  Pressable,
  Alert,
  ScrollView,
} from 'react-native';
import NfcManager, {NfcTech} from 'react-native-nfc-manager';

export default function NfcScreen({ 
  onNavigateBack, 
  nombre,
  isDemoMode = false
}) {
  const [isScanning, setIsScanning] = useState(false);
  const [artifactInfo, setArtifactInfo] = useState(null);
  const [lastScannedTime, setLastScannedTime] = useState(null);

  // Datos de ejemplo para el modo demo
  const demoArtifacts = [
    {
      nombre: "Máscara de Jade Maya",
      descripcion: "Esta magnífica máscara ceremonial representa el poder divino de los gobernantes mayas. Fue tallada en jade verde, piedra considerada más valiosa que el oro para las civilizaciones mesoamericanas. Los intrincados detalles simbolizan la conexión entre el mundo terrenal y el espiritual.",
      epoca: "Período Clásico Maya (250-900 d.C.)",
      origen: "Calakmul, Campeche",
      material: "Jade verde con incrustaciones de obsidiana"
    },
    {
      nombre: "Códice Azteca de Tributos",
      descripcion: "Documento pictográfico que registra los tributos que debían pagar las provincias conquistadas al Imperio Azteca. Incluye representaciones de productos como cacao, plumas de quetzal, mantas y piedras preciosas, revelando la complejidad económica del imperio.",
      epoca: "Siglo XV-XVI d.C.",
      origen: "Tenochtitlan, México",
      material: "Papel amate con pigmentos naturales"
    },
    {
      nombre: "Vaso Ceremonial Zapoteca",
      descripcion: "Elegante recipiente utilizado en ceremonias religiosas zapotecas. Sus diseños geométricos representan elementos cosmogónicos y su forma específica estaba reservada para rituales de los sacerdotes. La técnica de cocción le da su característico color gris.",
      epoca: "Período Clásico Zapoteca (200-700 d.C.)",
      origen: "Monte Albán, Oaxaca",
      material: "Cerámica gris con engobe"
    }
  ];

  // Función para simular escaneo de demo
  const simulateNfcScan = () => {
    setIsScanning(true);
    
    // Simular tiempo de escaneo
    setTimeout(() => {
      const randomArtifact = demoArtifacts[Math.floor(Math.random() * demoArtifacts.length)];
      setArtifactInfo(randomArtifact);
      setLastScannedTime(new Date().toLocaleTimeString());
      setIsScanning(false);
      
      Alert.alert(
        '🎭 Modo Demo Activado', 
        `¡Hola ${nombre}! Has simulado el escaneo de: "${randomArtifact.nombre}"`
      );
    }, 2000);
  };

  const readNfc = async () => {
    // Si está en modo demo, usar simulación
    if (!NfcManager.isSupported() || isDemoMode) {
      simulateNfcScan();
      return;
    }

    // Código NFC real
    try {
      setIsScanning(true);
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag();
      
      if (tag && tag.ndefMessage && tag.ndefMessage.length > 0) {
        const firstRecord = tag.ndefMessage[0];
        if (firstRecord && firstRecord.payload) {
          const decodedPayload = String.fromCharCode.apply(null, firstRecord.payload);
          const cleanPayload = decodedPayload.replace(/^\x02en/, '');
          
          console.log('Información de artefacto leída:', cleanPayload);
          
          // Intentar parsear como JSON si es posible
          let artifactData;
          try {
            artifactData = JSON.parse(cleanPayload);
          } catch (e) {
            // Si no es JSON, usar como texto plano
            artifactData = {
              nombre: 'Artefacto del Museo',
              descripcion: cleanPayload,
              epoca: 'Información no disponible',
              origen: 'Información no disponible'
            };
          }
          
          setArtifactInfo(artifactData);
          setLastScannedTime(new Date().toLocaleTimeString());
          
          Alert.alert(
            '📱 Información Escaneada', 
            `¡Hola ${nombre}! Has escaneado información sobre: "${artifactData.nombre || 'Artefacto del Museo'}"`
          );
        } else {
          Alert.alert('❌ Tag Vacío', 'Este tag NFC no contiene información.');
        }
      } else {
        Alert.alert('❌ Tag Vacío', 'Este tag NFC no contiene información.');
      }
    } catch (ex) {
      console.warn('Error leyendo NFC:', ex);
      Alert.alert('❌ Error', 'No se pudo leer el tag NFC. Asegúrate de mantener el dispositivo cerca del tag.');
    } finally {
      setIsScanning(false);
      NfcManager.cancelTechnologyRequest();
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image style={styles.logo} source={require('../img/QuetzAI.png')} />
      <Text style={styles.title}>
        {isDemoMode ? ' Modo Demo - Información del Museo' : '�🏛️ Información del Museo'}
      </Text>
      <Text style={styles.subtitle}>
        {isDemoMode 
          ? 'Presiona el botón para simular el escaneo de un artefacto aleatorio'
          : 'Acerca tu dispositivo al tag NFC de cualquier artefacto para conocer su historia'
        }
      </Text>
      
      {isDemoMode && (
        <Text style={styles.demoWarning}>
          ⚠️ Estás en modo demostración. Los datos mostrados son ejemplos.
        </Text>
      )}
      
      <Pressable
        style={({pressed}) => [
          {
            backgroundColor: pressed ? (isScanning ? '#005500' : '#008000') : (isScanning ? '#006600' : '#00AA00'),
            borderColor: '#008000',
          },
          styles.button,
        ]}
        onPress={readNfc}
        disabled={isScanning}>
        <Text style={[styles.textInPlace, {color: '#fff'}]}>
          {isScanning 
            ? (isDemoMode ? '🎭 Simulando...' : '📡 Escaneando...') 
            : (isDemoMode ? '🎲 Escanear Demo' : '🔍 Escanear Artefacto')
          }
        </Text>
      </Pressable>

      {/* Mostrar información del artefacto si existe */}
      {artifactInfo && (
        <View style={styles.artifactContainer}>
          <Text style={styles.artifactTitle}>📜 Información del Artefacto</Text>
          
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>🏺 Nombre:</Text>
            <Text style={styles.infoText}>{artifactInfo.nombre || 'No especificado'}</Text>
            
            <Text style={styles.infoLabel}>📝 Descripción:</Text>
            <Text style={styles.infoDescription}>{artifactInfo.descripcion || 'No disponible'}</Text>
            
            {artifactInfo.epoca && (
              <>
                <Text style={styles.infoLabel}>⏳ Época:</Text>
                <Text style={styles.infoText}>{artifactInfo.epoca}</Text>
              </>
            )}
            
            {artifactInfo.origen && (
              <>
                <Text style={styles.infoLabel}>🌍 Origen:</Text>
                <Text style={styles.infoText}>{artifactInfo.origen}</Text>
              </>
            )}
            
            {artifactInfo.material && (
              <>
                <Text style={styles.infoLabel}>🧱 Material:</Text>
                <Text style={styles.infoText}>{artifactInfo.material}</Text>
              </>
            )}
            
            {lastScannedTime && (
              <Text style={styles.timeStamp}>
                ⏰ Escaneado a las: {lastScannedTime}
              </Text>
            )}
          </View>
        </View>
      )}
      
      <Pressable
        style={({pressed}) => [
          {
            backgroundColor: pressed ? '#666' : '#fff',
            borderColor: '#666',
          },
          styles.button,
          styles.backButton
        ]}
        onPress={onNavigateBack}>
        <Text style={[styles.textInPlace, {color: '#666'}]}>← Volver</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: '#333',
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  textInPlace: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  logo: {
    width: 150,
    height: 150,
    alignContent: 'center',
    marginBottom: 20,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    borderWidth: 2,
    fontSize: 18,
    height: 50,
    minWidth: 200,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  backButton: {
    marginTop: 20,
  },
  artifactContainer: {
    width: '100%',
    marginTop: 20,
    marginBottom: 10,
  },
  artifactTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 15,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#34495e',
    marginTop: 10,
    marginBottom: 5,
  },
  infoText: {
    fontSize: 15,
    color: '#2c3e50',
    marginBottom: 8,
    lineHeight: 20,
  },
  infoDescription: {
    fontSize: 15,
    color: '#2c3e50',
    marginBottom: 15,
    lineHeight: 22,
    textAlign: 'justify',
  },
  timeStamp: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
    marginTop: 15,
    fontStyle: 'italic',
  },
  demoWarning: {
    fontSize: 14,
    color: '#f39c12',
    textAlign: 'center',
    backgroundColor: '#fef9e7',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    fontWeight: 'bold',
  },
});
